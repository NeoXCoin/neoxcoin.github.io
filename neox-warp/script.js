let game = {
    fuel: 15,
    scrap: 100,
    nanocrystals: 1,
    damage: 3, // 初始損耗 3%
    sector: 1,
    gameOver: false
};

const FUEL_COST = 5;
const MAX_SECTOR = 5;
const REPAIR_SCRAP = 50;
const REPAIR_NANO = 1;

const logPanel = document.getElementById('log-panel');
const actionButtons = document.getElementById('action-buttons');

// 隨機事件列表
const events = [
    {
        name: "廢棄的燃料倉庫",
        text: "你發現一個漂浮的燃料倉。結構不穩定。",
        optionA: "強行提取 (+30 燃料, 25% 機率 +10% 損耗)",
        optionB: "小心翼翼 (+10 燃料)",
        action: (choice) => {
            if (choice === 'A') {
                game.fuel += 30;
                if (Math.random() < 0.25) {
                    game.damage += 10;
                    return "你成功提取大量燃料，但飛船承受了巨大壓力，損耗增加 10%。";
                }
                return "大量燃料被成功提取。";
            } else {
                game.fuel += 10;
                return "小心翼翼地獲取了少量燃料。";
            }
        }
    },
    {
        name: "掠奪者偵察機",
        text: "一架掠奪者偵察機出現，準備攻擊！",
        optionA: "戰鬥 (勝利 +100 廢料, 失敗 -10 損耗)",
        optionB: "逃離 (-5 燃料)",
        action: (choice) => {
            if (choice === 'A') {
                if (Math.random() < 0.6) { // 60% 勝率
                    game.scrap += 100;
                    return "你擊敗了偵察機，獲得了大量廢料。";
                } else {
                    game.damage += 10;
                    return "戰鬥失利，飛船遭受嚴重打擊，損耗增加 10%。";
                }
            } else {
                game.fuel -= 5;
                return "你緊急啟動引擎逃離，浪費了寶貴的燃料。";
            }
        }
    },
    {
        name: "和平貿易站",
        text: "一個中立的貿易站。你可以買賣資源。",
        optionA: "購買燃料 (+10 燃料, -50 廢料)",
        optionB: "出售廢料 (-10 燃料, +50 廢料)",
        action: (choice) => {
            if (choice === 'A') {
                if (game.scrap >= 50) {
                    game.fuel += 10;
                    game.scrap -= 50;
                    return "交易成功，燃料補充完成。";
                } else {
                    return "廢料不足，無法購買燃料。";
                }
            } else {
                game.fuel -= 10;
                game.scrap += 50;
                return "你高價出售了一些燃料。";
            }
        }
    },
    {
        name: "古老遺跡節點",
        text: "你發現一個古代遺跡！你的船員 Kael 建議分析它。",
        optionA: "分析遺跡 (+1 納米晶, 10% 機率 +5% 損耗)",
        optionB: "忽略 (直接跳躍)",
        action: (choice) => {
            if (choice === 'A') {
                game.nanocrystals += 1;
                 if (Math.random() < 0.1) {
                    game.damage += 5;
                    return "遺跡強大，你獲得了一個納米晶，但能量超載造成 5% 損耗。";
                }
                return "你從遺跡中獲得了一個納米晶。";
            } else {
                return "你決定不冒險，忽略了遺跡。";
            }
        }
    }
];

function updateStatus() {
    document.getElementById('sector').textContent = game.sector;
    document.getElementById('fuel').textContent = game.fuel;
    document.getElementById('scrap').textContent = game.scrap;
    document.getElementById('damage').textContent = game.damage;

    // 檢查遊戲結束條件
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

function logMessage(message) {
    const p = document.createElement('p');
    p.className = 'event-message';
    p.textContent = `[星系 ${game.sector}] ${message}`;
    logPanel.prepend(p);
}

function generateJumpOptions() {
    actionButtons.innerHTML = '';
    
    // 下一個星系選項
    const sectorsToJump = game.sector < MAX_SECTOR ? 2 : 1;
    
    for (let i = 0; i < sectorsToJump; i++) {
        const option = events[Math.floor(Math.random() * events.length)];
        const button = document.createElement('button');
        button.textContent = `跳躍至 [${option.name}] (消耗 ${FUEL_COST} 燃料)`;
        button.onclick = () => jump(option);
        actionButtons.appendChild(button);
    }
}

function jump(eventOption) {
    if (game.fuel < FUEL_COST) {
        logMessage("燃料不足，無法跳躍！");
        return;
    }

    // 消耗燃料並增加扇區
    game.fuel -= FUEL_COST;
    game.sector++;
    
    logMessage(`成功跳躍！你來到了 [${eventOption.name}]。`);
    
    // 進入事件介面
    actionButtons.innerHTML = '';
    logMessage(eventOption.text);

    const btnA = document.createElement('button');
    btnA.textContent = eventOption.optionA;
    btnA.onclick = () => handleEventAction(eventOption, 'A');
    actionButtons.appendChild(btnA);

    const btnB = document.createElement('button');
    btnB.textContent = eventOption.optionB;
    btnB.onclick = () => handleEventAction(eventOption, 'B');
    actionButtons.appendChild(btnB);

    updateStatus();
}

function handleEventAction(eventOption, choice) {
    const resultMessage = eventOption.action(choice);
    logMessage(`**選擇結果:** ${resultMessage}`);
    // 返回跳躍選擇
    updateStatus();
}

function upgradeShip() {
    const upgradeCost = REPAIR_SCRAP;
    const upgradeNano = REPAIR_NANO;
    
    if (game.scrap >= upgradeCost && game.nanocrystals >= upgradeNano) {
        game.scrap -= upgradeCost;
        game.nanocrystals -= upgradeNano;
        game.damage = Math.max(0, game.damage - 20); // 修復 20% 損耗
        logMessage(`成功使用 ${upgradeCost} 廢料和 ${upgradeNano} 納米晶修復飛船，損耗降低 20%。`);
    } else {
        logMessage(`資源不足！修復需要 ${upgradeCost} 廢料和 ${upgradeNano} 納米晶。`);
    }
    updateStatus();
}

function endGame(message, isWin = false) {
    game.gameOver = true;
    actionButtons.innerHTML = '';
    logMessage(`--- ${isWin ? '勝利' : '遊戲結束'} ---`);
    logMessage(message);
    
    const restartButton = document.createElement('button');
    restartButton.textContent = "重新開始";
    restartButton.onclick = () => window.location.reload();
    actionButtons.appendChild(restartButton);
}

// 啟動遊戲
window.onload = updateStatus;
