//Initialisation des variables 
const placeHolder = "salut"
var isDisplayed = false;
var btnClose = document.querySelector('.display-answer');
var cardFront = document.querySelector('.front');
var cardBack = document.querySelector('.back');


//On créé une casse MovieCounter avec un certain nombre de fonctions
class MovieCounter {
	constructor() {
		this.counter = -1 //On met -1 car comme ça dès qu'on fera "next, on obtiendra 0, on affichera donc le film [0], qui est Titanic. (car à chaque fois que NEXT est joué, on augmente le counter de 1)
		console.log({counter:this.counter})
	} 
	next() { //cette fonction permet d'incrémenter le counter de 1 à chaque fois qu'on va exécuter nextMovie() (voir plus bas). Si on dépasse la taille max de l'array, on revient au début
	if (this.counter === (movieCatalog.length-1)) {
		this.counter = 0
	} else {
		this.counter++
	}
}
back() {
	if (this.counter === 0) {
		this.counter = 0
	} else {
		this.counter--
	}
}
currentEmoji(){
	return movieCatalog[this.counter].emoji
}
currentTitle(){
	if(this.counter===-1){
		return placeHolder
	}
	return movieCatalog[this.counter].title
}
currentProgress(){
	return this.counter+1
}
}	

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

