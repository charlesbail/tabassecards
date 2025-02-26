import { questions, shuffleQuestions } from './questions.js';

class Game {
    constructor() {
        this.questions = shuffleQuestions().slice(0, 15); // Get 15 random questions
        this.currentQuestionIndex = 0;
        this.history = [];
        this.timerDuration = 7000; // 7 seconds
        this.timerInterval = null;

        // Initialize UI elements
        this.initializeUI();
        this.setupEventListeners();
        this.loadQuestion();
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
        
        // Navigation elements
        this.currentScoreElement = document.getElementById('current-score');
        this.frontNumberElement = document.getElementById('front-nb');
        this.backNumberElement = document.getElementById('back-nb');
        
        // Modal
        this.historyModal = document.getElementById('history-modal');
        
        // Timer elements
        this.timerElement = document.getElementById('timer-bar');
        this.timerTextElement = document.getElementById('timer-text');
        this.timerEndText = document.getElementById('timer-end-text');
    }

    setupEventListeners() {
        // Flip card
        this.flipButton.addEventListener('click', () => this.flipCard());
        
        // Navigation buttons
        document.getElementById('prev-question').addEventListener('click', () => this.prevQuestion());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        
        // History button
        document.getElementById('show-history').addEventListener('click', () => this.showHistory());
        document.querySelector('.close').addEventListener('click', () => this.hideHistory());
    }

    startTimer() {
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Hide the end text when starting new timer
        this.timerEndText.classList.remove('show');

        const startTime = Date.now();
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(Math.ceil((this.timerDuration - elapsed) / 1000), 0);
            const progress = Math.min((elapsed / this.timerDuration) * 100, 100);
            
            this.timerElement.style.height = `${progress}%`;
            
            if (remaining > 0) {
                this.timerTextElement.textContent = `${remaining}s`;
            } else {
                clearInterval(this.timerInterval);
                this.timerTextElement.textContent = '';
                this.timerElement.style.height = '100%';
                this.timerEndText.classList.add('show');
            }
        };

        // Reset timer
        this.timerElement.style.height = '0%';
        this.timerTextElement.textContent = '7s';
        // Start new timer with more frequent updates
        this.timerInterval = setInterval(updateTimer, 50);
        // Run once immediately to prevent initial delay
        updateTimer();
    }

    loadQuestion() {
        // Hide the end text when loading new question
        this.timerEndText.classList.remove('show');
        
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
        this.currentScoreElement.textContent = questionNumber;

        // Add to history if not already there
        if (!this.history.some(item => item.id === question.id)) {
            this.history.push({
                id: question.id,
                question: question.question,
                category: question.category
            });
        }

        // Start the timer for the new question
        this.startTimer();
    }

    flipCard() {
        this.cardFront.classList.toggle('front-isflipped');
        this.cardBack.classList.toggle('back-isflipped');
        // Don't stop the timer when flipping the card
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion();
        }
    }

    showHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item">
                <div class="history-number">${index + 1}</div>
                <div class="history-content">
                    <div class="history-category">${item.category}</div>
                    <div class="history-question">${item.question}</div>
                </div>
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
        }, 300);
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 