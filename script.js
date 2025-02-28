import { questions } from './questions.js';

// Constants
const TIMER_DURATION_SECONDS = 42;
const TIMER_DURATION_MS = TIMER_DURATION_SECONDS * 1000;

// Game class
class Game {
    constructor() {
        // Set timer duration as CSS variable immediately
        document.documentElement.style.setProperty('--timer-duration', `${TIMER_DURATION_SECONDS}s`);
        
        // Wait for DOM content to be loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.waitForDependencies());
        } else {
            this.waitForDependencies();
        }
    }

    waitForDependencies() {
        // Check if GSAP is loaded
        if (typeof gsap === 'undefined') {
            setTimeout(() => this.waitForDependencies(), 100);
            return;
        }
        this.init();
    }

    async init() {
        // Ensure loading class is present at start
        document.documentElement.classList.add('loading');
        document.body.classList.add('loading');

        this.allQuestions = [...questions];
        this.currentQuestionIndex = 0;
        this.timerBasePosition = 40;
        this.timerDuration = TIMER_DURATION_MS;
        this.timerInterval = null;
        this.completionTimeout = null;
        this.isFlipped = false;
        this.thermoSvg = null;
        this.timerBar = null;

        // Handle viewport height
        this.handleViewportHeight();
        window.addEventListener('resize', () => this.handleViewportHeight());
        window.addEventListener('orientationchange', () => this.handleViewportHeight());

        try {
            // Start preloading
            await Promise.all([
                this.loadFonts(),
                this.preloadImages(),
                new Promise(resolve => setTimeout(resolve, 800)) // Minimum display time for loader
            ]);

            // Initialize UI elements after everything is loaded
            await this.initializeUI();
            this.setupEventListeners();

            // Set initial transforms
            gsap.set(this.cardBack, { rotationY: 180 });

            // Load the first question with a delay to ensure proper initialization
            await new Promise(resolve => setTimeout(resolve, 100));
            this.loadQuestion();
            
            // Remove loading class after everything is ready
            document.documentElement.classList.remove('loading');
            document.body.classList.remove('loading');

        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    async loadFonts() {
        const font = new FontFace('Space Grotesk', 'url(https://fonts.gstatic.com/s/spacegrotesk/v13/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2)');
        await font.load();
        document.fonts.add(font);
        return document.fonts.ready;
    }

    async preloadImages() {
        const imagePaths = [
            'assets/bg-pattern.png',
            'assets/back-background.png',
            'assets/mascotte.png',
            'assets/header-logo.png',
            'assets/flames.svg',
            'assets/thermo.svg',
            'assets/btn-shuffle.svg'
        ];

        const loadImage = src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        return Promise.all(imagePaths.map(loadImage));
    }

    handleViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--real-vh', `${vh}px`);
    }

    resetTimerText() {
        // Reset timer text appearance
        this.timerTextElement.classList.remove('finished');
        this.timerTextElement.style.display = 'flex';
        this.timerTextElement.style.transform = 'translate(0, -50px) rotate(-8deg)';
        this.timerTextElement.style.scale = "1";
        this.timerTextElement.style.backgroundColor = "#FF00B5";
        this.timerTextElement.style.bottom = "36px";
        this.timerTextElement.textContent = `${this.timerDuration/1000}s`;
        this.timerBar.style.height = '0px';
        
        // Force a reflow to ensure styles are applied
        void this.timerTextElement.offsetHeight;
        void this.timerBar.offsetHeight;
    }

    async initializeUI() {
        return new Promise(resolve => {
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
            this.timerBar = document.querySelector('.timer-bar');
            
            // Ensure timer is in initial state
            this.timerTextElement.style.display = 'flex';
            this.timerTextElement.style.transform = 'translate(0, -50px) rotate(-8deg)';
            this.timerTextElement.style.scale = "1";
            this.timerTextElement.style.backgroundColor = "#FF00B5";
            this.timerTextElement.style.bottom = "36px";
            this.timerTextElement.classList.remove('finished');
            this.timerTextElement.textContent = `${this.timerDuration/1000}s`;
            this.timerBar.style.height = '0px';
            
            // Force a reflow
            void this.timerTextElement.offsetHeight;
            void this.timerBar.offsetHeight;
            
            resolve();
        });
    }

    setupEventListeners() {
        // Add click event to the card container
        this.cardContainer.addEventListener('mousedown', () => this.flipCard());
        
        // Navigation button
        document.querySelector('.shuffle-button').addEventListener('mousedown', () => this.pickRandomQuestion());
    }

    startTimer() {
        // Ensure any existing animations are cleared
        if (this.timerInterval) {
            cancelAnimationFrame(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.completionTimeout) {
            clearTimeout(this.completionTimeout);
            this.completionTimeout = null;
        }
        
        // Kill any existing GSAP animations
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf([this.timerTextElement, this.timerBar]);
        }

        // Reset timer elements to initial state
        this.timerTextElement.classList.remove('finished');
        this.timerTextElement.style.display = 'flex';
        this.timerTextElement.style.transform = 'translate(0, -50px) rotate(-8deg)';
        this.timerTextElement.style.scale = "1";
        this.timerTextElement.style.backgroundColor = "#FF00B5";
        this.timerTextElement.style.bottom = "36px";
        this.timerTextElement.textContent = `${this.timerDuration/1000}s`;
        this.timerBar.style.height = '0px';

        // Force a reflow
        void this.timerTextElement.offsetHeight;
        void this.timerBar.offsetHeight;

        // Start the timer after a short delay
        setTimeout(() => {
            const startTime = Date.now();
            const updateTimer = () => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(Math.ceil((this.timerDuration - elapsed) / 1000), 0);
                const progress = Math.min((elapsed / this.timerDuration) * 100, 100);
                
                // Update timer bar height
                this.timerBar.style.height = `${progress * 1.91}px`;
                
                // Update text position
                const currentPosition = -200 * (progress / 100);
                this.timerTextElement.style.transform = `translate(0, ${currentPosition}px) rotate(-8deg)`;
                
                if (remaining > 0) {
                    this.timerTextElement.textContent = `${remaining}s`;
                    this.timerInterval = requestAnimationFrame(updateTimer);
                } else {
                    this.timerTextElement.textContent = '🔥';
                    this.timerTextElement.classList.add('finished');
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.timeline()
                            .to(this.timerTextElement, {
                                scale: 0.8,
                                rotation: -15,
                                y: -224,
                                duration: 0.15,
                                ease: "power2.in"
                            })
                            .to(this.timerTextElement, {
                                scale: 2,
                                rotation: -8,
                                duration: 0.8,
                                ease: "elastic.out(1.15, 0.2)",
                                backgroundColor: "#FFB803",
                                onComplete: () => {
                                    gsap.to(this.timerTextElement, {
                                        scale: 1.5,
                                        rotation: -15,
                                        duration: 0.5,
                                        repeat: -1,
                                        yoyo: true
                                    });
                                }
                            });
                    }
                }
            };

            this.timerInterval = requestAnimationFrame(updateTimer);
        }, 50);
    }

    loadQuestion() {
        // Reset and start timer only after a short delay to ensure DOM updates
        setTimeout(() => {
            this.resetTimerText();
            this.startTimer();
        }, 50);
        
        const question = this.allQuestions[this.currentQuestionIndex];
        
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
