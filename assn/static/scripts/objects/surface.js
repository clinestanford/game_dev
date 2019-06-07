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
MyGame.objects.surface = function(spec) {
	'use strict';

	let cwidth = spec.cwidth;
	let cheight = spec.cheight;
	let mysurface = spec.surface;

	//set up functions for each of the x's to determine if it is currently save.

	

	function isSafe(x, y, size) {
		if(x < 0){
			return false;
		}
		if(x <= .25) {
			let m = 1;
			let allowy = m * x - m * .25 + .25;
			if(y - size.height/2 > allowy	){
				return true;
			} else {
				return false;
			}
		}else if(x <= .4) {
			let m = -1;
			let allowy = m * x - m * .25 + .25;
			if(y - size.height/2 > allowy	){
				return true;
			} else {
				return false;
			}
		}else if(x <= .7) {
			let m = 0;
			let allowy = m * x - m * .4 + .1;
			if(y - size.height/2 > allowy	){
				return true;
			} else {
				return false;
			}
		}else if(x <= .8) {
			let m = 3.5;
			let allowy = m * x - m * .8 + .45;
			if(y - size.height/2 > allowy	){
				return true;
			} else {
				return false;
			}
		}else if(x <= 1) {
			let m = -2.25;
			let allowy = m * x - m * 1 + 0;
			if(y - size.height/2 > allowy	){
				return true;
			} else {
				return false;
			}
		}
		return false;
	}

	function safeRegion(x) {
		if(x >= .4 && x <= .7){
			return true;
		} else {
			return false;
		}
	}
	
	return {
		get surface() {return mysurface;},
		isSafe: isSafe,
		safeRegion: safeRegion,
		get fillStyle() {return spec.fillStyle},
	}
}