# エンドレスランゲーム

Chrome恐竜ゲーム風のエンドレスランゲームです。HTML5 CanvasとJavaScriptで実装されており、ブラウザで直接遊べます。

## 特徴

- シンプルで楽しいゲームプレイ
- ハイスコア機能（LocalStorageで保存）
- 難易度の段階的上昇
- Web Audio APIによる効果音
- モバイル対応（タッチ操作）
- レスポンシブデザイン

## 遊び方

1. `index.html`をブラウザで開く
2. 「スタート」ボタンをクリック、またはスペースキーを押す
3. スペースキーまたは画面タップでジャンプ
4. 障害物を避けてスコアを稼ぐ

## 操作方法

- **ジャンプ**: スペースキー、またはタップ/クリック
- **音声切り替え**: 音声ONボタンをクリック

## ゲーム機能

### コア機能
- プレイヤーキャラクターのジャンプと重力
- 複数種類の障害物（サボテン、岩、トゲなど）
- 衝突判定システム
- リアルタイムスコア表示

### 追加機能
- スコアに応じたゲームスピードの上昇
- 障害物生成頻度の動的調整
- ハイスコアの自動保存
- ゲームオーバー画面
- 新記録達成時の通知

## ファイル構成

```
ClaudeTestGame/
├── index.html          # メインHTML
├── css/
│   └── style.css      # スタイルシート
├── js/
│   ├── game.js        # ゲームメインループ
│   ├── player.js      # プレイヤークラス
│   ├── obstacle.js    # 障害物クラス
│   ├── collision.js   # 衝突判定
│   ├── score.js       # スコア管理
│   └── audio.js       # 音声管理
└── assets/            # 画像・音声ファイル用（拡張可能）
    ├── images/
    └── sounds/
```

## カスタマイズ

### ゲームの難易度調整
[game.js](js/game.js)の以下のパラメータを変更できます：

```javascript
this.baseSpeed = 5;              // 基本スピード
this.obstacleSpawnInterval = 100; // 障害物生成間隔
this.gravity = 0.6;               // 重力
```

### プレイヤーのジャンプ力
[player.js](js/player.js)で調整可能：

```javascript
this.jumpPower = -12;  // ジャンプの初速度
this.gravity = 0.6;    // 重力加速度
```

### 障害物の種類追加
[obstacle.js](js/obstacle.js)で新しい障害物タイプを追加できます

## 技術スタック

- HTML5 Canvas
- JavaScript (ES6+)
- Web Audio API
- LocalStorage API
- CSS3 (Flexbox, Gradients)

## ブラウザ互換性

- Chrome / Edge (推奨)
- Firefox
- Safari
- モバイルブラウザ（iOS Safari, Chrome）

## デプロイ

### GitHub Pages
1. GitHubリポジトリにプッシュ
2. Settings > Pages で公開
3. ブランチを選択してSave

### ローカルでの起動
`index.html`をブラウザで開くだけで動作します。Webサーバーは不要です。

## 今後の拡張案

- 背景のスクロールアニメーション
- パワーアップアイテム
- キャラクターのカスタマイズ
- リーダーボード機能
- 複数のゲームモード
- カスタム画像・音声ファイルの追加

## ライセンス

MIT License

## 開発者

Claude Code を使用して開発されました