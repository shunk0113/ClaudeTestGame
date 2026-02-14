// ゲーム状態
const GameState = {
    START: 'START',
    PLAYING: 'PLAYING',
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
        this.minSpawnInterval = 70;  // 最小間隔（フレーム数）
        this.maxSpawnInterval = 130; // 最大間隔（フレーム数）
        this.obstacleSpawnInterval = this.getRandomSpawnInterval();

        // フレームカウント
        this.frameCount = 0;

        // UI要素
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.soundToggle = document.getElementById('sound-toggle');

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

        // キーボード操作
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJump();
            }
        });

        // タッチ/クリック操作
        this.canvas.addEventListener('click', () => this.handleJump());
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleJump();
        });

        // 音声トグル
        this.soundToggle.addEventListener('click', () => {
            this.audioManager.toggleMute();
            this.soundToggle.textContent = this.audioManager.isMuted ? '🔇 音声OFF' : '🔊 音声ON';
        });

        // ウィンドウリサイズ
        window.addEventListener('resize', () => this.setCanvasSize());
    }

    handleJump() {
        if (this.state === GameState.PLAYING) {
            this.player.jump();
            this.audioManager.playJump();
        } else if (this.state === GameState.START) {
            this.start();
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
            this.minSpawnInterval = 50;
            this.maxSpawnInterval = 90;
        } else if (score > 500) {
            this.minSpawnInterval = 60;
            this.maxSpawnInterval = 110;
        } else if (score > 200) {
            this.minSpawnInterval = 65;
            this.maxSpawnInterval = 120;
        }
    }

    spawnObstacle() {
        const obstacle = new Obstacle(this.canvas.width, this.canvas.height - 120, this);
        this.obstacles.push(obstacle);

        // 次の障害物生成までの間隔をランダムに設定
        this.obstacleSpawnInterval = this.getRandomSpawnInterval();
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
        document.getElementById('final-score').textContent = Math.floor(this.scoreManager.currentScore);

        const highScoreMessage = document.getElementById('high-score-message');
        if (isNewHighScore) {
            highScoreMessage.textContent = '🎉 新記録達成！';
        } else {
            highScoreMessage.textContent = '';
        }

        this.gameOverScreen.classList.remove('hidden');
    }
}

// ページ読み込み時にゲームを初期化
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
