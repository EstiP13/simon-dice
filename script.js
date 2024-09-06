const buttons = {
    green: document.getElementById('green'),
    red: document.getElementById('red'),
    yellow: document.getElementById('yellow'),
    blue: document.getElementById('blue')
};

const buttonSounds = {
    green: new Audio('sounds/green.mp3'),
    red: new Audio('sounds/red.mp3'),
    yellow: new Audio('sounds/yellow.mp3'),
    blue: new Audio('sounds/blue.mp3'),
    wrong: new Audio('sounds/wrong.mp3')
};

const buttonIds = ['green', 'red', 'yellow', 'blue'];

let sequence = [];
let playerSequence = [];
let level = 0;
let score = 0;
let streak = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameStarted = false;
let timer;
let timeLeft = 60;

document.getElementById('high-score').textContent = `Mejor Puntaje: ${highScore}`;

// Modal elements
const modal = document.getElementById('game-over-modal');
const finalMessage = document.getElementById('final-message');
const finalScore = document.getElementById('final-score');
const finalLevel = document.getElementById('final-level');
const finalStreak = document.getElementById('final-streak');
const closeModalBtn = document.getElementById('close-modal-btn');

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    resetGame();
});

function startGame() {
    resetGame();
    gameStarted = true;
    nextSequence();
    startTimer();
}

function nextSequence() {
    playerSequence = [];
    level++;
    document.getElementById('message').textContent = `Nivel ${level}`;
    const randomButton = buttonIds[Math.floor(Math.random() * 4)];
    sequence.push(randomButton);
    playSequence();
}

function playSequence() {
    let index = 0;
    disableButtons();
    const interval = setInterval(() => {
        if (index >= sequence.length) {
            clearInterval(interval);
            enableButtons();
            return;
        }
        const button = sequence[index];
        flashButton(button);
        buttonSounds[button].play();
        index++;
    }, 1000);
}

function flashButton(buttonId) {
    const button = buttons[buttonId];
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 500);
}

function handleButtonClick(buttonId) {
    if (!gameStarted) return;
    playerSequence.push(buttonId);
    flashButton(buttonId);
    buttonSounds[buttonId].play();
    checkSequence();
}

function checkSequence() {
    const currentStep = playerSequence.length - 1;
    
    if (playerSequence[currentStep] !== sequence[currentStep]) {
        buttonSounds.wrong.play();
        gameOver();
        return;
    }
    
    if (playerSequence.length === sequence.length) {
        score += level * 10;
        streak++;
        document.getElementById('score-value').textContent = score;
        document.getElementById('streak').textContent = `Racha: ${streak}`;
        disableButtons();
        setTimeout(nextSequence, 1000);
    }
}

function gameOver() {
    gameStarted = false;
    clearInterval(timer);
    disableButtons();
    document.getElementById('message').textContent = `¡Juego terminado! Nivel alcanzado: ${level}`;
    checkHighScore();
    showGameOverModal();
}

function checkHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score').textContent = `Mejor Puntaje: ${highScore}`;
    }
}

function showGameOverModal() {
    finalMessage.textContent = `¡Has fallado!`;
    finalScore.textContent = score;
    finalLevel.textContent = level;
    finalStreak.textContent = streak;
    modal.style.display = 'flex';
}

function resetGame() {
    level = 0;
    sequence = [];
    playerSequence = [];
    score = 0;
    streak = 0;
    gameStarted = false;
    document.getElementById('score-value').textContent = score;
    document.getElementById('streak').textContent = `Racha: ${streak}`;
    document.getElementById('message').textContent = 'Haz clic en "Iniciar"';
    document.getElementById('timer-value').textContent = '01:00';
    clearInterval(timer);
}

function startTimer() {
    timeLeft = 60;
    document.getElementById('timer-value').textContent = `01:00`;
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer-value').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

function enableButtons() {
    buttonIds.forEach(id => {
        buttons[id].addEventListener('click', handleClick);
    });
}

function disableButtons() {
    buttonIds.forEach(id => {
        buttons[id].removeEventListener('click', handleClick);
    });
}

function handleClick(event) {
    handleButtonClick(event.target.id);
}

document.getElementById('start-btn').addEventListener('click', startGame);

document.getElementById('toggle-mode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const modeButton = document.getElementById('toggle-mode');
    if (document.body.classList.contains('dark-mode')) {
        modeButton.textContent = 'Modo Día';
    } else {
        modeButton.textContent = 'Modo Noche';
    }
});

