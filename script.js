//Initialisation des variables 
const placeHolder = "salut"
var isDisplayed = false;
var btnClose = document.querySelector('.display-answer');
var cardFront = document.querySelector('.front');
var cardBack = document.querySelector('.back');

// Questions array
const questions = [
    {
        "category": "ice breaker",
        "question": "Note entre 1 à 10 à quel point les personnes actuellement autour de toi sont hot 🥵.",
        "author": "Chau Must Go On"
    },
    {
        "category": "action",
        "question": "Appelle un·e proche à qui tu penses et proposes lui un repas pimenté prochainement.",
        "author": "Chau Must Go On"
    },
    {
        "category": "culture générale",
        "question": "À quel niveau se situe le piment tabasco sur l'échelle de Scoville ?",
        "author": "Tabasse"
    },
    {
        "category": "vérité",
        "question": "Combien de temps a duré ta dernière relation en couple ?",
        "author": "Hanonymous"
    },
    {
        "category": "ice breaker",
        "question": "Si tu pouvais exaucer un souhait, ça serait quoi ?",
        "author": "Flo Chau"
    },
    {
        "category": "ice breaker",
        "question": "Si on pouvait lire dans tes pensées pendant tes moments les plus torrides, quel serait le titre du livre qu'on écrirait sur toi ? 😏📖",
        "author": "Flo GPT"
    },
    {
        "category": "ice breaker",
        "question": "Si tu pouvais avoir un supper pouvoir, mais complètement inutile, ce serait quoi ?",
        "author": "Mild Chili"
    },
    {
        "category": "vérité",
        "question": "Quelle est la dernière chose qui t'a fait rougir ?",
        "author": "Hot Chili"
    },
    {
        "category": "vérité",
        "question": "Si tu pouvais connaître une seule vérité absolue sur ta vie future, tu voudrais savoir quoi ?",
        "author": "Deep Chili"
    },
    {
        "category": "vérité",
        "question": "Tu dois révéler une chose honteuse sur toi, mais en échange tu peux poser n'importe quelle question à quelqu'un ici. Tu dis quoi ?",
        "author": "Deep Chili"
    },
    {
        "category": "vérité",
        "question": "Si tu devais choisir un de tes ex pour repartir ensemble, qui ce serait ?",
        "author": "Burning Pepper"
    },
    {
        "category": "vérité",
        "question": "Raconte une fois où tu as ghosté quelqu'un (ou où tu t'es fait ghoster).",
        "author": "Burning Pepper"
    },
    {
        "category": "vérité",
        "question": "Quel est le secret que tu n'as jamais avoué à personne ici ?",
        "author": "Burning Pepper"
    },
    {
        "category": "ice breaker",
        "question": "Si on fouillait ton historique de recherche Google, qu'est-ce qu'on y trouverait de bizarre ?",
        "author": "Inspector Pepper"
    },
    {
        "category": "vérité",
        "question": "Quelle est la dernière chose complètement débile que tu as faite sous l'effet de la fatigue ou de l'alcool ?",
        "author": "Drunken Pepper"
    },
    {
        "category": "ice breaker",
        "question": "Si un jour on te voit en une des journaux, ce sera pour quelle raison scandaleuse ?",
        "author": "Mimi Pepper"
    },
    {
        "category": "vérité",
        "question": "Si ton patron ou tes parents lisaient TOUS tes messages privés, qu'est-ce qui te mettrait le plus dans la merde ?",
        "author": "Inspector Pepper"
    },
    {
        "category": "action",
        "question": "Fais une pub de 30 secondes pour vendre un objet au hasard sur la table.",
        "author": "SalesRep Pepper"
    },
    {
        "category": "vérité",
        "question": "Ton dernier Guilty Pleasure / Plaisir Coupable ?",
        "author": "Chaud Evan"
    },
    {
        "category": "vérité",
        "question": "Quelle est la première personne à qui tu penses quand tu te lèves le matin ?",
        "author": "Martin Matin"
    },
    {
        "category": "action",
        "question": "Offre un verre à la première personne à qui tu penses qui est dans le restaurant.",
        "author": "Have you met me?"
    },
    {
        "category": "vérité",
        "question": "Jusqu'où tu irais pour l'argent ?",
        "author": "Sacha"
    },
    {
        "category": "vérité",
        "question": "Quel est ton meilleur fou rire?",
        "author": "Juju"
    },
    {
        "category": "culture générale",
        "question": "Quel âge a Brat Pitt ?\n\n- Né en 1963, soit 61 ans en 2025.",
        "author": "Juju"
    },
    {
        "category": "vérité",
        "question": "Quel est ton job de rêve ?",
        "author": "Juju"
    },
    {
        "category": "vérité",
        "question": "Quel est le job le plus sexy à ton sens ?",
        "author": "Juju"
    },
    {
        "category": "culture générale",
        "question": "Quel est le plus HOT endroit sur terre ? (t'es un.e beauf si tu réponds \"mon lit\"...)\n———\n La Vallée de la Mort, Californie (93,9°C le 15/07/72) ",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Qui est la tête d'affiche du film \"Some Like It Hot\" ?\n———\n Marilyn Monroe",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "De quel film avec Tom Cruise s'inspire la parodie américaine \"Hot Shots 1\" ?\n——\n Top Gun",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Dans le hit de 2004 \"Drop It Like It's Hot\", avec qui Snoop Dogg fait-il un duo ?\n———\n Pharrell Williams",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "De quelle année date le tout premier épisode de Hot Ones (version originale) ?\n———\n  2015",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Que désigne le mot \"Calorifère\" au Québec ?\n———\n Radiateur (Ra-dzia-taeur)",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Qui chante \"Hot Stuff\" ?\n———\n Donna Summer",
        "author": "Tabasse"
    },
    {
        "category": "culture générale",
        "question": "Que fait Brassens quand il pense à Fernande ?\n———\n Il bande !",
        "author": "Tabasse"
    }
];

// Game class
class Game {
    constructor() {
        this.allQuestions = [...questions];
        this.currentQuestionIndex = 0;
        this.timerDuration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--timer-duration')) * 1000;
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
        this.timerTextElement.style.transform = 'translate(-9px, -50px) rotate(-8deg)';
        this.timerTextElement.style.background = '#FF00B5';
        this.timerTextElement.textContent = `${this.timerDuration/1000}s`;

        timerBar.offsetHeight;
        this.timerTextElement.offsetHeight;

        const startTime = Date.now();
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(Math.ceil((this.timerDuration - elapsed) / 1000), 0);
            const progress = Math.min((elapsed / this.timerDuration) * 100, 100);
            
            const endY = 204 - ((204 - 17) * (progress / 100));
            timerBar.setAttribute('d', `M31 204C31 206.209 32.7909 208 35 208V208C37.2091 208 39 206.209 39 204V${endY}H31V204Z`);
            
            const textPosition = -50 - ((204 - endY) *0.8);
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
        this.timerTextElement.style.transform = 'translate(-9px, -50px) rotate(-8deg)';
        this.timerTextElement.style.background = '#FF00B5';
        this.timerTextElement.textContent = `${this.timerDuration/1000}s`;
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

//Début de la gestion de l'animation avec la library GSAP
var emojiAppear = new TimelineMax();
// var loadCard = new TimelineMax();

//On instancie notre objet
const movieCounter = new MovieCounter();


function animRefresh(){

	createSplitEmojis(movieCounter.currentEmoji()); //voir fonction createSPlitEmojis() à la fin
	//Début de la gestion de l'animation avec la library GSAP
	emojiAppear.clear(); // permet de spammer l'anim

	emojiAppear
	.fromTo(".container", 0.1, {scale:1, opacity:1, y:0}, {y:40,scale:0.8, opacity:0.8, ease:Power3.easeOuteaseOut})  
	.to(".container", 0.1, {scale:1,opacity:1,y:0,ease:Power3.easeOuteaseOut})  
	.staggerFrom(".emoji-box", 0.5,{y:100, scale: 0.8, opacity: 0, ease: Elastic.easeOut.config(1.2, 0.8), delay:0}, 0.10)
	// fin de GSAP
	//mise à jour des emojis et du titre
	setTimeout(function() {
		document.getElementById("block-title").innerHTML = movieCounter.currentTitle();
		
	  //mise à jour du titre avec délai pour pas qu'il ne s'affiche au flip de la card
	}, 100);
	
	if(isDisplayed === true){
		toggleAnswer();
	}
	move();
}

function nextMovie(){
	movieCounter.next()
	animRefresh();
	
}

function backMovie(){
	movieCounter.back()
	animRefresh();
	
}

function toggleAnswer(){
	console.log("je suis" + isDisplayed);
	isDisplayed = !isDisplayed;
	console.log("je suis" + isDisplayed);
	cardFront.classList.toggle("front-isflipped");
	cardBack.classList.toggle("back-isflipped");
	btnClose.classList.toggle("button-close");
}

//Fonction pour gérer les emojis individuellement (sinon ils apparaitraient tous en même temps donc pas d'anim individuelle)
//quand j'exécute la fonction, je dois lui passer un paramètre. Dans nextMovie() j'exécute la fonction en passant le paramètre movieCounter.currentEmoji() ce qui donne createSplitEmojis(movieCounter.currentEmoji())
function createSplitEmojis(emo){
	var str = '<div id="allEmojis">'

emo.forEach(function(emo) { //forEach = pour chacun des items de l'array d'emojis, j'exécute une fonction anonyme en passant de nouveau un paramètre
	str += '<div class="emoji-box">'+ emo + '</div>'; 
}); 

str += '</div>';
document.getElementById("block-emoji").innerHTML = str;}

//Fonction pour avoir une progress bar (l'ancienne progress bar est maintenant un progress counter)
function move() {
	var elem = document.getElementById("progressBar");
	elem.style.width = (((movieCounter.currentProgress())/(movieCatalog.length))*100) + "%";
  document.getElementById("progress-counter").innerHTML = (movieCounter.currentProgress()) + "/" + (movieCatalog.length); //mise à jour Progress counter
  document.getElementById("front-nb").innerHTML = movieCounter.currentProgress();
  document.getElementById("back-nb").innerHTML = movieCounter.currentProgress();
}

// createSplitEmojis(movieCounter.currentEmoji());
nextMovie();

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// document.getElementById("progress-counter").innerHTML = (movieCounter.currentProgress()) + "/" + (movieCatalog.length);
// document.getElementById("block-title").innerHTML = movieCounter.currentTitle();

