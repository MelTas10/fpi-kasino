// script.js
let state = {
    balance: 1000,
    wins: 0,
    losses: 0,
    totalWon: 0,
    totalLost: 0,
    lastBonus: 0
};

// Загрузка состояния из localStorage
function loadState() {
    const savedState = localStorage.getItem('fpiCasinoState');
    if (savedState) {
        state = JSON.parse(savedState);
        updateUI();
    }
}

// Сохранение состояния в localStorage
function saveState() {
    localStorage.setItem('fpiCasinoState', JSON.stringify(state));
    updateUI();
}

// Обновление UI
function updateUI() {
    document.getElementById('balance').textContent = state.balance;
    document.getElementById('wins').textContent = state.wins;
    document.getElementById('losses').textContent = state.losses;
    document.getElementById('totalWon').textContent = state.totalWon;
    document.getElementById('totalLost').textContent = state.totalLost;
    updateBonusButton();
}

// Слоты
function playSlots() {
    if (state.balance < 50) {
        alert('Недостаточно FPIcoins!');
        return;
    }

    state.balance -= 50;
    state.totalLost += 50;

    const symbols = ['7️⃣', '💎', '🍒', '🍊', '🍇', '🍎'];
    const result = Array.from({length: 3}, () => symbols[Math.floor(Math.random() * symbols.length)]);
    
    // Анимация
    let spins = 0;
    const maxSpins = 10;
    const spinInterval = setInterval(() => {
        document.getElementById('slot1').textContent = symbols[Math.floor(Math.random() * symbols.length)];
        document.getElementById('slot2').textContent = symbols[Math.floor(Math.random() * symbols.length)];
        document.getElementById('slot3').textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        spins++;
        if (spins >= maxSpins) {
            clearInterval(spinInterval);
            document.getElementById('slot1').textContent = result[0];
            document.getElementById('slot2').textContent = result[1];
            document.getElementById('slot3').textContent = result[2];
            
            // Проверка выигрыша
            let win = 0;
            if (new Set(result).size === 1) {
                win = 50 * 20; // x20 за три одинаковых
            } else if (new Set(result).size === 2) {
                win = 50 * 3;  // x3 за два одинаковых
            }

            if (win > 0) {
                state.balance += win;
                state.wins++;
                state.totalWon += win;
                alert(`Поздравляем! Вы выиграли ${win} FPIcoins!`);
            } else {
                state.losses++;
            }
            
            saveState();
        }
    }, 100);
}

// Кости
function playDice() {
    if (state.balance < 50) {
        alert('Недостаточно FPIcoins!');
        return;
    }

    state.balance -= 50;
    state.totalLost += 50;

    const diceResult = Math.floor(Math.random() * 6) + 1;
    document.getElementById('diceResult').textContent = diceResult;

    if (diceResult >= 4) {
        const win = 50 * diceResult;
        state.balance += win;
        state.wins++;
        state.totalWon += win;
        alert(`Поздравляем! Вы выиграли ${win} FPIcoins!`);
    } else {
        state.losses++;
    }

    saveState();
}

// Бонус
function updateBonusButton() {
    const now = Date.now();
    const bonusButton = document.getElementById('bonusButton');
    const bonusTimer = document.getElementById('bonusTimer');

    if (now - state.lastBonus < 24 * 60 * 60 * 1000) {
        bonusButton.disabled = true;
        const timeLeft = 24 * 60 * 60 * 1000 - (now - state.lastBonus);
        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        bonusTimer.textContent = `Доступно через ${hours}ч ${minutes}м`;
    } else {
        bonusButton.disabled = false;
        bonusTimer.textContent = 'Доступно!';
    }
}

function claimBonus() {
    const now = Date.now();
    if (now - state.lastBonus < 24 * 60 * 60 * 1000) {
        return;
    }

    const bonus = Math.floor(Math.random() * 401) + 100; // 100-500
    state.balance += bonus;
    state.lastBonus = now;
    alert(`Вы получили ${bonus} FPIcoins!`);
    saveState();
}

// Инициализация
loadState();
setInterval(updateBonusButton, 1000);
