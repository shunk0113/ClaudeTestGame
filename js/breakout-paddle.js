// ブロック崩しのパドルクラス
class Paddle {
    constructor(x, y, game) {
        this.game = game;
        this.width = 100;
        this.height = 15;
        this.x = x - this.width / 2;
        this.y = y;
        this.speed = 8;
        this.color = '#4a90e2';

        // 移動方向
        this.moveLeft = false;
        this.moveRight = false;
    }

    update() {
        // 左右移動
        if (this.moveLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.moveRight && this.x + this.width < this.game.canvas.width) {
            this.x += this.speed;
        }
    }

    draw(ctx) {
        // パドル本体
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // ハイライト
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height / 2);

        // 縁取り
        ctx.strokeStyle = '#2d5f8d';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    moveTo(x) {
        // マウス/タッチ操作でパドルを移動
        this.x = x - this.width / 2;
        // 画面外に出ないように制限
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.game.canvas.width) {
            this.x = this.game.canvas.width - this.width;
        }
    }

    reset() {
        this.x = this.game.canvas.width / 2 - this.width / 2;
        this.y = this.game.canvas.height - 50;
        this.moveLeft = false;
        this.moveRight = false;
    }

    // 当たり判定用のバウンディングボックス
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
