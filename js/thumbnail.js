// ゲームセレクト画面のサムネイル描画

window.addEventListener('DOMContentLoaded', () => {
    // エンドレスランゲームのサムネイル
    drawRunnerThumbnail();
});

function drawRunnerThumbnail() {
    const canvas = document.getElementById('runner-thumbnail');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#2d3561');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 地面
    const groundHeight = 15;
    const groundY = height - groundHeight;

    // 地面本体
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, groundY, width, groundHeight);

    // 草
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, groundY, width, 3);

    // 地面のライン
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // プレイヤー（小さめのサイズ）
    const playerX = 50;
    const playerY = groundY - 35;
    const playerWidth = 15;
    const playerHeight = 20;

    // 体
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(playerX + playerWidth * 0.2, playerY, playerWidth * 0.6, playerHeight * 0.7);

    // 頭
    ctx.fillStyle = '#5aa3f0';
    ctx.beginPath();
    ctx.arc(playerX + playerWidth / 2, playerY, playerWidth * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // 足
    ctx.fillStyle = '#4a90e2';
    const legWidth = playerWidth * 0.25;
    const legHeight = playerHeight * 0.4;
    ctx.fillRect(playerX + playerWidth * 0.25, playerY + playerHeight * 0.7, legWidth, legHeight);
    ctx.fillRect(playerX + playerWidth * 0.55, playerY + playerHeight * 0.7, legWidth, legHeight);

    // 障害物1（地面レーン・サボテン風）
    const obstacle1X = 150;
    const obstacle1Y = groundY - 25;
    const obstacle1Width = 12;
    const obstacle1Height = 20;

    ctx.fillStyle = '#2E8B57';
    // 本体
    const bodyWidth = obstacle1Width * 0.4;
    const bodyX = obstacle1X + (obstacle1Width - bodyWidth) / 2;
    ctx.fillRect(bodyX, obstacle1Y, bodyWidth, obstacle1Height);

    // 左の腕
    const armHeight = obstacle1Height * 0.3;
    ctx.fillRect(obstacle1X, obstacle1Y + 5, bodyWidth * 0.6, armHeight);

    // 右の腕
    ctx.fillRect(obstacle1X + obstacle1Width - bodyWidth * 0.6, obstacle1Y + 8, bodyWidth * 0.6, armHeight);

    // 障害物2（空中レーン・鳥風）
    const obstacle2X = 220;
    const obstacle2Y = groundY - 80;
    const obstacle2Width = 20;
    const obstacle2Height = 15;

    ctx.fillStyle = '#8B4513';
    // 体（楕円）
    ctx.beginPath();
    ctx.ellipse(obstacle2X + obstacle2Width / 2, obstacle2Y + obstacle2Height / 2,
                obstacle2Width / 2, obstacle2Height / 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 翼（左）
    ctx.beginPath();
    ctx.moveTo(obstacle2X, obstacle2Y + obstacle2Height / 2);
    ctx.quadraticCurveTo(obstacle2X - 5, obstacle2Y, obstacle2X + 2, obstacle2Y + obstacle2Height / 3);
    ctx.fill();

    // 翼（右）
    ctx.beginPath();
    ctx.moveTo(obstacle2X + obstacle2Width, obstacle2Y + obstacle2Height / 2);
    ctx.quadraticCurveTo(obstacle2X + obstacle2Width + 5, obstacle2Y,
                        obstacle2X + obstacle2Width - 2, obstacle2Y + obstacle2Height / 3);
    ctx.fill();

    // レーンの視覚的な分離線（点線）
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, groundY - 50);
    ctx.lineTo(width, groundY - 50);
    ctx.stroke();
    ctx.setLineDash([]);
}
