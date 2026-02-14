// ゲーム状態
const GameState = {
    START: 'START',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER'
};

// ゲームクラス
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GameState.START;

        // Canvas サイズの設定
        this.setCanvasSize();

        // ゲーム要素
        this.player = null;
        this.obstacles = [];
        this.scoreManager = null;
        this.audioManager = null;

        // ゲーム設定
        this.gameSpeed = 5;
        this.baseSpeed = 5;
        this.gravity = 0.6;
        this.obstacleSpawnTimer = 0;

        // 障害物生成間隔（ランダム範囲）
        this.minSpawnInterval = 80;  // 最小間隔（フレーム数）
        this.maxSpawnInterval = 140; // 最大間隔（フレーム数）
        this.obstacleSpawnInterval = this.getRandomSpawnInterval();

        // 2連続パターン用
        this.isDoublePattern = false; // 2連続パターンフラグ
        this.doublePatternChance = 0.25; // 25%の確率で2連続
        this.doubleSpawnInterval = 12; // 2連続時の間隔（ギリギリまで詰める）
        this.doubleLaneType = null; // 2連続パターンの1つ目のレーンタイプ

        // フレームカウント
        this.frameCount = 0;

        // ジャンプキーの状態
        this.jumpKeyPressed = false;
        this.jumpKeyPressTime = 0;
        this.jumpThreshold = 150; // 150ms以上押すと大ジャンプ

        // UI要素
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.soundToggle = document.getElementById('sound-toggle');
        this.pauseBtn = document.getElementById('pause-btn');
        this.pauseMenu = document.getElementById('pause-menu');

        this.init();
    }

    setCanvasSize() {
        // Canvasの実際のサイズを設定（高DPI対応）
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = 800;
        this.canvas.height = 400;
    }

    init() {
        // ゲーム要素の初期化
        this.player = new Player(100, this.canvas.height - 150, this);
        this.scoreManager = new ScoreManager();
        this.audioManager = new AudioManager();

        // イベントリスナーの設定
        this.setupEventListeners();

        // ハイスコアの読み込み
        this.scoreManager.loadHighScore();
        this.updateScoreDisplay();
    }

    setupEventListeners() {
        // スタートボタン
        this.startBtn.addEventListener('click', () => this.start());

        // リスタートボタン
        this.restartBtn.addEventListener('click', () => this.restart());

        // キーボード操作（小ジャンプ・大ジャンプ対応）
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJumpStart();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJumpEnd();
            }
        });

        // タッチ/クリック操作
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleJumpStart();
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleJumpEnd();
        });

        // 音声トグル
        this.soundToggle.addEventListener('click', () => {
            this.audioManager.toggleMute();
            this.soundToggle.textContent = this.audioManager.isMuted ? '🔇 音声OFF' : '🔊 音声ON';
        });

        // ESCキーでポーズ/再開
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                e.preventDefault();
                if (this.state === GameState.PLAYING) {
                    this.pause();
                } else if (this.state === GameState.PAUSED) {
                    this.resume();
                }
            }
        });

        // ポーズボタン
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pause());
        }

        // ポーズメニューのボタン
        const resumeBtn = document.getElementById('resume-btn');
        const restartFromPauseBtn = document.getElementById('restart-from-pause-btn');
        const selectFromPauseBtn = document.getElementById('select-from-pause-btn');
        const soundTogglePause = document.getElementById('sound-toggle-pause');

        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.resume());
        }

        if (restartFromPauseBtn) {
            restartFromPauseBtn.addEventListener('click', () => {
                this.pauseMenu.classList.add('hidden');
                this.restart();
            });
        }

        if (selectFromPauseBtn) {
            selectFromPauseBtn.addEventListener('click', () => this.returnToSelect());
        }

        if (soundTogglePause) {
            soundTogglePause.addEventListener('click', () => {
                this.audioManager.toggleMute();
                soundTogglePause.textContent = this.audioManager.isMuted ? '🔇 音声OFF' : '🔊 音声ON';
            });
        }

        // ゲームオーバー画面の「セレクトに戻る」ボタン
        const selectFromGameOverBtn = document.getElementById('select-from-gameover-btn');
        if (selectFromGameOverBtn) {
            selectFromGameOverBtn.addEventListener('click', () => this.returnToSelect());
        }

        // ウィンドウリサイズ
        window.addEventListener('resize', () => this.setCanvasSize());
    }

    handleJumpStart() {
        if (this.state === GameState.PLAYING) {
            // ジャンプキーが押された瞬間にジャンプを開始
            if (!this.jumpKeyPressed && !this.player.isJumping) {
                this.jumpKeyPressed = true;
                this.jumpKeyPressTime = Date.now();
                this.player.jump();
                this.audioManager.playJump();
            }
        } else if (this.state === GameState.START) {
            this.start();
        }
    }

    handleJumpEnd() {
        if (this.state === GameState.PLAYING && this.jumpKeyPressed) {
            // キーを離した時、押していた時間を計算
            const pressDuration = Date.now() - this.jumpKeyPressTime;

            // 短い時間（閾値未満）でキーを離した場合、上昇を打ち消す
            if (pressDuration < this.jumpThreshold) {
                this.player.cancelJump();
            }

            this.jumpKeyPressed = false;
        }
    }

    start() {
        this.state = GameState.PLAYING;
        this.startBtn.style.display = 'none';
        this.reset();
        this.gameLoop();
    }

    restart() {
        this.gameOverScreen.classList.add('hidden');
        this.start();
    }

    reset() {
        this.player.reset();
        this.obstacles = [];
        this.scoreManager.resetScore();
        this.gameSpeed = this.baseSpeed;
        this.obstacleSpawnTimer = 0;
        this.frameCount = 0;
        this.jumpKeyPressed = false;
        this.jumpKeyPressTime = 0;
        this.isDoublePattern = false;
        this.doublePatternChance = 0.25;
        this.doubleLaneType = null;
        this.updateScoreDisplay();
    }

    gameLoop() {
        if (this.state !== GameState.PLAYING) {
            return;
        }

        this.update();
        this.draw();
        this.frameCount++;

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // プレイヤーの更新
        this.player.update();

        // 障害物の生成
        this.obstacleSpawnTimer++;
        if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
            this.spawnObstacle();
            this.obstacleSpawnTimer = 0;
        }

        // 障害物の更新
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(this.gameSpeed);

            // 画面外の障害物を削除
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
                this.scoreManager.addPoints(10);
            }
        }

        // 衝突判定
        for (let obstacle of this.obstacles) {
            if (checkCollision(this.player, obstacle)) {
                this.gameOver();
                return;
            }
        }

        // スコアの更新
        this.scoreManager.addPoints(0.1);
        this.updateScoreDisplay();

        // 難易度の調整
        this.updateDifficulty();
    }

    getRandomSpawnInterval() {
        // 最小値と最大値の間でランダムな間隔を生成
        return Math.floor(Math.random() * (this.maxSpawnInterval - this.minSpawnInterval + 1)) + this.minSpawnInterval;
    }

    updateDifficulty() {
        // スコアに応じてゲームスピードを上げる
        const score = Math.floor(this.scoreManager.currentScore);
        this.gameSpeed = this.baseSpeed + Math.floor(score / 200) * 0.5;

        // 難易度に応じて障害物の生成間隔の範囲を狭める
        if (score > 1000) {
            this.minSpawnInterval = 60;
            this.maxSpawnInterval = 100;
            this.doublePatternChance = 0.35; // 難易度が上がると2連続が増える
        } else if (score > 500) {
            this.minSpawnInterval = 70;
            this.maxSpawnInterval = 120;
            this.doublePatternChance = 0.30;
        } else if (score > 200) {
            this.minSpawnInterval = 75;
            this.maxSpawnInterval = 130;
            this.doublePatternChance = 0.25;
        }
    }

    spawnObstacle() {
        // レーンタイプの決定
        let laneType;
        if (this.isDoublePattern && this.doubleLaneType !== null) {
            // 2連続パターンの2つ目は1つ目と同じレーンを使用
            laneType = this.doubleLaneType;
        } else {
            // ランダムで地面または空中レーンを選択
            laneType = Math.random() < 0.5 ? LaneType.GROUND : LaneType.AIR;
        }

        // レーンに応じてy座標を設定
        let y;
        if (laneType === LaneType.GROUND) {
            y = this.canvas.height - 120; // 地面レーン
        } else {
            y = this.canvas.height - 220; // 空中レーン（地面より100px上）
        }

        const obstacle = new Obstacle(this.canvas.width, y, this, laneType);
        this.obstacles.push(obstacle);

        // 次の障害物生成までの間隔を設定
        if (this.isDoublePattern) {
            // 2連続パターンの2つ目を生成した場合、通常間隔に戻す
            this.obstacleSpawnInterval = this.getRandomSpawnInterval();
            this.isDoublePattern = false;
            this.doubleLaneType = null; // リセット
        } else {
            // 一定確率で2連続パターンを開始
            if (Math.random() < this.doublePatternChance) {
                this.obstacleSpawnInterval = this.doubleSpawnInterval;
                this.isDoublePattern = true;
                this.doubleLaneType = laneType; // 1つ目のレーンタイプを保存
            } else {
                this.obstacleSpawnInterval = this.getRandomSpawnInterval();
            }
        }
    }

    draw() {
        // 背景のクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 地面の描画
        this.drawGround();

        // プレイヤーの描画
        this.player.draw(this.ctx);

        // 障害物の描画
        for (let obstacle of this.obstacles) {
            obstacle.draw(this.ctx);
        }
    }

    drawGround() {
        const groundHeight = 30;
        const groundY = this.canvas.height - groundHeight;

        // 地面
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, groundY, this.canvas.width, groundHeight);

        // 草
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, groundY, this.canvas.width, 5);

        // 地面のライン
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, groundY);
        this.ctx.lineTo(this.canvas.width, groundY);
        this.ctx.stroke();
    }

    updateScoreDisplay() {
        document.getElementById('current-score').textContent = Math.floor(this.scoreManager.currentScore);
        document.getElementById('high-score').textContent = Math.floor(this.scoreManager.highScore);
    }

    gameOver() {
        this.state = GameState.GAME_OVER;
        this.audioManager.playGameOver();

        // ハイスコアの保存
        const isNewHighScore = this.scoreManager.saveHighScore();

        // ゲームオーバー画面の表示
        const finalScore = Math.floor(this.scoreManager.currentScore);
        document.getElementById('final-score').textContent = finalScore;

        const highScoreMessage = document.getElementById('high-score-message');
        if (isNewHighScore) {
            highScoreMessage.textContent = '🎉 新記録達成！';
        } else {
            highScoreMessage.textContent = '';
        }

        // ツイートボタンのイベントリスナーを設定
        this.setupTweetButton(finalScore, isNewHighScore);

        this.gameOverScreen.classList.remove('hidden');
    }

    setupTweetButton(score, isNewHighScore) {
        const tweetBtn = document.getElementById('tweet-btn');

        // 既存のイベントリスナーを削除（重複防止）
        const newTweetBtn = tweetBtn.cloneNode(true);
        tweetBtn.parentNode.replaceChild(newTweetBtn, tweetBtn);

        newTweetBtn.addEventListener('click', () => {
            const gameUrl = 'https://shunk0113.github.io/ClaudeTestGame/';
            const hashtags = 'エンドレスランゲーム,ブラウザゲーム';

            let tweetText;
            if (isNewHighScore) {
                tweetText = `🎉 新記録達成！\nスコア: ${score}点\n\nエンドレスランゲームで遊んでみよう！`;
            } else {
                tweetText = `スコア: ${score}点\n\nエンドレスランゲームに挑戦中！`;
            }

            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(gameUrl)}&hashtags=${encodeURIComponent(hashtags)}`;

            window.open(twitterUrl, '_blank', 'width=550,height=420');
        });
    }

    pause() {
        if (this.state !== GameState.PLAYING) return;
        this.state = GameState.PAUSED;
        if (this.pauseMenu) {
            this.pauseMenu.classList.remove('hidden');
        }
    }

    resume() {
        if (this.state !== GameState.PAUSED) return;
        this.state = GameState.PLAYING;
        if (this.pauseMenu) {
            this.pauseMenu.classList.add('hidden');
        }
        this.gameLoop();
    }

    returnToSelect() {
        window.location.href = 'index.html';
    }
}

// ページ読み込み時にゲームを初期化
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
