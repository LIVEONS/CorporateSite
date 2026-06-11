# Liveons HP

ローカルで制作中のサイトをライブビュー確認するための起動設定です。

```sh
npm run dev
```

起動後に表示される `http://127.0.0.1:4173/` をブラウザで開くと、HTML / CSS / JSX / 画像などを保存したタイミングで自動リロードされます。

## お問い合わせフォーム

本番環境では `contact.jsx` から `api/contact.php` へPOSTし、PHPでCloudflare Turnstile検証とSMTP送信を行います。

### 本番反映前の準備

1. PHPMailerを配置します。

```sh
composer install --no-dev
```

Composerをサーバー上で使わない場合は、ローカルで生成した `vendor/` をアップロードしてください。

2. 設定ファイルを作成します。

推奨配置は、公開ディレクトリ外です。XServerで `public_html` を公開ディレクトリとして使う場合は、`public_html` と同じ階層に配置します。

```sh
cp api/contact.config.example.php ../liveons-contact-config.php
```

`../liveons-contact-config.php` に以下を設定してください。

- `turnstile_secret`: Cloudflare Turnstile Secret Key
- `smtp.password`: 再発行後のSMTPパスワード

公開ディレクトリ内へ置く場合は `api/contact.config.php` として配置できますが、原則として公開ディレクトリ外への配置を推奨します。

### 現在の送信設定

- 管理者宛先: `info@live-ons.com`
- SMTP: `sv17112.xserver.jp`
- ポート: `465`
- 暗号化: `SSL/TLS`
- 送信元: `株式会社ライブオンズ <info@live-ons.com>`
- Turnstile Site Key: `0x4AAAAAADiidKoYsm0RVERD`
