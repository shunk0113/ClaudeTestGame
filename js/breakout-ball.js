// ブロック崩しのボールクラス
class Ball {
    constructor(x, y, game) {
        this.game = game;
        this.radius = 8;
        this.x = x;
        this.y = y;
        this.speedX = 4;
        this.speedY = -4;
        this.baseSpeed = 4;
        this.maxSpeed = 10;
        this.color = '#ff6b6b';
    }

    update() {
        // ボールの移動
        this.x += this.speedX;
        this.y += this.speedY;

        // 左右の壁との衝突
        if (this.x - this.radius <= 0 || this.x + this.radius >= this.game.canvas.width) {
            this.speedX = -this.speedX;
            this.x = Math.max(this.radius, Math.min(this.x, this.game.canvas.width - this.radius));
        }

        // 上の壁との衝突
        if (this.y - this.radius <= 0) {
            this.speedY = -this.speedY;
            this.y = this.radius;
        }

        // 画面下に落ちた場合
        if (this.y - this.radius > this.game.canvas.height) {
            return 'miss';
        }

        return 'ok';
    }

    draw(ctx) {
        // ボール本体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // ハイライト
        const gradient = ctx.createRadialGradient(
            this.x - this.radius / 3, this.y - this.radius / 3, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 107, 107, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 縁取り
        ctx.strokeStyle = '#d64545';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    checkPaddleCollision(paddle) {
        // パドルとの衝突判定
        const paddleBounds = paddle.getBounds();

        if (this.y + this.radius >= paddleBounds.y &&
            this.y - this.radius <= paddleBounds.y + paddleBounds.height &&
            this.x >= paddleBounds.x &&
            this.x <= paddleBounds.x + paddleBounds.width) {

            // パドルに当たった位置によって反射角度を変える
            const hitPos = (this.x - paddleBounds.x) / paddleBounds.width;
            const angle = (hitPos - 0.5) * Math.PI * 0.6; // -54度〜+54度

            const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
            this.speedX = speed * Math.sin(angle);
            this.speedY = -Math.abs(speed * Math.cos(angle));

            // ボールがパドルに埋まらないように位置調整
            this.y = paddleBounds.y - this.radius;

            return true;
        }
        return false;
    }

    checkBrickCollision(brick) {
        // ブロックとの衝突判定（簡易版）
        const brickBounds = brick.getBounds();

        // ボールの中心がブロック内にあるか
        if (this.x >= brickBounds.x &&
            this.x <= brickBounds.x + brickBounds.width &&
            this.y >= brickBounds.y &&
            this.y <= brickBounds.y + brickBounds.height) {

            // 衝突した方向を判定
            const fromLeft = Math.abs(this.x - brickBounds.x);
            const fromRight = Math.abs(this.x - (brickBounds.x + brickBounds.width));
            const fromTop = Math.abs(this.y - brickBounds.y);
            const fromBottom = Math.abs(this.y - (brickBounds.y + brickBounds.height));

            const minDist = Math.min(fromLeft, fromRight, fromTop, fromBottom);

            if (minDist === fromTop || minDist === fromBottom) {
                this.speedY = -this.speedY;
            } else {
                this.speedX = -this.speedX;
            }

            return true;
        }
        return false;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        // ランダムな角度で発射（上向き）
        const angle = (Math.random() - 0.5) * Math.PI * 0.4; // -36度〜+36度
        this.speedX = this.baseSpeed * Math.sin(angle);
        this.speedY = -this.baseSpeed * Math.cos(angle);
    }

    // 当たり判定用のバウンディングボックス
    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}
