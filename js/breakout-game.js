// ゲーム状態
const BreakoutGameState = {
    START: 'START',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER'
};

// ブロック崩しゲームクラス
class BreakoutGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = BreakoutGameState.START;

        // Canvas サイズの設定
        this.setCanvasSize();

        // ゲーム要素
        this.paddle = null;
        this.ball = null;
        this.bricks = [];
        this.scoreManager = null;
        this.audioManager = null;

        // ゲーム設定
        this.lives = 3;
        this.level = 1;
        this.brickRows = 5;
        this.brickCols = 10;

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
        this.canvas.width = 1000;
        this.canvas.height = 500;
    }

    init() {
        // ゲーム要素の初期化
        this.paddle = new Paddle(this.canvas.width / 2, this.canvas.height - 50, this);
        this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 100, this);
        this.bricks = createBricks(this.canvas.width, this.brickRows, this.brickCols);
        this.scoreManager = new ScoreManager('breakout');
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
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                this.paddle.moveLeft = true;
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                this.paddle.moveRight = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                this.paddle.moveLeft = false;
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                this.paddle.moveRight = false;
            }
        });

        // マウス操作
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.state === BreakoutGameState.PLAYING) {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                this.paddle.moveTo(mouseX);
            }
        });

        // タッチ操作
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.state === BreakoutGameState.PLAYING) {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                const touchX = touch.clientX - rect.left;
                this.paddle.moveTo(touchX);
            }
        });

        // クリック/タッチでスタート
        this.canvas.addEventListener('click', () => {
            if (this.state === BreakoutGameState.START) {
                this.start();
            }
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
                if (this.state === BreakoutGameState.PLAYING) {
                    this.pause();
                } else if (this.state === BreakoutGameState.PAUSED) {
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

    start() {
        this.state = BreakoutGameState.PLAYING;
        this.startBtn.style.display = 'none';
        this.reset();
        this.gameLoop();
    }

    restart() {
        this.gameOverScreen.classList.add('hidden');
        this.start();
    }

    reset() {
        this.paddle.reset();
        this.ball.reset(this.canvas.width / 2, this.canvas.height - 100);
        this.bricks = createBricks(this.canvas.width, this.brickRows, this.brickCols);
        this.scoreManager.resetScore();
        this.lives = 3;
        this.level = 1;
        this.updateScoreDisplay();
    }

    gameLoop() {
        if (this.state !== BreakoutGameState.PLAYING) {
            return;
        }

        this.update();
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // パドルの更新
        this.paddle.update();

        // ボールの更新
        const ballStatus = this.ball.update();

        // ボールが画面下に落ちた
        if (ballStatus === 'miss') {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver();
                return;
            } else {
                // ライフが残っている場合、ボールをリセット
                this.ball.reset(this.canvas.width / 2, this.canvas.height - 100);
                this.audioManager.playGameOver(); // ミス音
            }
        }

        // パドルとの衝突判定
        if (this.ball.checkPaddleCollision(this.paddle)) {
            this.audioManager.playJump(); // 反射音
        }

        // ブロックとの衝突判定
        for (let brick of this.bricks) {
            if (brick.alive && this.ball.checkBrickCollision(brick)) {
                brick.destroy();
                this.scoreManager.addPoints(brick.points);
                this.audioManager.playJump(); // ブロック破壊音
                this.updateScoreDisplay();

                // すべてのブロックを破壊したらレベルアップ
                if (this.bricks.every(b => !b.alive)) {
                    this.levelUp();
                }
                break;
            }
        }
    }

    levelUp() {
        this.level++;
        this.ball.reset(this.canvas.width / 2, this.canvas.height - 100);
        this.bricks = createBricks(this.canvas.width, this.brickRows, this.brickCols);
        // レベルアップボーナス
        this.scoreManager.addPoints(100 * this.level);
        this.updateScoreDisplay();
    }

    draw() {
        // 背景のクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#2d3561');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // ライフ表示
        this.drawLives();

        // ブロックの描画
        for (let brick of this.bricks) {
            brick.draw(this.ctx);
        }

        // パドルの描画
        this.paddle.draw(this.ctx);

        // ボールの描画
        this.ball.draw(this.ctx);
    }

    drawLives() {
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.font = '18px "Segoe UI", sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`ライフ: ${'❤️'.repeat(this.lives)}`, 20, 30);
        this.ctx.fillText(`レベル: ${this.level}`, this.canvas.width - 120, 30);
    }

    updateScoreDisplay() {
        document.getElementById('current-score').textContent = Math.floor(this.scoreManager.currentScore);
        document.getElementById('high-score').textContent = Math.floor(this.scoreManager.highScore);
    }

    gameOver() {
        this.state = BreakoutGameState.GAME_OVER;
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
            const hashtags = 'ブロック崩し,ブラウザゲーム';

            let tweetText;
            if (isNewHighScore) {
                tweetText = `🎉 新記録達成！\nスコア: ${score}点\n\nブロック崩しゲームで遊んでみよう！`;
            } else {
                tweetText = `スコア: ${score}点\n\nブロック崩しゲームに挑戦中！`;
            }

            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(gameUrl)}&hashtags=${encodeURIComponent(hashtags)}`;

            window.open(twitterUrl, '_blank', 'width=550,height=420');
        });
    }

    pause() {
        if (this.state !== BreakoutGameState.PLAYING) return;
        this.state = BreakoutGameState.PAUSED;
        if (this.pauseMenu) {
            this.pauseMenu.classList.remove('hidden');
        }
    }

    resume() {
        if (this.state !== BreakoutGameState.PAUSED) return;
        this.state = BreakoutGameState.PLAYING;
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
    const game = new BreakoutGame();
});
