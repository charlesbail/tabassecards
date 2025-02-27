import { questions } from './questions.js';


// Game class
class Game {
    constructor() {
        // Wait for DOM content to be loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.allQuestions = [...questions];
        this.currentQuestionIndex = 0;
        this.timerDuration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--timer-duration')) * 1000;
        this.timerInterval = null;
        this.isFlipped = false;
        this.thermoSvg = null;
        this.thermoBar = null;

        // Handle viewport height
        this.handleViewportHeight();
        window.addEventListener('resize', () => this.handleViewportHeight());
        window.addEventListener('orientationchange', () => this.handleViewportHeight());

        // Initialize UI elements
        this.initializeUI();
        this.setupEventListeners();

        // Set initial transforms
        gsap.set(this.cardBack, { rotationY: 180 });

        // Load the first question after initialization
        this.loadQuestion();
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
        this.timerTextElement = document.getElementById('timer-text');
        
        // Create and add the timer bar
        const timerContainer = document.querySelector('.timer-container');
        this.timerBar = document.createElement('div');
        this.timerBar.className = 'timer-bar';
        timerContainer.appendChild(this.timerBar);
        
        // Start the first timer
        this.startTimer();
    }

    setupEventListeners() {
        // Add click event to the card container
        this.cardContainer.addEventListener('mousedown', () => this.flipCard());
        
        // Navigation button
        document.querySelector('.shuffle-button').addEventListener('mousedown', () => this.pickRandomQuestion());
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Reset timer state and clear any previous GSAP animations
        gsap.killTweensOf([this.timerTextElement, this.timerBar]);
        gsap.set(this.timerTextElement, {
            clearProps: "all",
            scale: 1,
            rotation: 8,
            backgroundColor: "#FF00B5"
        });
        gsap.set(this.timerBar, {
            height: 0,
            clearProps: "all"
        });

        this.timerTextElement.style.display = 'flex';
        this.timerTextElement.style.bottom = '28px';
        this.timerTextElement.classList.remove('finished');
        this.timerTextElement.textContent = `${this.timerDuration/1000}s`;

        // Animate the progress bar
        gsap.to(this.timerBar, {
            height: 191,
            duration: this.timerDuration / 1000,
            ease: "linear"
        });

        const startTime = Date.now();
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(Math.ceil((this.timerDuration - elapsed) / 1000), 0);
            
            // Update timer text position based on current progress bar height
            const progress = Math.min((elapsed / this.timerDuration), 1);
            const barHeight = progress * 191;
            this.timerTextElement.style.bottom = `${8 + barHeight}px`;
            
            if (remaining > 0) {
                this.timerTextElement.textContent = `${remaining}s`;
            } else {
                this.timerTextElement.textContent = '🔥';
                this.timerTextElement.classList.add('finished');
                gsap.to(this.timerTextElement, {
                    scale: 2,
                    rotation: -8,
                    duration: 1.4,
                    ease: "elastic.out(1,0.3)",
                    backgroundColor: "#FFB803"
                });
                clearInterval(this.timerInterval);
            }
        };

        this.timerInterval = setInterval(updateTimer, 16);
        updateTimer();
    }

    loadQuestion() {
        const question = this.allQuestions[this.currentQuestionIndex];
        
        // Reset and start timer immediately
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Kill any existing GSAP animations before starting new ones
        gsap.killTweensOf(this.timerTextElement);
        
        this.startTimer();
        
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


// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
