var messages = ["😀","😅","🤩","😜","🤪","🤐","🥵","🤯","🤠","🧐","🥺","😱","🤓","😎","🥳","🥴","😏"];


var tv = new TimelineMax({

});

tv.fromTo(".main-wrapper", 0.35, {scale:1.5,opacity:0, ease:Power2.easeOuteaseOut}, {scale:1,opacity:1},0.2);

var tl = new TimelineMax({
	onComplete: function() {
        this.restart().invalidate(); //restarts and forces it to re-record starting/ending values
    }
});

var tt = new TimelineMax({
	onComplete: function() {
		this.restart();
	}
});



function getRandomValueFromArray(a) {
	return a[Math.floor( Math.random() * a.length )];
}
tl.set(["#message1","#message2"], { text: function() {return getRandomValueFromArray(messages); } });
tt.staggerFrom(["#message1","#message2"], 2, {y:50,opacity:0, ease: Elastic.easeOut.config(1.2, 0.5)}, 0.2);
tl.to(["#message1","#message2"], 2.2, {  });


// function goToGame(){
// 	window.location.href = "home.html";
// }

// document.getElementById('start-button').addEventListener('click', function(e){ //say this is an anchor
//          //do something
//         e.preventDefault();
//         // tv.reverse();
//         tv.staggerTo(".main-wrapper", 0.3, {opacity:0, scale:1.5, ease:Back.easeIn, onComplete: function(){ goToGame();} }, 0.3);
//    });





