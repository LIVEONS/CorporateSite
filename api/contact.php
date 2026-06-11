<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function load_config(): array
{
    $paths = [
        __DIR__ . '/../liveons-contact-config.php',
        __DIR__ . '/contact.config.php',
    ];

    foreach ($paths as $path) {
        if (is_file($path)) {
            $config = require $path;
            if (is_array($config)) return $config;
        }
    }

    respond(500, ['ok' => false, 'message' => '送信設定が未設定です。']);
}

function client_ip(): string
{
    $candidates = [
        $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '',
        explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')[0] ?? '',
        $_SERVER['REMOTE_ADDR'] ?? '',
    ];

    foreach ($candidates as $candidate) {
        $ip = trim($candidate);
        if (filter_var($ip, FILTER_VALIDATE_IP)) return $ip;
    }

    return 'unknown';
}

function input_text(array $input, string $key, int $max): string
{
    $value = $input[$key] ?? '';
    if (!is_string($value)) return '';
    $value = trim(str_replace(["\r\n", "\r"], "\n", $value));
    return mb_substr($value, 0, $max, 'UTF-8');
}

function assert_allowed_origin(array $config): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') return;

    $host = parse_url($origin, PHP_URL_HOST);
    $allowed = $config['allowed_hosts'] ?? [];
    if (!$host || !in_array($host, $allowed, true)) {
        respond(403, ['ok' => false, 'message' => '送信元を確認できませんでした。']);
    }
}

function validate_turnstile(string $secret, string $token, string $ip): bool
{
    if ($secret === '' || $token === '') return false;

    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $ip,
    ]);

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => 8,
        ],
    ]);

    $response = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $context);
    if ($response === false) return false;

    $result = json_decode($response, true);
    return is_array($result) && ($result['success'] ?? false) === true;
}

function rate_limit_dir(): string
{
    return rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'liveons-contact-rate-limit';
}

function check_rate_limit(string $bucket, int $window, int $max): bool
{
    $dir = rate_limit_dir();
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        error_log('[liveons-contact] failed to create rate limit directory');
        return true;
    }

    $file = $dir . DIRECTORY_SEPARATOR . hash('sha256', $bucket) . '.json';
    $now = time();
    $fp = @fopen($file, 'c+');
    if (!$fp) return true;

    try {
        flock($fp, LOCK_EX);
        $contents = stream_get_contents($fp);
        $events = json_decode($contents ?: '[]', true);
        if (!is_array($events)) $events = [];

        $events = array_values(array_filter($events, fn($time) => is_int($time) && $time > ($now - $window)));
        if (count($events) >= $max) return false;

        $events[] = $now;
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($events));
        return true;
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}

function enforce_rate_limits(array $config, string $ip, string $email): void
{
    $limits = $config['rate_limit'] ?? [];
    $checks = [
        ['ip:' . $ip . ':10min', $limits['ip_10min'] ?? ['window' => 600, 'max' => 3]],
        ['ip:' . $ip . ':day', $limits['ip_day'] ?? ['window' => 86400, 'max' => 10]],
        ['email:' . mb_strtolower($email, 'UTF-8') . ':hour', $limits['email_hour'] ?? ['window' => 3600, 'max' => 3]],
    ];

    foreach ($checks as [$bucket, $limit]) {
        if (!check_rate_limit($bucket, (int)$limit['window'], (int)$limit['max'])) {
            respond(429, ['ok' => false, 'message' => '送信回数が上限に達しました。しばらく時間をおいてから再度お試しください。']);
        }
    }
}

function inquiry_text(array $data): string
{
    return implode("\n", [
        'お名前：',
        $data['name'],
        '',
        '会社名／屋号：',
        $data['company'] !== '' ? $data['company'] : '未入力',
        '',
        'メールアドレス：',
        $data['email'],
        '',
        '電話番号：',
        $data['tel'] !== '' ? $data['tel'] : '未入力',
        '',
        'お問い合わせ種別：',
        $data['type'],
        '',
        'お問い合わせ内容：',
        $data['body'],
    ]);
}

function admin_body(array $data, string $ip): string
{
    return implode("\n", [
        'ホームページからお問い合わせがありました。',
        '',
        '────────────────────',
        'お問い合わせ内容',
        '────────────────────',
        '',
        inquiry_text($data),
        '',
        '────────────────────',
        '送信情報',
        '────────────────────',
        '',
        '送信日時：' . date('Y-m-d H:i:s'),
        'IPアドレス：' . $ip,
    ]);
}

function auto_reply_body(array $data, string $from): string
{
    return implode("\n", [
        $data['name'] . ' 様',
        '',
        'このたびは株式会社ライブオンズへお問い合わせいただき、誠にありがとうございます。',
        '以下の内容でお問い合わせを受け付けました。',
        '',
        '内容を確認のうえ、担当者より順次ご返信いたします。',
        '今しばらくお待ちくださいますようお願いいたします。',
        '',
        '────────────────────',
        'お問い合わせ内容',
        '────────────────────',
        '',
        inquiry_text($data),
        '',
        '────────────────────',
        '',
        '※本メールは自動送信です。',
        '※お心当たりのない場合は、お手数ですが ' . $from . ' までご連絡ください。',
        '',
        '株式会社ライブオンズ',
        $from,
    ]);
}

function load_mailer(): void
{
    $paths = [
        __DIR__ . '/../vendor/autoload.php',
        __DIR__ . '/vendor/autoload.php',
    ];

    foreach ($paths as $path) {
        if (is_file($path)) {
            require_once $path;
            return;
        }
    }

    respond(500, ['ok' => false, 'message' => 'メール送信ライブラリが未配置です。']);
}

function base_mailer(array $config): PHPMailer
{
    $smtp = $config['smtp'];
    $mailConfig = $config['mail'];

    $mailer = new PHPMailer(true);
    $mailer->CharSet = 'UTF-8';
    $mailer->Encoding = 'base64';
    $mailer->isSMTP();
    $mailer->Host = $smtp['host'];
    $mailer->SMTPAuth = true;
    $mailer->Username = $smtp['username'];
    $mailer->Password = $smtp['password'];
    $mailer->Port = (int)$smtp['port'];
    $mailer->SMTPSecure = ($smtp['secure'] ?? 'ssl') === 'starttls'
        ? PHPMailer::ENCRYPTION_STARTTLS
        : PHPMailer::ENCRYPTION_SMTPS;
    $mailer->setFrom($mailConfig['from'], $mailConfig['from_name']);
    return $mailer;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => '許可されていないメソッドです。']);
}

$config = load_config();
assert_allowed_origin($config);

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    respond(400, ['ok' => false, 'message' => '送信内容を読み取れませんでした。']);
}

if (input_text($input, 'website', 200) !== '') {
    respond(200, ['ok' => true]);
}

$data = [
    'name' => input_text($input, 'name', 100),
    'company' => input_text($input, 'company', 120),
    'email' => input_text($input, 'email', 160),
    'tel' => input_text($input, 'tel', 40),
    'type' => input_text($input, 'type', 80),
    'body' => input_text($input, 'body', 4000),
];
$agree = (bool)($input['agree'] ?? false);
$turnstileToken = input_text($input, 'turnstileToken', 2048);
$allowedTypes = ['事業に関するお問い合わせ', '取材・協業のご相談', 'その他'];

if ($data['name'] === '' || $data['email'] === '' || $data['type'] === '' || $data['body'] === '' || !$agree) {
    respond(422, ['ok' => false, 'message' => '必須項目を入力してください。']);
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'message' => 'メールアドレスの形式が正しくありません。']);
}
if (!in_array($data['type'], $allowedTypes, true)) {
    respond(422, ['ok' => false, 'message' => 'お問い合わせ種別を確認してください。']);
}

$ip = client_ip();
enforce_rate_limits($config, $ip, $data['email']);

if (!validate_turnstile((string)($config['turnstile_secret'] ?? ''), $turnstileToken, $ip)) {
    respond(400, ['ok' => false, 'message' => '認証に失敗しました。もう一度お試しください。']);
}

load_mailer();

try {
    $admin = base_mailer($config);
    $admin->addAddress($config['mail']['admin_to']);
    $admin->addReplyTo($data['email'], $data['name']);
    $admin->Subject = $config['mail']['admin_subject'];
    $admin->Body = admin_body($data, $ip);
    $admin->send();

    $reply = base_mailer($config);
    $reply->addAddress($data['email'], $data['name']);
    $reply->addReplyTo($config['mail']['from'], $config['mail']['from_name']);
    $reply->Subject = $config['mail']['auto_reply_subject'];
    $reply->Body = auto_reply_body($data, $config['mail']['from']);
    $reply->send();
} catch (MailException $error) {
    error_log('[liveons-contact] mail error: ' . $error->getMessage());
    respond(500, ['ok' => false, 'message' => '送信に失敗しました。時間をおいて再度お試しください。']);
}

respond(200, ['ok' => true]);
