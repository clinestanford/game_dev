/*
text = {
	lives: ,
	position: {x: , y: },
	size: {width: , height: }
}
*/
MyGame.objects.livesManager = function(spec) {
	'use strict';
	let image = new Image();
	let isReady = false;
	image.onload = function () {
		isReady = true;
	}
	image.src = spec.src;


	function loseLife() {
		spec.lives -= 1;
	}	

	function gainLife() {
		if(spec.lives < spec.maxLives) {
			spec.lives += 1;
		}
	}

	return {
		gainLife: gainLife,
		loseLife: loseLife,
		get image() {return image;},
		get ready() {return isReady;},
		get lives() {return spec.lives;},
		get size() {return spec.size},
		get position() {return spec.position;},	
	}
}