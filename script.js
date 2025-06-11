class NumberGame {
    constructor() {
        this.grid = document.getElementById('grid');
        this.timeDisplay = document.getElementById('time');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.result = document.getElementById('result');
        this.finalTime = document.getElementById('final-time');
        this.mistakeCountDisplay = document.getElementById('mistake-count');
        this.bestTimeDisplay = document.getElementById('best-time');
        this.bestMistakesDisplay = document.getElementById('best-mistakes');
        
        this.numbers = [];
        this.currentNumber = 1;
        this.startTime = null;
        this.timerInterval = null;
        this.gameActive = false;
        this.mistakeCount = 0;
        
        this.initializeEventListeners();
        this.loadBestScore();
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
        this.mistakeCount = 0;
        this.startTime = Date.now();
        this.result.style.display = 'none';
        
        this.startBtn.disabled = true;
        
        this.showNumbers();
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
        this.hideNumbers();
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
            this.mistakeCount++;
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
        this.mistakeCountDisplay.textContent = this.mistakeCount;
        
        this.checkAndUpdateBestScore(parseFloat(finalTime), this.mistakeCount);
        
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
    
    showNumbers() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.add('game-started');
        });
    }
    
    hideNumbers() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('game-started');
        });
    }
    
    loadBestScore() {
        const bestScore = JSON.parse(localStorage.getItem('brainNumberBestScore'));
        if (bestScore) {
            this.bestTimeDisplay.textContent = bestScore.time + '秒';
            this.bestMistakesDisplay.textContent = bestScore.mistakes + '回';
        }
    }
    
    saveBestScore(time, mistakes) {
        const bestScore = { time, mistakes };
        localStorage.setItem('brainNumberBestScore', JSON.stringify(bestScore));
    }
    
    checkAndUpdateBestScore(currentTime, currentMistakes) {
        const bestScore = JSON.parse(localStorage.getItem('brainNumberBestScore'));
        
        let isNewBest = false;
        
        if (!bestScore) {
            isNewBest = true;
        } else {
            // ミス数が少ない、または同じミス数でタイムが速い場合
            if (currentMistakes < bestScore.mistakes || 
                (currentMistakes === bestScore.mistakes && currentTime < bestScore.time)) {
                isNewBest = true;
            }
        }
        
        if (isNewBest) {
            this.saveBestScore(currentTime, currentMistakes);
            this.bestTimeDisplay.textContent = currentTime + '秒';
            this.bestMistakesDisplay.textContent = currentMistakes + '回';
            
            // 新記録の表示を追加
            const newRecordMsg = document.createElement('p');
            newRecordMsg.textContent = '🎉 新記録達成！';
            newRecordMsg.style.color = '#38a169';
            newRecordMsg.style.fontWeight = 'bold';
            newRecordMsg.style.marginTop = '10px';
            this.result.appendChild(newRecordMsg);
            
            setTimeout(() => {
                if (newRecordMsg.parentNode) {
                    newRecordMsg.parentNode.removeChild(newRecordMsg);
                }
            }, 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NumberGame();
});