# 動画差し替え source

動画は `assets/videos/` に下記ファイル名で配置してください。
TOPヒーロー背景で使用する想定です。

## 必須動画

| No. | 用途 | 配置ファイル名 | 推奨仕様 | 目標容量 |
|---:|---|---|---|---|
| 01 | トップヒーロー背景 PC用 | [`assets/videos/liveons-hero-main.mp4`](../assets/videos/liveons-hero-main.mp4) | MP4 / H.264 / 16:9 / 1600x900〜1920x1080 / 24fps / 音声なし | 3〜6MB |
| 02 | トップヒーロー背景 スマートフォン用 | [`assets/videos/liveons-hero-main-mobile.mp4`](../assets/videos/liveons-hero-main-mobile.mp4) | MP4 / H.264 / 16:9 / 960x540〜1280x720 / 24fps / 音声なし | 1〜3MB |

## 関連画像

| No. | 用途 | 配置ファイル名 | 推奨仕様 |
|---:|---|---|---|
| 03 | 動画読み込み前・省データ環境用ポスター | [`assets/images/liveons-hero-poster.jpg`](../assets/images/liveons-hero-poster.jpg) | JPG / 16:9 / 1600x900 以上 |

## 補足

- MOVのままではなく、Web配信用にMP4へ変換して配置してください。
- 背景動画のため音声トラックは不要です。
- PC用とスマートフォン用を分けることで、スマートフォンで重い動画を読ませない構成にできます。
- 実装時は `shared.jsx` の `VIDEO_ASSETS.heroMain` / `VIDEO_ASSETS.heroMainMobile` と `IMAGE_ASSETS.heroPoster` を参照します。
