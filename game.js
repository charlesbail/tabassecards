import { questions, shuffleQuestions } from './questions.js';

class Game {
    constructor() {
        this.questions = shuffleQuestions().slice(0, 15); // Get 15 random questions
        this.currentQuestionIndex = 0;
        this.history = [];
        this.timerDuration = 7000; // 7 seconds
        this.timerInterval = null;
        this.isFlipped = false;

        // Initialize UI elements
        this.initializeUI();
        this.setupEventListeners();
        this.loadQuestion();

        // Set initial transforms
        gsap.set(this.cardBack, { rotationY: 180 });
    }

    initializeUI() {
        // Card elements
        this.cardContainer = document.querySelector('.cardcont');
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
            this.timerInterval = null;
        }

        // Reset timer UI immediately
        this.timerElement.style.height = '0%';
        this.timerTextElement.classList.remove('finished');
        this.timerTextElement.style.display = 'block';
        this.timerTextElement.style.bottom = '0%';
        this.timerTextElement.textContent = '7s';

        // Force reflow to ensure animation restarts
        this.timerElement.offsetHeight;
        this.timerTextElement.offsetHeight;

        const startTime = Date.now();
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(Math.ceil((this.timerDuration - elapsed) / 1000), 0);
            const progress = Math.min((elapsed / this.timerDuration) * 100, 100);
            
            // Update timer bar height
            this.timerElement.style.height = `${progress}%`;
            
            // Update timer text position and content
            if (remaining > 0) {
                this.timerTextElement.style.bottom = `${progress}%`;
                this.timerTextElement.textContent = `${remaining}s`;
            } else {
                this.timerTextElement.textContent = 'FINI!';
                this.timerTextElement.classList.add('finished');
                clearInterval(this.timerInterval);
            }
        };

        // Start new timer with more frequent updates
        this.timerInterval = setInterval(updateTimer, 50);
        // Run once immediately to prevent initial delay
        updateTimer();
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Reset timer immediately when starting to load new question
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Force immediate reset of timer UI
        this.timerElement.style.height = '0%';
        this.timerTextElement.style.bottom = '0%';
        this.timerTextElement.classList.remove('finished');
        this.timerTextElement.textContent = '7s';
        this.timerTextElement.style.display = 'block';
        
        // Force reflow to ensure changes take effect
        this.timerElement.offsetHeight;
        this.timerTextElement.offsetHeight;
        
        // Create timeline for card transition
        const tl = gsap.timeline();
        
        // Scale down and fade out
        tl.to(this.cardContainer, {
            scale: 0.8,
            opacity: 0.5,
            duration: 0.05,
            ease: "power1.in",
            onStart: () => {
                this.cardContainer.style.pointerEvents = 'none';
                // Ensure proper backface visibility during transition
                this.cardFront.style.backfaceVisibility = 'hidden';
                this.cardBack.style.backfaceVisibility = 'hidden';
                this.cardFront.style.webkitBackfaceVisibility = 'hidden';
                this.cardBack.style.webkitBackfaceVisibility = 'hidden';
            }
        })
        .call(() => {
            // Update content
            this.categoryElement.textContent = question.category;
            this.questionElement.textContent = question.question;
            this.authorElement.textContent = `Par ${question.author}`;
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
        })
        // Scale up and fade in
        .to(this.cardContainer, {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "elastic.out(1.2, 0.5)",
            onComplete: () => {
                this.cardContainer.style.pointerEvents = 'auto';
                this.startTimer();
            }
        });
    }

    flipCard() {
        const duration = 0.8;
        const ease = "elastic.out(0.5, 1)";

        if (this.isFlipped) {
            gsap.to(this.cardFront, {
                rotationY: 0,
                duration: duration,
                ease: ease
            });
            gsap.to(this.cardBack, {
                rotationY: 180,
                duration: duration,
                ease: ease
            });
        } else {
            gsap.to(this.cardFront, {
                rotationY: -180,
                duration: duration,
                ease: ease
            });
            gsap.to(this.cardBack, {
                rotationY: 0,
                duration: duration,
                ease: ease
            });
        }
        this.isFlipped = !this.isFlipped;
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            // If card is flipped, flip it back first
            if (this.isFlipped) {
                this.flipCard();
            }
            this.currentQuestionIndex--;
            this.loadQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            // If card is flipped, flip it back first
            if (this.isFlipped) {
                this.flipCard();
            }
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