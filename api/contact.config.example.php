<?php

return [
    'allowed_hosts' => ['live-ons.com', 'www.live-ons.com'],
    'turnstile_secret' => 'YOUR_CLOUDFLARE_TURNSTILE_SECRET_KEY',

    'smtp' => [
        'host' => 'sv17112.xserver.jp',
        'port' => 465,
        'secure' => 'ssl',
        'username' => 'info@live-ons.com',
        'password' => 'YOUR_REISSUED_SMTP_PASSWORD',
    ],

    'mail' => [
        'admin_to' => 'info@live-ons.com',
        'from' => 'info@live-ons.com',
        'from_name' => '株式会社ライブオンズ',
        'admin_subject' => '【LIVEONS】ホームページからのお問い合わせ',
        'auto_reply_subject' => '【LIVEONS】お問い合わせを受け付けました',
    ],

    'rate_limit' => [
        'ip_10min' => ['window' => 600, 'max' => 3],
        'ip_day' => ['window' => 86400, 'max' => 10],
        'email_hour' => ['window' => 3600, 'max' => 3],
    ],
];
