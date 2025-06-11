class NumberGame {
    constructor() {
        this.grid = document.getElementById('grid');
        this.timeDisplay = document.getElementById('time');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.result = document.getElementById('result');
        this.finalTime = document.getElementById('final-time');
        this.mistakeCountDisplay = document.getElementById('mistake-count');
        
        this.numbers = [];
        this.currentNumber = 1;
        this.startTime = null;
        this.timerInterval = null;
        this.gameActive = false;
        this.mistakeCount = 0;
        
        this.initializeEventListeners();
        this.loadTopScores();
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
        
        const newRank = this.addToTopScores(parseFloat(finalTime), this.mistakeCount);
        if (newRank > 0) {
            const newRecordMsg = document.createElement('p');
            newRecordMsg.textContent = `🎉 ${newRank}位にランクイン！`;
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
    
    loadTopScores() {
        const topScores = JSON.parse(localStorage.getItem('brainNumberTopScores')) || [];
        this.displayTopScores(topScores);
    }
    
    saveTopScores(scores) {
        localStorage.setItem('brainNumberTopScores', JSON.stringify(scores));
    }
    
    addToTopScores(time, mistakes) {
        let topScores = JSON.parse(localStorage.getItem('brainNumberTopScores')) || [];
        
        const newScore = { time, mistakes };
        topScores.push(newScore);
        
        // タイム優先でソート（タイムが速い順、同じタイムならミス少ない順）
        topScores.sort((a, b) => {
            if (a.time !== b.time) {
                return a.time - b.time;
            }
            return a.mistakes - b.mistakes;
        });
        
        // Top3のみ保持
        topScores = topScores.slice(0, 3);
        
        this.saveTopScores(topScores);
        this.displayTopScores(topScores);
        
        // 新しいスコアがTop3に入ったかチェック
        const newRankIndex = topScores.findIndex(score => 
            score.time === time && score.mistakes === mistakes
        );
        
        return newRankIndex >= 0 ? newRankIndex + 1 : 0;
    }
    
    displayTopScores(scores) {
        for (let i = 1; i <= 3; i++) {
            const scoreElement = document.getElementById(`score-${i}`);
            if (scores[i - 1]) {
                const score = scores[i - 1];
                scoreElement.textContent = `${score.time}秒 (ミス${score.mistakes}回)`;
            } else {
                scoreElement.textContent = '記録なし';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NumberGame();
});