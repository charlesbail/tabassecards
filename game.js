import { questions, shuffleQuestions } from './questions.js';

class Game {
    constructor() {
        this.questions = shuffleQuestions().slice(0, 15); // Get 15 random questions
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.spiceCount = 0;
        this.history = [];
        this.timer = null;
        this.timeLeft = 30;
        this.isFlipped = false;

        // Initialize UI elements
        this.initializeUI();
        this.setupEventListeners();
        this.loadQuestion();
        this.startTimer();
    }

    initializeUI() {
        // Card elements
        this.cardFront = document.querySelector('.front');
        this.cardBack = document.querySelector('.back');
        this.flipButton = document.getElementById('flip-card');
        
        // Question elements
        this.categoryElement = document.getElementById('question-category');
        this.questionElement = document.getElementById('question-text');
        this.authorElement = document.getElementById('question-author');
        this.backCategoryElement = document.getElementById('back-category');
        
        // Score elements
        this.currentScoreElement = document.getElementById('current-score');
        this.frontNumberElement = document.getElementById('front-nb');
        this.backNumberElement = document.getElementById('back-nb');
        
        // Timer element
        this.timerElement = document.getElementById('timer-bar');
        
        // Modals
        this.historyModal = document.getElementById('history-modal');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.takeSauceModal = document.getElementById('take-sauce-modal');
    }

    setupEventListeners() {
        // Flip card
        this.flipButton.addEventListener('click', () => this.flipCard());
        
        // Answer buttons
        document.getElementById('correct-answer').addEventListener('click', () => this.handleAnswer(true));
        document.getElementById('wrong-answer').addEventListener('click', () => this.handleAnswer(false));
        
        // History button
        document.getElementById('show-history').addEventListener('click', () => this.showHistory());
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
        });
        
        // Next after sauce
        document.getElementById('next-after-sauce').addEventListener('click', () => {
            this.takeSauceModal.classList.remove('show');
            setTimeout(() => {
                this.takeSauceModal.style.display = 'none';
                this.nextQuestion();
            }, 300);
        });
        
        // Restart game
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
    }

    startTimer() {
        this.timeLeft = 30;
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            const percentage = (this.timeLeft / 30) * 100;
            this.timerElement.style.height = `${percentage}%`;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleAnswer(false); // Auto-fail if time runs out
            }
        }, 1000);
    }

    flipCard() {
        this.isFlipped = !this.isFlipped;
        this.cardFront.classList.toggle('front-isflipped');
        this.cardBack.classList.toggle('back-isflipped');
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update front of card
        this.categoryElement.textContent = question.category;
        this.questionElement.textContent = question.question;
        this.authorElement.textContent = `Par ${question.author}`;
        
        // Update back of card
        this.backCategoryElement.textContent = question.category;
        
        // Update question number
        const questionNumber = this.currentQuestionIndex + 1;
        this.frontNumberElement.textContent = questionNumber;
        this.backNumberElement.textContent = questionNumber;
        
        // Reset card flip if needed
        if (this.isFlipped) this.flipCard();
        
        // Start new timer
        this.startTimer();
    }

    handleAnswer(isCorrect) {
        clearInterval(this.timer);
        
        if (isCorrect) {
            this.score++;
            this.currentScoreElement.textContent = this.score;
            this.nextQuestion();
        } else {
            this.spiceCount++;
            this.takeSauceModal.classList.add('show');
        }
        
        // Add to history
        this.history.push({
            question: this.questions[this.currentQuestionIndex].question,
            category: this.questions[this.currentQuestionIndex].category,
            isCorrect
        });
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
        } else {
            if (this.takeSauceModal.classList.contains('show')) {
                this.takeSauceModal.classList.remove('show');
                setTimeout(() => {
                    this.takeSauceModal.style.display = 'none';
                    this.loadQuestion();
                }, 300);
            } else {
                this.loadQuestion();
            }
        }
    }

    showHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item ${item.isCorrect ? 'correct' : 'wrong'}">
                <div class="history-number">${index + 1}</div>
                <div class="history-content">
                    <div class="history-category">${item.category}</div>
                    <div class="history-question">${item.question}</div>
                </div>
                <div class="history-result">${item.isCorrect ? '✓' : '✗'}</div>
            </div>
        `).join('');
        
        this.historyModal.style.display = 'block';
        // Force reflow
        this.historyModal.offsetHeight;
        this.historyModal.classList.add('show');
    }

    hideHistory() {
        this.historyModal.classList.remove('show');
        setTimeout(() => {
            this.historyModal.style.display = 'none';
        }, 300); // Match the transition duration
    }

    endGame() {
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('spice-count').textContent = this.spiceCount;
        this.gameOverModal.style.display = 'block';
        // Force reflow
        this.gameOverModal.offsetHeight;
        this.gameOverModal.classList.add('show');
    }

    restartGame() {
        this.gameOverModal.classList.remove('show');
        setTimeout(() => {
            this.gameOverModal.style.display = 'none';
            this.questions = shuffleQuestions().slice(0, 15);
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.spiceCount = 0;
            this.history = [];
            this.currentScoreElement.textContent = '0';
            this.loadQuestion();
        }, 300);
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 