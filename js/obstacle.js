// 障害物のタイプ
const ObstacleType = {
    CACTUS_SMALL: 'CACTUS_SMALL',
    CACTUS_LARGE: 'CACTUS_LARGE',
    ROCK: 'ROCK',
    SPIKE: 'SPIKE'
};

class Obstacle {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;

        // ランダムで障害物のタイプを決定
        this.type = this.getRandomType();

        // タイプに応じてサイズを設定
        this.setSize();

        // 色
        this.color = this.getColor();
    }

    getRandomType() {
        const types = Object.values(ObstacleType);
        return types[Math.floor(Math.random() * types.length)];
    }

    setSize() {
        switch (this.type) {
            case ObstacleType.CACTUS_SMALL:
                this.width = 25;
                this.height = 40;
                break;
            case ObstacleType.CACTUS_LARGE:
                this.width = 30;
                this.height = 60;
                break;
            case ObstacleType.ROCK:
                this.width = 35;
                this.height = 35;
                break;
            case ObstacleType.SPIKE:
                this.width = 30;
                this.height = 45;
                break;
        }
    }

    getColor() {
        switch (this.type) {
            case ObstacleType.CACTUS_SMALL:
            case ObstacleType.CACTUS_LARGE:
                return '#2E8B57';
            case ObstacleType.ROCK:
                return '#808080';
            case ObstacleType.SPIKE:
                return '#696969';
            default:
                return '#000000';
        }
    }

    update(speed) {
        this.x -= speed;
    }

    draw(ctx) {
        ctx.save();

        switch (this.type) {
            case ObstacleType.CACTUS_SMALL:
                this.drawCactusSmall(ctx);
                break;
            case ObstacleType.CACTUS_LARGE:
                this.drawCactusLarge(ctx);
                break;
            case ObstacleType.ROCK:
                this.drawRock(ctx);
                break;
            case ObstacleType.SPIKE:
                this.drawSpike(ctx);
                break;
        }

        ctx.restore();

        // デバッグ用の当たり判定ボックス（コメントアウト解除で表示）
        // ctx.strokeStyle = 'blue';
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    drawCactusSmall(ctx) {
        ctx.fillStyle = this.color;

        // 本体
        const bodyWidth = this.width * 0.4;
        const bodyX = this.x + (this.width - bodyWidth) / 2;
        ctx.fillRect(bodyX, this.y, bodyWidth, this.height);

        // 左の腕
        const armHeight = this.height * 0.3;
        ctx.fillRect(this.x, this.y + 10, bodyWidth * 0.6, armHeight);

        // 右の腕
        ctx.fillRect(this.x + this.width - bodyWidth * 0.6, this.y + 15, bodyWidth * 0.6, armHeight);

        // サボテンのとげ
        ctx.fillStyle = '#1C5739';
        for (let i = 0; i < 5; i++) {
            const spikeY = this.y + (this.height / 5) * i;
            ctx.fillRect(bodyX - 2, spikeY, 2, 4);
            ctx.fillRect(bodyX + bodyWidth, spikeY, 2, 4);
        }
    }

    drawCactusLarge(ctx) {
        ctx.fillStyle = this.color;

        // 本体
        const bodyWidth = this.width * 0.5;
        const bodyX = this.x + (this.width - bodyWidth) / 2;
        ctx.fillRect(bodyX, this.y, bodyWidth, this.height);

        // 左の腕（上）
        const armHeight = this.height * 0.4;
        ctx.fillRect(this.x, this.y + 8, bodyWidth * 0.7, armHeight);

        // 右の腕（下）
        ctx.fillRect(this.x + this.width - bodyWidth * 0.7, this.y + 20, bodyWidth * 0.7, armHeight);

        // サボテンのとげ
        ctx.fillStyle = '#1C5739';
        for (let i = 0; i < 8; i++) {
            const spikeY = this.y + (this.height / 8) * i;
            ctx.fillRect(bodyX - 2, spikeY, 2, 5);
            ctx.fillRect(bodyX + bodyWidth, spikeY, 2, 5);
        }
    }

    drawRock(ctx) {
        ctx.fillStyle = this.color;

        // 不規則な岩の形を描画
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.3);
        ctx.lineTo(this.x + this.width * 0.9, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.1, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height * 0.4);
        ctx.closePath();
        ctx.fill();

        // 影の部分
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, this.y + this.height * 0.3);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.3);
        ctx.lineTo(this.x + this.width * 0.9, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.7);
        ctx.closePath();
        ctx.fill();

        // ハイライト
        ctx.fillStyle = '#A9A9A9';
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.3, this.y + this.height * 0.3, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSpike(ctx) {
        ctx.fillStyle = this.color;

        // トゲ状の障害物を描画
        const numSpikes = 3;
        const spikeWidth = this.width / numSpikes;

        for (let i = 0; i < numSpikes; i++) {
            const spikeX = this.x + i * spikeWidth;
            ctx.beginPath();
            ctx.moveTo(spikeX, this.y + this.height);
            ctx.lineTo(spikeX + spikeWidth / 2, this.y);
            ctx.lineTo(spikeX + spikeWidth, this.y + this.height);
            ctx.closePath();
            ctx.fill();

            // トゲのアウトライン
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // ベース
        ctx.fillStyle = '#505050';
        ctx.fillRect(this.x, this.y + this.height, this.width, 5);
    }

    // 当たり判定用のバウンディングボックスを取得
    getBounds() {
        return {
            x: this.x + 5, // 少しマージンを持たせる
            y: this.y + 5,
            width: this.width - 10,
            height: this.height - 10
        };
    }
}
