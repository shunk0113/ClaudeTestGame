// ゲーム管理システム
const GameState = {
    SELECT: 'SELECT',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER'
};

class GameManager {
    constructor() {
        this.state = GameState.SELECT;
        this.games = [];
        this.currentGame = null;
        this.currentGameId = null;
        this.audioManager = new AudioManager();

        // UI要素
        this.selectScreen = document.getElementById('game-select-screen');
        this.gameContainer = document.getElementById('game-container');
        this.pauseMenu = document.getElementById('pause-menu');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.gameCardsContainer = document.getElementById('game-cards');
        this.canvas = document.getElementById('gameCanvas');

        this.init();
    }

    init() {
        // イベントリスナーの設定
        this.setupEventListeners();

        // ゲームの登録
        this.registerGames();

        // セレクト画面のゲームカードを生成
        this.renderGameCards();

        // 初期状態でセレクト画面を表示
        this.showSelectScreen();
    }

    setupEventListeners() {
        // ESCキーでポーズ/再開
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                e.preventDefault();
                if (this.state === GameState.PLAYING) {
                    this.pauseGame();
                } else if (this.state === GameState.PAUSED) {
                    this.resumeGame();
                }
            }
        });

        // ポーズボタン
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.state === GameState.PLAYING) {
                    this.pauseGame();
                }
            });
        }

        // ポーズメニューのボタン
        const resumeBtn = document.getElementById('resume-btn');
        const restartFromPauseBtn = document.getElementById('restart-from-pause-btn');
        const selectFromPauseBtn = document.getElementById('select-from-pause-btn');
        const soundTogglePause = document.getElementById('sound-toggle-pause');

        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.resumeGame());
        }

        if (restartFromPauseBtn) {
            restartFromPauseBtn.addEventListener('click', () => {
                // ポーズメニューを非表示にしてからリスタート
                this.pauseMenu.classList.add('hidden');
                this.state = GameState.PLAYING;
                this.restartGame();
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
    }

    registerGames() {
        // エンドレスランゲームを登録
        this.registerGame({
            id: 'runner',
            name: 'エンドレスランゲーム',
            description: '障害物を避けて走り続けよう！',
            color: '#4a5fc1',
            gameClass: RunnerGame
        });
    }

    registerGame(gameConfig) {
        this.games.push(gameConfig);
    }

    renderGameCards() {
        this.gameCardsContainer.innerHTML = '';

        this.games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.dataset.gameId = game.id;
            card.style.borderColor = game.color;

            card.innerHTML = `
                <h2>${game.name}</h2>
                <p>${game.description}</p>
            `;

            card.addEventListener('click', () => {
                this.startGame(game.id);
            });

            this.gameCardsContainer.appendChild(card);
        });
    }

    startGame(gameId) {
        const gameConfig = this.games.find(g => g.id === gameId);
        if (!gameConfig) return;

        this.currentGameId = gameId;
        this.state = GameState.PLAYING;

        // セレクト画面を非表示、ゲーム画面を表示
        this.selectScreen.style.display = 'none';
        this.gameContainer.classList.add('active');
        this.gameContainer.style.display = 'block';

        // ゲームインスタンスを作成
        this.currentGame = new gameConfig.gameClass(this.canvas, this.audioManager, this);
        this.currentGame.start();
    }

    pauseGame() {
        if (this.state !== GameState.PLAYING) return;

        this.state = GameState.PAUSED;
        this.pauseMenu.classList.remove('hidden');

        if (this.currentGame && this.currentGame.pause) {
            this.currentGame.pause();
        }
    }

    resumeGame() {
        if (this.state !== GameState.PAUSED) return;

        this.state = GameState.PLAYING;
        this.pauseMenu.classList.add('hidden');

        if (this.currentGame && this.currentGame.resume) {
            this.currentGame.resume();
        }
    }

    restartGame() {
        if (!this.currentGame) return;

        if (this.currentGame.restart) {
            this.currentGame.restart();
        }
    }

    returnToSelect() {
        // 現在のゲームを破棄
        this.currentGame = null;
        this.currentGameId = null;
        this.state = GameState.SELECT;

        // すべての画面を非表示にし、セレクト画面を表示
        this.gameContainer.classList.remove('active');
        this.gameContainer.style.display = 'none';
        this.pauseMenu.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.showSelectScreen();
    }

    showSelectScreen() {
        this.selectScreen.style.display = 'flex';
    }

    onGameOver() {
        this.state = GameState.GAME_OVER;
        // ゲームオーバー画面は個別のゲームクラスが表示する
    }
}

// ページ読み込み時にゲームマネージャーを初期化
window.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
});
