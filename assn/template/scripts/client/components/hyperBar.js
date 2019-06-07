/*
text = {
	position: {x: , y: },
	fillStyle: ,
	strokeStyle: ,
	percentPerSecond: ,
	associatedText: ,
	width: ,
}
*/

MyGame.components.hyperBar = function(spec) {
	'use strict';

	let rotation = 0;
	let fill = 1;

	function update(elapsedTime) {
		elapsedTime = elapsedTime/1000;
		if(!isNaN(elapsedTime && fill < 1)){
			fill += elapsedTime * spec.percentPerSecond;
		}
		if(fill > 1) {
			fill = 1;
		}
	}

	function reset() {
		if(fill === 1) {
			fill = 0;
			return true;	
		}
		return false;
	}
	
	return {
		update: update,
		reset: reset,
		get size() {return spec.size;},
		get offset_y() {return spec.offset_y;},
		get associatedText() {return spec.associatedText;},
		get rotation() {return rotation;},
		get fillPercentage() {return fill;},
		get position() {return spec.position;},
		get fillStyle() {return spec.fillStyle;},
		get strokeStyle() {return spec.strokeStyle;}
	}
}