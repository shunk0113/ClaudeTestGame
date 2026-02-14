// ブロック崩しのブロッククラス
class Brick {
    constructor(x, y, width, height, color, points) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.points = points;
        this.alive = true;
    }

    draw(ctx) {
        if (!this.alive) return;

        // ブロック本体
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // ハイライト
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height / 2);

        // 縁取り
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

        // 影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.x + 2, this.y + this.height - 4, this.width - 4, 4);
    }

    destroy() {
        this.alive = false;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ブロック配列を生成する関数
function createBricks(canvasWidth, rows, cols) {
    const bricks = [];
    const brickWidth = 80;
    const brickHeight = 25;
    const padding = 5;
    const offsetX = (canvasWidth - (cols * (brickWidth + padding) - padding)) / 2;
    const offsetY = 60;

    // 色とポイントの設定（上の行ほど高得点）
    const colors = [
        { color: '#e74c3c', points: 50 },  // 赤
        { color: '#e67e22', points: 40 },  // オレンジ
        { color: '#f39c12', points: 30 },  // 黄色
        { color: '#2ecc71', points: 20 },  // 緑
        { color: '#3498db', points: 10 }   // 青
    ];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = offsetX + col * (brickWidth + padding);
            const y = offsetY + row * (brickHeight + padding);
            const colorIndex = row % colors.length;
            const brick = new Brick(
                x, y,
                brickWidth, brickHeight,
                colors[colorIndex].color,
                colors[colorIndex].points
            );
            bricks.push(brick);
        }
    }

    return bricks;
}
