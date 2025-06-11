class NumberGame {
    constructor() {
        this.grid = document.getElementById('grid');
        this.timeDisplay = document.getElementById('time');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.result = document.getElementById('result');
        this.finalTime = document.getElementById('final-time');
        
        this.numbers = [];
        this.currentNumber = 1;
        this.startTime = null;
        this.timerInterval = null;
        this.gameActive = false;
        
        this.initializeEventListeners();
        this.generateGrid();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    
    generateRandomNumbers() {
        const numbers = [];
        while (numbers.length < 16) {
            const randomNum = Math.floor(Math.random() * 50) + 1;
            if (!numbers.includes(randomNum)) {
                numbers.push(randomNum);
            }
        }
        return numbers;
    }
    
    generateGrid() {
        this.grid.innerHTML = '';
        this.numbers = this.generateRandomNumbers();
        
        this.numbers.forEach((number, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = number;
            cell.dataset.number = number;
            cell.addEventListener('click', () => this.handleCellClick(number, cell));
            this.grid.appendChild(cell);
        });
    }
    
    startGame() {
        this.gameActive = true;
        this.currentNumber = 1;
        this.startTime = Date.now();
        this.result.style.display = 'none';
        
        this.startBtn.disabled = true;
        
        this.startTimer();
        this.resetCellStyles();
    }
    
    resetGame() {
        this.gameActive = false;
        this.currentNumber = 1;
        this.startTime = null;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.timeDisplay.textContent = '0.00';
        this.startBtn.disabled = false;
        this.result.style.display = 'none';
        
        this.generateGrid();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.startTime) {
                const elapsed = (Date.now() - this.startTime) / 1000;
                this.timeDisplay.textContent = elapsed.toFixed(2);
            }
        }, 10);
    }
    
    handleCellClick(number, cell) {
        if (!this.gameActive) return;
        
        const sortedNumbers = [...this.numbers].sort((a, b) => a - b);
        const expectedNumber = sortedNumbers[this.currentNumber - 1];
        
        if (number === expectedNumber) {
            cell.classList.add('clicked');
            cell.style.pointerEvents = 'none';
            this.currentNumber++;
            
            
            if (this.currentNumber > 16) {
                this.completeGame();
            }
        } else {
            cell.classList.add('wrong');
            setTimeout(() => {
                cell.classList.remove('wrong');
            }, 500);
        }
    }
    
    completeGame() {
        this.gameActive = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const finalTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
        this.finalTime.textContent = finalTime;
        this.result.style.display = 'block';
        this.startBtn.disabled = false;
    }
    
    resetCellStyles() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('clicked', 'wrong');
            cell.style.pointerEvents = 'auto';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NumberGame();
});