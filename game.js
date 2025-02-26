import { questions, shuffleQuestions } from './questions.js';

class Game {
    constructor() {
        this.allQuestions = [...questions]; // Store all questions
        this.questions = shuffleQuestions().slice(0, 15); // Get 15 random questions
        this.currentQuestionIndex = 0;
        this.timerDuration = 7000; // 7 seconds
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
        // Get the actual viewport height
        const vh = window.innerHeight * 0.01;
        // Set the value on the root element
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
        
        // Navigation elements
        this.progressCounter = document.getElementById('progress-counter');
        
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
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Reset timer UI immediately
        const timerBar = document.getElementById('timer-bar');
        timerBar.setAttribute('d', 'M31 204C31 206.209 32.7909 208 35 208V208C37.2091 208 39 206.209 39 204V204H31V204Z');
        
        // Don't remove finished class, just update the text and position
        this.timerTextElement.style.display = 'block';
        this.timerTextElement.style.transform = 'translate(-9px, -60px) rotate(-8deg)';
        this.timerTextElement.style.background = '#FF00B5';
        this.timerTextElement.textContent = '7s';

        // Force reflow to ensure animation restarts
        timerBar.offsetHeight;
        this.timerTextElement.offsetHeight;

        const startTime = Date.now();
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(Math.ceil((this.timerDuration - elapsed) / 1000), 0);
            const progress = Math.min((elapsed / this.timerDuration) * 100, 100);
            
            // Calculate the end Y position based on progress (from 204 to 17)
            const endY = 204 - ((204 - 17) * (progress / 100));
            timerBar.setAttribute('d', `M31 204C31 206.209 32.7909 208 35 208V208C37.2091 208 39 206.209 39 204V${endY}H31V204Z`);
            
            // Calculate text position to match bar progression
            const textPosition = -60 - ((204 - endY) *0.8);
            this.timerTextElement.style.transform = `translate(-9px, ${textPosition}px) rotate(-8deg)`;
            
            // Update timer text content
            if (remaining > 0) {
                this.timerTextElement.textContent = `${remaining}s`;
            } else {
                this.timerTextElement.textContent = '🔥';
                this.timerTextElement.style.background = '#FFB803';
                clearInterval(this.timerInterval);
            }
        };

        // Start new timer with more frequent updates for smoother animation
        this.timerInterval = setInterval(updateTimer, 16); // ~60fps for smoother animation
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
        const timerBar = document.getElementById('timer-bar');
        timerBar.setAttribute('d', 'M31 204C31 206.209 32.7909 208 35 208V208C37.2091 208 39 206.209 39 204V204H31V204Z');
        this.timerTextElement.style.transform = 'translate(-9px, -60px) rotate(-8deg)';
        this.timerTextElement.style.background = '#FF00B5';
        this.timerTextElement.textContent = '7s';
        this.timerTextElement.style.display = 'block';
        
        // Force reflow to ensure changes take effect
        timerBar.offsetHeight;
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
        .to('.timer-container', {
            y: 10,
            duration: 0.05,
            ease: "power1.in"
        }, "<")
        .call(() => {
            // Update content
            this.categoryElement.textContent = question.category;
            this.questionElement.textContent = question.question;
            this.authorElement.textContent = `Par ${question.author}`;
            this.backCategoryElement.textContent = question.category;
            
            // Update question number in progress counter
            const questionNumber = this.currentQuestionIndex + 1;
            this.progressCounter.textContent = `${questionNumber}/15`;
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

    pickRandomQuestion() {
        // If card is flipped, flip it back first
        if (this.isFlipped) {
            this.flipCard();
        }

        // Get a random question from all available questions
        const randomIndex = Math.floor(Math.random() * this.allQuestions.length);
        const randomQuestion = this.allQuestions[randomIndex];

        // Move to next question index, loop back to start if at the end
        if (this.currentQuestionIndex === this.questions.length - 1) {
            this.currentQuestionIndex = 0;
        } else {
            this.currentQuestionIndex++;
        }

        // Replace next question with the random one
        this.questions[this.currentQuestionIndex] = randomQuestion;
        
        // Load the new question
        this.loadQuestion();
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 