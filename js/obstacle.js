// 障害物のタイプ
const ObstacleType = {
    CACTUS_SMALL: 'CACTUS_SMALL',
    CACTUS_LARGE: 'CACTUS_LARGE',
    ROCK: 'ROCK',
    SPIKE: 'SPIKE',
    FLYING_BIRD: 'FLYING_BIRD',  // 空中障害物
    FLYING_BAT: 'FLYING_BAT'     // 空中障害物
};

// レーンタイプ
const LaneType = {
    GROUND: 'GROUND',  // 地面レーン
    AIR: 'AIR'         // 空中レーン
};

class Obstacle {
    constructor(x, y, game, laneType = LaneType.GROUND) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.laneType = laneType;

        // レーンに応じて障害物のタイプを決定
        this.type = this.getRandomType();

        // タイプに応じてサイズを設定
        this.setSize();

        // 色
        this.color = this.getColor();
    }

    getRandomType() {
        // レーンに応じて障害物タイプを選択
        let types;
        if (this.laneType === LaneType.AIR) {
            // 空中レーンの障害物
            types = [ObstacleType.FLYING_BIRD, ObstacleType.FLYING_BAT];
        } else {
            // 地面レーンの障害物
            types = [ObstacleType.CACTUS_SMALL, ObstacleType.CACTUS_LARGE, ObstacleType.ROCK, ObstacleType.SPIKE];
        }
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
            case ObstacleType.FLYING_BIRD:
                this.width = 40;
                this.height = 30;
                break;
            case ObstacleType.FLYING_BAT:
                this.width = 35;
                this.height = 25;
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
            case ObstacleType.FLYING_BIRD:
                return '#8B4513';
            case ObstacleType.FLYING_BAT:
                return '#4B0082';
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
            case ObstacleType.FLYING_BIRD:
                this.drawFlyingBird(ctx);
                break;
            case ObstacleType.FLYING_BAT:
                this.drawFlyingBat(ctx);
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

    drawFlyingBird(ctx) {
        ctx.fillStyle = this.color;

        // 体（楕円）
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // 翼（左）
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.quadraticCurveTo(this.x - 10, this.y, this.x + 5, this.y + this.height / 3);
        ctx.fill();

        // 翼（右）
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2);
        ctx.quadraticCurveTo(this.x + this.width + 10, this.y, this.x + this.width - 5, this.y + this.height / 3);
        ctx.fill();

        // 目
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.6, this.y + this.height * 0.4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.6, this.y + this.height * 0.4, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFlyingBat(ctx) {
        ctx.fillStyle = this.color;

        // 体（楕円）
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 翼（左・ギザギザ）
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 3, this.y + this.height / 2);
        ctx.lineTo(this.x - 5, this.y + this.height / 4);
        ctx.lineTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x - 5, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width / 3, this.y + this.height / 2);
        ctx.fill();

        // 翼（右・ギザギザ）
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 2/3, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width + 5, this.y + this.height / 4);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width + 5, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width * 2/3, this.y + this.height / 2);
        ctx.fill();

        // 耳
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.4, this.y + this.height * 0.2);
        ctx.lineTo(this.x + this.width * 0.35, this.y);
        ctx.lineTo(this.x + this.width * 0.45, this.y + this.height * 0.2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.6, this.y + this.height * 0.2);
        ctx.lineTo(this.x + this.width * 0.65, this.y);
        ctx.lineTo(this.x + this.width * 0.55, this.y + this.height * 0.2);
        ctx.fill();
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
