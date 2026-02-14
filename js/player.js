class Player {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;

        // 物理演算用
        this.velocityY = 0;
        this.gravity = 0.6;
        this.smallJumpPower = -9;   // 小ジャンプ
        this.largeJumpPower = -13;  // 大ジャンプ
        this.isJumping = false;

        // 地面の位置
        this.groundY = game.canvas.height - 150;

        // アニメーション
        this.animationFrame = 0;
        this.animationSpeed = 10;
        this.animationCounter = 0;
    }

    jump(isLargeJump = false) {
        if (!this.isJumping) {
            // ジャンプの種類に応じてジャンプ力を設定
            this.velocityY = isLargeJump ? this.largeJumpPower : this.smallJumpPower;
            this.isJumping = true;
        }
    }

    update() {
        // 重力の適用
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // 地面との衝突判定
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
        }

        // アニメーションフレームの更新
        this.animationCounter++;
        if (this.animationCounter >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationCounter = 0;
        }
    }

    draw(ctx) {
        // プレイヤーの描画（シンプルなキャラクター）
        this.drawCharacter(ctx);
    }

    drawCharacter(ctx) {
        ctx.save();

        // 体（楕円形）
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            this.height / 2,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // 目
        const eyeY = this.y + this.height / 3;
        const eyeSize = 4;

        // 左目
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, eyeY, eyeSize + 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // 右目
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + (this.width * 2/3), eyeY, eyeSize + 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + (this.width * 2/3), eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // 口（笑顔）
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 4,
            0,
            Math.PI
        );
        ctx.stroke();

        // 足（走るアニメーション）
        ctx.fillStyle = '#FF6B6B';
        const legWidth = 8;
        const legHeight = 15;
        const legY = this.y + this.height;

        if (this.isJumping) {
            // ジャンプ中は足を揃える
            ctx.fillRect(this.x + this.width / 3 - legWidth / 2, legY, legWidth, legHeight);
            ctx.fillRect(this.x + (this.width * 2/3) - legWidth / 2, legY, legWidth, legHeight);
        } else {
            // 走るアニメーション
            const legOffset = this.animationFrame === 0 ? 5 : -5;
            ctx.fillRect(this.x + this.width / 3 - legWidth / 2, legY + legOffset, legWidth, legHeight);
            ctx.fillRect(this.x + (this.width * 2/3) - legWidth / 2, legY - legOffset, legWidth, legHeight);
        }

        // 腕
        const armWidth = 6;
        const armLength = 20;
        const armY = this.y + this.height / 2;

        if (this.isJumping) {
            // ジャンプ中は腕を上げる
            ctx.fillRect(this.x - armWidth, armY - 10, armWidth, armLength);
            ctx.fillRect(this.x + this.width, armY - 10, armWidth, armLength);
        } else {
            // 走るアニメーション
            const armOffset = this.animationFrame === 0 ? 8 : -8;
            ctx.fillRect(this.x - armWidth, armY + armOffset, armWidth, armLength);
            ctx.fillRect(this.x + this.width, armY - armOffset, armWidth, armLength);
        }

        ctx.restore();

        // デバッグ用の当たり判定ボックス（コメントアウト解除で表示）
        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    reset() {
        this.y = this.groundY;
        this.velocityY = 0;
        this.isJumping = false;
        this.animationFrame = 0;
        this.animationCounter = 0;
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
