/*
text = {
	rotation: ,
	position: {x: , y: },
	text: "",
	font: ,
	fillStyle: ,
	strokeStyle: ,
}
*/
MyGame.objects.text = function(spec) {
	'use strict';

	let rotation = 0; 

	function setText(text) {
		spec.text = "" + text;
	}
	
	return {
		setText: setText,
		get rotation() {return rotation;},
		get position() {return spec.position;},
		get text() {return spec.text;},
		get fillStyle() {return spec.fillStyle;},
		get strokeStyle() {return spec.strokeStyle;}
	}
}