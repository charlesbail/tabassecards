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
        // Ensure loading class is present at start
        document.documentElement.classList.add('loading');
        document.body.classList.add('loading');

        this.allQuestions = [...questions];
        this.currentQuestionIndex = 0;
        this.timerBasePosition = 40;
        this.timerDuration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--timer-duration')) * 1000;
        this.timerInterval = null;
        this.completionTimeout = null;
        this.isFlipped = false;
        this.thermoSvg = null;
        this.thermoBar = null;

        // Handle viewport height
        this.handleViewportHeight();
        window.addEventListener('resize', () => this.handleViewportHeight());
        window.addEventListener('orientationchange', () => this.handleViewportHeight());

        // Start preloading
        Promise.all([
            this.loadFonts(),
            this.preloadImages(),
            new Promise(resolve => setTimeout(resolve, 800)) // Minimum display time for loader
        ]).then(() => {
            // Initialize UI elements
            this.initializeUI();
            this.setupEventListeners();

            // Set initial transforms
            gsap.set(this.cardBack, { rotationY: 180 });

            // Load the first question
            this.loadQuestion();

            // Remove loading class with a slight delay to ensure smooth transition
            setTimeout(() => {
                document.documentElement.classList.remove('loading');
                document.body.classList.remove('loading');
            }, 100);
        });
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
        this.timerTextElement.style.transform = 'translate(-9px, -50px) rotate(-8deg)';
        this.timerTextElement.style.scale = "1";
        this.timerTextElement.style.backgroundColor = "#FF00B5";
        this.timerTextElement.style.bottom = "36px";
        this.timerTextElement.textContent = `${this.timerDuration/1000}s`;
        this.timerBar.style.height = '0px';
        
        // Force a reflow to ensure styles are applied
        void this.timerTextElement.offsetHeight;
        void this.timerBar.offsetHeight;
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
        
        // Reset timer text and start
        this.resetTimerText();
        this.startTimer();
    }

    setupEventListeners() {
        // Add click event to the card container
        this.cardContainer.addEventListener('mousedown', () => this.flipCard());
        
        // Navigation button
        document.querySelector('.shuffle-button').addEventListener('mousedown', () => this.pickRandomQuestion());
    }

    startTimer() {
        // Clear any existing timers and animations
        if (this.timerInterval) {
            cancelAnimationFrame(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.completionTimeout) {
            clearTimeout(this.completionTimeout);
            this.completionTimeout = null;
        }
        gsap.killTweensOf([this.timerTextElement, this.timerBar]);

        // Reset timer text
        this.resetTimerText();

        const startTime = Date.now();
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(Math.ceil((this.timerDuration - elapsed) / 1000), 0);
            const progress = Math.min((elapsed / this.timerDuration) * 100, 100);
            
            // Simplified positioning using a single range
            const START_POSITION = 0;
            const TRAVEL_DISTANCE = -200;
            const currentPosition = START_POSITION + (TRAVEL_DISTANCE * (progress / 100));
            
            // Update timer bar height
            this.timerBar.style.height = `${progress * 1.91}px`;
            
            // Update text position with simplified calculation
            this.timerTextElement.style.transform = `translate(-9px, ${currentPosition}px) rotate(-8deg)`;
            
            if (remaining > 0) {
                this.timerTextElement.textContent = `${remaining}s`;
                this.timerInterval = requestAnimationFrame(updateTimer);
            } else {
                // Wait for the text to reach final position before starting animation
                const finalY = START_POSITION + TRAVEL_DISTANCE;
                this.timerTextElement.style.transform = `translate(-9px, ${finalY}px) rotate(-8deg)`;
                
                // Store the timeout reference so we can clear it if needed
                this.completionTimeout = setTimeout(() => {
                    if (!this.completionTimeout) return; // Exit if cleared
                    this.timerTextElement.textContent = '🔥';
                    this.timerTextElement.classList.add('finished');
                    
                    // Initial pop animation
                    gsap.timeline()
                        .to(this.timerTextElement, {
                            scale: 0.8,
                            rotation: -15,
                            y: finalY - 24,
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
                                // Start the looping animation
                                gsap.from(this.timerTextElement, {
                                    scale: 2,
                                    rotation: -8,
                                    duration: 0
                                });
                                
                                gsap.timeline({
                                    repeat: -1,
                                    defaults: {
                                        
                                    }
                                })

                                .to(this.timerTextElement, {
                                    scale: 1.5,
                                    rotation: -15,
                                    duration: 0.5
                                });
                            }
                        });
                }, 100);
            }
        };

        this.timerInterval = requestAnimationFrame(updateTimer);
    }

    loadQuestion() {
        // Clear any existing timers and animations
        if (this.timerInterval) {
            cancelAnimationFrame(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.completionTimeout) {
            clearTimeout(this.completionTimeout);
            this.completionTimeout = null;
        }
        gsap.killTweensOf([this.timerTextElement, this.timerBar]);

        // Reset timer text and start new timer
        this.resetTimerText();
        this.startTimer();
        
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
