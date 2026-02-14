// 矩形同士の衝突判定（AABB: Axis-Aligned Bounding Box）
function checkCollision(player, obstacle) {
    // プレイヤーと障害物のバウンディングボックスを取得
    const playerBounds = player.getBounds();
    const obstacleBounds = obstacle.getBounds();

    // 矩形の衝突判定
    return (
        playerBounds.x < obstacleBounds.x + obstacleBounds.width &&
        playerBounds.x + playerBounds.width > obstacleBounds.x &&
        playerBounds.y < obstacleBounds.y + obstacleBounds.height &&
        playerBounds.y + playerBounds.height > obstacleBounds.y
    );
}

// 円形の衝突判定（より精密な判定が必要な場合）
function checkCircleCollision(obj1, obj2) {
    const obj1CenterX = obj1.x + obj1.width / 2;
    const obj1CenterY = obj1.y + obj1.height / 2;
    const obj2CenterX = obj2.x + obj2.width / 2;
    const obj2CenterY = obj2.y + obj2.height / 2;

    const dx = obj1CenterX - obj2CenterX;
    const dy = obj1CenterY - obj2CenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const obj1Radius = Math.min(obj1.width, obj1.height) / 2;
    const obj2Radius = Math.min(obj2.width, obj2.height) / 2;

    return distance < (obj1Radius + obj2Radius);
}

// デバッグ用：衝突判定ボックスを描画
function drawDebugBounds(ctx, obj) {
    const bounds = obj.getBounds();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
}
