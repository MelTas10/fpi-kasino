/ script.js
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
    }, 1500);

    loadStats();
});

let balance = 1000;
let stats = {
    totalGames: 0,
    wins: 0,
    losses: 0
};

function updateBalance(amount) {
    balance += amount;
    document.getElementById('balance').textContent = `${balance} FPI`;
    saveStats();
}

function playClassic() {
    const bet = parseInt(document.getElementById('classic-bet').value);
    if (bet > balance) {
        alert('Недостаточно средств!');
        return;
    }

    const result = Math.random() * 100;
    if (result <= 47) {
        updateBalance(bet);
        stats.wins++;
        document.getElementById('classic-result').textContent = 'Победа!';
    } else {
        updateBalance(-bet);
        stats.losses++;
        document.getElementById('classic-result').textContent = 'Проигрыш!';
    }
    
    stats.totalGames++;
    updateStats();
}

function playDice() {
    const bet = parseInt(document.getElementById('dice-bet').value);
    if (bet > balance) {
        alert('Недостаточно средств!');
        return;
    }

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    
    document.getElementById('dice1').textContent = dice1;
    document.getElementById('dice2').textContent = dice2;

    if (dice1 + dice2 > 7) {
        updateBalance(bet);
        stats.wins++;
    } else {
        updateBalance(-bet);
        stats.losses++;
    }

    stats.totalGames++;
    updateStats();
}

function startRace() {
    const bet = parseInt(document.getElementById('race-bet').value);
    if (bet > balance) {
        alert('Недостаточно средств!');
        return;
    }

    const carSelect = document.getElementById('car-select');
    const selectedCar = parseInt(carSelect.value);
    const position = Math.floor(Math.random() * 10) + 1;

    let multiplier = 0;
    if (position === 1) multiplier = 10;
    else if (position === 2) multiplier = 5;
    else if (position === 3) multiplier = 3;
    else if (position <= 5) multiplier = 1.5;

    if (multiplier > 0) {
        updateBalance(bet * multiplier);
        stats.wins++;
    } else {
        updateBalance(-bet);
        stats.losses++;
    }

    stats.totalGames++;
    updateStats();
}

function updateStats() {
    document.getElementById('total-games').textContent = stats.totalGames;
    document.getElementById('wins').textContent = stats.wins;
    document.getElementById('losses').textContent = stats.losses;
    saveStats();
}

function saveStats() {
    localStorage.setItem('fpiCasinoStats', JSON.stringify({
        balance: balance,
        stats: stats
    }));
}

function loadStats() {
    const saved = localStorage.getItem('fpiCasinoStats');
    if (saved) {
        const data = JSON.parse(saved);
        balance = data.balance;
        stats = data.stats;
        updateStats();
        document.getElementById('balance').textContent = `${balance} FPI`;
    }
}
