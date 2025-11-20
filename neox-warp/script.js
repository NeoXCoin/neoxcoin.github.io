function updateStatus() {
  document.getElementById('sector').textContent = game.sector;
  document.getElementById('fuel').textContent = game.fuel;
  document.getElementById('scrap').textContent = game.scrap;
  document.getElementById('damage').textContent = game.damage;

  // 更新損耗條（0–100）
  const bar = document.getElementById('damage-bar-fill');
  if (bar) {
    const dmg = Math.max(0, Math.min(100, game.damage));
    bar.style.width = dmg + '%';

    // 損耗愈高，光暈愈紅
    if (dmg < 35) {
      bar.style.boxShadow = '0 0 14px rgba(34,197,94,0.9)';
    } else if (dmg < 70) {
      bar.style.boxShadow = '0 0 14px rgba(234,179,8,0.9)';
    } else {
      bar.style.boxShadow = '0 0 16px rgba(239,68,68,0.98)';
    }
  }

  // 檢查遊戲結束條件（原本程式保持不變）
  if (game.fuel < FUEL_COST || game.damage >= 100) {
    endGame(game.damage >= 100 ? "飛船結構崩塌，你的旅程結束了。" : "燃料耗盡，你被困在虛空中。");
    return;
  }

  if (game.sector > MAX_SECTOR && !game.gameOver) {
    endGame("恭喜你！你成功逃離了邊緣碎帶，進入了星系深處！勝利！", true);
    return;
  }

  if (!game.gameOver) {
    generateJumpOptions();
  }
}