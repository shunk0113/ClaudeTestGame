class AudioManager {
    constructor() {
        // Web Audio APIのコンテキストを作成
        this.audioContext = null;
        this.isMuted = false;
        this.isInitialized = false;

        // 音量設定
        this.volume = 0.3;
    }

    // AudioContextを初期化（ユーザー操作後に初期化）
    initAudioContext() {
        if (!this.isInitialized) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.isInitialized = true;
            } catch (error) {
                console.error('Failed to initialize audio context:', error);
            }
        }
    }

    // ジャンプ効果音
    playJump() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // ジャンプ音の設定（上昇する音）
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (error) {
            console.error('Failed to play jump sound:', error);
        }
    }

    // ゲームオーバー効果音
    playGameOver() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // ゲームオーバー音の設定（下降する音）
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);

            gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (error) {
            console.error('Failed to play game over sound:', error);
        }
    }

    // スコア獲得効果音（オプション）
    playScore() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);

            gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        } catch (error) {
            console.error('Failed to play score sound:', error);
        }
    }

    // 音声のミュート切り替え
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    // 音量設定
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    // BGMを再生（オプション：後で実装可能）
    playBGM() {
        // 実際のBGMファイルを使用する場合はここに実装
        // 例：
        // const audio = new Audio('assets/sounds/bgm.mp3');
        // audio.loop = true;
        // audio.volume = this.volume;
        // audio.play();
    }

    // BGMを停止
    stopBGM() {
        // BGMの停止処理
    }
}

// 音声ファイルを使用する場合のヘルパー関数
class SoundEffect {
    constructor(src) {
        this.audio = new Audio(src);
        this.audio.preload = 'auto';
    }

    play(volume = 1.0) {
        this.audio.currentTime = 0;
        this.audio.volume = volume;
        this.audio.play().catch(error => {
            console.error('Failed to play sound:', error);
        });
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}
