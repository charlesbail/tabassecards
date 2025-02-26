import { questions, shuffleQuestions } from './questions.js';

class Game {
    constructor() {
        this.allQuestions = [...questions];
        this.currentQuestionIndex = 0;
        this.timerDuration = 7000;
        this.timerInterval = null;
        this.isFlipped = false;

        // Handle viewport height
        this.handleViewportHeight();
        window.addEventListener('resize', () => this.handleViewportHeight());
        window.addEventListener('orientationchange', () => this.handleViewportHeight());

        // Initialize UI elements
        this.initializeUI();
        this.setupEventListeners();
        this.loadQuestion();

        // Set initial transforms
        gsap.set(this.cardBack, { rotationY: 180 });
    }

    handleViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--real-vh', `${vh}px`);
    }

    initializeUI() {
        // Card elements
        this.cardContainer = document.querySelector('.cardcont');
        this.cardFront = document.querySelector('.front');
        this.cardBack = document.querySelector('.back');
        
        // Question elements
        this.categoryElement = document.getElementById('question-category');
        this.questionElement = document.getElementById('question-text');
        this.authorElement = document.getElementById('question-author');
        this.backCategoryElement = document.getElementById('back-category');
        
        // Timer elements
        this.timerElement = document.getElementById('timer-bar');
        this.timerTextElement = document.getElementById('timer-text');
    }

    setupEventListeners() {
        // Add click event to the card container
        this.cardContainer.addEventListener('click', () => this.flipCard());
        
        // Navigation button
        document.querySelector('.shuffle-button').addEventListener('click', () => this.pickRandomQuestion());
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const timerBar = document.getElementById('timer-bar');
        timerBar.setAttribute('d', 'M31 204C31 206.209 32.7909 208 35 208V208C37.2091 208 39 206.209 39 204V204H31V204Z');
        
        this.timerTextElement.style.display = 'block';
        this.timerTextElement.style.transform = 'translate(-9px, -60px) rotate(-8deg)';
        this.timerTextElement.style.background = '#FF00B5';
        this.timerTextElement.textContent = '7s';

        timerBar.offsetHeight;
        this.timerTextElement.offsetHeight;

        const startTime = Date.now();
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(Math.ceil((this.timerDuration - elapsed) / 1000), 0);
            const progress = Math.min((elapsed / this.timerDuration) * 100, 100);
            
            const endY = 204 - ((204 - 17) * (progress / 100));
            timerBar.setAttribute('d', `M31 204C31 206.209 32.7909 208 35 208V208C37.2091 208 39 206.209 39 204V${endY}H31V204Z`);
            
            const textPosition = -60 - ((204 - endY) *0.8);
            this.timerTextElement.style.transform = `translate(-9px, ${textPosition}px) rotate(-8deg)`;
            
            if (remaining > 0) {
                this.timerTextElement.textContent = `${remaining}s`;
            } else {
                this.timerTextElement.textContent = '🔥';
                this.timerTextElement.style.background = '#FFB803';
                clearInterval(this.timerInterval);
            }
        };

        this.timerInterval = setInterval(updateTimer, 16);
        updateTimer();
    }

    loadQuestion() {
        const question = this.allQuestions[this.currentQuestionIndex];
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const timerBar = document.getElementById('timer-bar');
        timerBar.setAttribute('d', 'M31 204C31 206.209 32.7909 208 35 208V208C37.2091 208 39 206.209 39 204V204H31V204Z');
        this.timerTextElement.style.transform = 'translate(-9px, -60px) rotate(-8deg)';
        this.timerTextElement.style.background = '#FF00B5';
        this.timerTextElement.textContent = '7s';
        this.timerTextElement.style.display = 'block';
        
        timerBar.offsetHeight;
        this.timerTextElement.offsetHeight;
        
        const tl = gsap.timeline();
        
        tl.to(this.cardContainer, {
            scale: 0.8,
            opacity: 0.5,
            duration: 0.05,
            ease: "power1.in",
            onStart: () => {
                this.cardContainer.style.pointerEvents = 'none';
                this.cardFront.style.backfaceVisibility = 'hidden';
                this.cardBack.style.backfaceVisibility = 'hidden';
                this.cardFront.style.webkitBackfaceVisibility = 'hidden';
                this.cardBack.style.webkitBackfaceVisibility = 'hidden';
            }
        })
        .to('.timer-container', {
            y: 10,
            duration: 0.05,
            ease: "power1.in"
        }, "<")
        .call(() => {
            this.categoryElement.textContent = question.category;
            this.questionElement.textContent = question.question;
            this.authorElement.textContent = `Par ${question.author}`;
            this.backCategoryElement.textContent = question.category;
        })
        .to(this.cardContainer, {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "elastic.out(1.2, 0.5)",
            onComplete: () => {
                this.cardContainer.style.pointerEvents = 'auto';
                this.startTimer();
            }
        })
        .to('.timer-container', {
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1.2, 0.5)"
        }, "<");
    }

    flipCard() {
        const duration = 0.95;
        const ease = "elastic.out(0.5, 0.5)";

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

    pickRandomQuestion() {
        if (this.isFlipped) {
            this.flipCard();
        }

        const randomIndex = Math.floor(Math.random() * this.allQuestions.length);
        this.currentQuestionIndex = randomIndex;
        this.loadQuestion();
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 