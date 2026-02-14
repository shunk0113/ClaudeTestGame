class ScoreManager {
    constructor(gameId = 'default') {
        this.currentScore = 0;
        this.highScore = 0;
        this.gameId = gameId;
        this.storageKey = `${gameId}_highScore`;
    }

    // ポイントを追加
    addPoints(points) {
        this.currentScore += points;
    }

    // スコアをリセット
    resetScore() {
        this.currentScore = 0;
    }

    // ハイスコアを読み込む
    loadHighScore() {
        try {
            const savedScore = localStorage.getItem(this.storageKey);
            if (savedScore !== null) {
                this.highScore = parseFloat(savedScore);
            }
        } catch (error) {
            console.error('Failed to load high score:', error);
            this.highScore = 0;
        }
    }

    // ハイスコアを保存
    saveHighScore() {
        let isNewHighScore = false;

        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            isNewHighScore = true;

            try {
                localStorage.setItem(this.storageKey, this.highScore.toString());
            } catch (error) {
                console.error('Failed to save high score:', error);
            }
        }

        return isNewHighScore;
    }

    // スコアを取得
    getCurrentScore() {
        return Math.floor(this.currentScore);
    }

    // ハイスコアを取得
    getHighScore() {
        return Math.floor(this.highScore);
    }

    // ハイスコアをリセット（デバッグ用）
    clearHighScore() {
        try {
            localStorage.removeItem(this.storageKey);
            this.highScore = 0;
            console.log('High score cleared');
        } catch (error) {
            console.error('Failed to clear high score:', error);
        }
    }
}

// グローバルスコアヘルパー関数（オプション）
function formatScore(score) {
    return score.toString().padStart(5, '0');
}
