



/*
spec = {
	src:   ,
	size:   ,
	center: {x: , y: },
	size: {height: , width: }
}
*/

MyGame.objects.texture = function(spec) {
	'use strict';

	let imageReady = false;
	let image = new Image();

	image.onload = function() {
		imageReady = true;
	}

	image.src = spec.src;

	let api = {
		get imageReady() { return imageReady; },
		get image() { return image; },
		get size() {return spec.size; }
	}

	return api;
}