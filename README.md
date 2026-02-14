# Claude Test Game Collection

ブラウザで遊べる2種類のHTML5ゲーム集です。JavaScriptとCanvasで実装されており、インストール不要で直接プレイできます。

## 🎮 収録ゲーム

### 1. エンドレスランゲーム
Chrome恐竜ゲーム風のランニングアクションゲーム。

**特徴:**
- 2レーンシステム（地面・空中）
- 小ジャンプ・大ジャンプの使い分け
- 2連続障害物パターン
- 難易度の段階的上昇
- ハイスコア記録

**操作方法:**
- スペースキー短押し：小ジャンプ
- スペースキー長押し：大ジャンプ
- タップ/クリック：ジャンプ
- ESCキー：ポーズ

### 2. ブロック崩し
クラシックなブロック崩しゲーム。

**特徴:**
- カラフルなブロック配置
- 3ライフ制
- レベル進行システム
- マウス/キーボード/タッチ操作対応
- ハイスコア記録

**操作方法:**
- マウス移動：パドル操作
- 左右キー：パドル移動
- タッチ操作：パドル移動
- ESCキー：ポーズ

## 🚀 プレイ方法

1. `index.html`をブラウザで開く
2. 遊びたいゲームを選択
3. 「スタート」ボタンをクリック
4. ゲームを楽しむ！

GitHub Pagesでも公開中：[https://shunk0113.github.io/ClaudeTestGame/](https://shunk0113.github.io/ClaudeTestGame/)

## 🎨 共通機能

- **ゲームセレクト画面**: サムネイル付きゲーム選択
- **ポーズ機能**: ESCキーまたはポーズボタンで一時停止
- **ハイスコア**: ゲーム別にlocalStorageで保存
- **音声ON/OFF**: ゲーム中に切り替え可能
- **ツイート機能**: スコアをTwitterでシェア
- **レスポンシブデザイン**: PC・スマホ対応
- **ダークモード**: 目に優しいUIデザイン

## 📁 ファイル構成

```
ClaudeTestGame/
├── index.html                # ゲームセレクト画面
├── runner.html               # エンドレスランゲーム
├── breakout.html             # ブロック崩し
├── css/
│   └── style.css            # 共通スタイルシート
└── js/
    # 共通
    ├── score.js             # スコア管理（ゲーム別保存）
    ├── audio.js             # 音声管理
    ├── collision.js         # 衝突判定ヘルパー
    ├── thumbnail.js         # サムネイル描画

    # エンドレスランゲーム
    ├── game-standalone.js   # ゲームメインループ
    ├── player.js            # プレイヤークラス
    └── obstacle.js          # 障害物クラス

    # ブロック崩し
    ├── breakout-game.js     # ゲームメインループ
    ├── breakout-paddle.js   # パドルクラス
    ├── breakout-ball.js     # ボールクラス
    └── breakout-brick.js    # ブロッククラス
```

## 🛠 技術スタック

- **HTML5 Canvas**: ゲーム描画
- **JavaScript (ES6+)**: ゲームロジック
- **Web Audio API**: 効果音
- **LocalStorage API**: ハイスコア保存
- **CSS3**: レスポンシブデザイン

## 🎯 技術的な特徴

### エンドレスランゲーム
- 2レーン障害物システム
- 小ジャンプ・大ジャンプの物理演算
- ランダム障害物生成アルゴリズム
- 2連続パターン（同一レーン、ギリギリ間隔）
- スコアベース難易度調整

### ブロック崩し
- 円と矩形の正確な衝突判定
- パドル位置によるボール反射角度制御
- レベル進行システム
- 3ライフ制ゲームオーバー判定

### 共通システム
- ゲーム別スコア管理（localStorageキー分離）
- ポーズ/再開機能
- ゲーム間の状態管理
- Canvas描画最適化

## 🌐 ブラウザ互換性

- Chrome / Edge (推奨)
- Firefox
- Safari
- モバイルブラウザ（iOS Safari, Chrome）

## 🚢 デプロイ

### GitHub Pages
1. GitHubリポジトリにプッシュ
2. Settings > Pages で公開
3. ブランチを選択してSave

### ローカルでの起動
`index.html`をブラウザで開くだけで動作します。Webサーバーは不要です。

## ⚙️ カスタマイズ

### エンドレスランゲームの難易度調整
[game-standalone.js](js/game-standalone.js)の以下のパラメータを変更：

```javascript
this.baseSpeed = 5;                  // 基本スピード
this.minSpawnInterval = 80;          // 最小生成間隔
this.maxSpawnInterval = 140;         // 最大生成間隔
this.doubleSpawnInterval = 12;       // 2連続時の間隔
this.doublePatternChance = 0.25;     // 2連続の確率
```

### ブロック崩しの調整
[breakout-game.js](js/breakout-game.js)で調整可能：

```javascript
this.lives = 3;                      // 初期ライフ
this.brickRows = 5;                  // ブロック行数
this.brickCols = 10;                 // ブロック列数
```

## 📝 開発履歴

- セレクトメニュー実装
- ポーズメニュー追加
- ゲーム別スコア保存
- エンドレスランゲームの2レーンシステム
- 小ジャンプ・大ジャンプ機能
- ブロック崩しゲーム追加
- 衝突判定の改善

## 🔮 今後の拡張案

- さらなるゲームの追加
- オンラインランキング機能
- アチーブメントシステム
- カスタムテーマ機能
- BGM追加
- キャラクターカスタマイズ

## 📄 ライセンス

MIT License

## 👨‍💻 開発

Claude Code を使用して開発されました
