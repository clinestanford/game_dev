
/*
spec = {
	range: {min: , max: },
	src: 'assets/animatedShip.png',
	center: {x: 0, y: 0},
	size: {width: 30, height: 50},
	rotation: 0,
	rotatePerTurn: 10,
	momentum: {x: 0, y: 0},
	movePerTurn: 5,
	cwidth: graphics.canvas.width,
	cheight: graphics.canvas.height,
	millisPerFrame: 160,
	fireRate: 330,
	timeToNextFire: 0,
	fire: funciont(),
	curFrame: 0,
	numFrame: 4,
	frameWidth: 48,
	frameHeight: 80,
	momentumCap: 400,
}

*/


MyGame.objects.ufo = function(spec) {
	'use strict';

	let alive = 0;
	let isAlive = false;
	let minVal = spec.range.min;
	let maxVal = spec.range.max;

	let currentFrameTime = 0;
	let dead = false;
	let timeToRespawn = 0;
	let ufoSpawningTime = spec.waitTime;
	let timeToNextUfo = ufoSpawningTime;

	let image = new Image();
	let isReady = false;
	image.onload = () => {
		isReady = true;
	}
	image.src = spec.src;

	function nextRange(min, max) {
		let range = max - min;
		return Math.random() * range;
	}

	function nextRandomCentered(val) {
		let range = val * 2;
		return Math.random() * range - val;
	}

	function getDirection() {
		if(spec.type === 'lrg') {
			return Random.nextCircleVector();
		} else {
			let dx = spec.sprite.center.x - spec.center.x;
			let dy = spec.sprite.center.y - spec.center.y;
			let sum = Math.abs(dx) + Math.abs(dy);
			return {x: dx/sum, y: dy/sum};
		}
	}

	function update(elapsedTime) {

		if(isAlive){
			//governor for the momentums
			if(spec.momentum.x > spec.momentumCap){spec.momentum.x = spec.momentumCap;}
			if(spec.momentum.x < -1 * spec.momentumCap){spec.momentum.x = -1 * spec.momentumCap;}
			if(spec.momentum.y > spec.momentumCap){spec.momentum.y = spec.momentumCap;}
			if(spec.momentum.y < -1 * spec.momentumCap){spec.momentum.y = -1 * spec.momentumCap;}

			// if(alive % 5 == 0){
			// 	spec.momentum.x += nextRandomCentered(minVal, maxVal);
			// 	spec.momentum.y += nextRandomCentered(minVal, maxVal);
			// 	spec.rotation += nextRandomCentered(spec.rotating);
			// }
			// alive++;

			spec.rotation += spec.rotatePerTurn * (elapsedTime / 1000);
			spec.timeToNextFire -= elapsedTime;

			if(spec.timeToNextFire < 0) {
				spec.timeToNextFire = spec.fireRate - spec.timeToNextFire;
				spec.fire(spec.center, getDirection());
				spec.sound();
			}
			//keep the sprite on the canvas
			spec.center.x += (elapsedTime / 1000) * spec.momentum.x;
			spec.center.y += (elapsedTime / 1000) * spec.momentum.y;
			if(spec.center.x < 0) {
				spec.center.x = spec.cwidth - spec.center.x;
			} else if (spec.center.x > spec.cwidth) {
				spec.center.x %= spec.cwidth;
			}
			if(spec.center.y < 0) {
				spec.center.y = spec.cheight - spec.center.y;
			} else if(spec.center.y > spec.cheight) {
				spec.center.y %= spec.cheight;
			}

			//everything to handle updating sprite image
			if(isNaN(currentFrameTime)){
				currentFrameTime = 0;
			}
			currentFrameTime += elapsedTime;
			if (currentFrameTime > spec.millisPerFrame) {
				currentFrameTime = currentFrameTime - spec.millisPerFrame;
				spec.curFrame++;
				spec.curFrame %= spec.numFrame;
			}
		} else {
			//if the ship currently is dead;
			if(!isNaN(elapsedTime)){
				timeToNextUfo -= (elapsedTime / 1000);
			}
			//check if we need to spawn a new one
			if(timeToNextUfo < 0){
				//make sure the ship is currently dead
				if(spec.center.x === undefined) {
				let side = Random.nextRange(0,4);
					if(side === 0){
						spec.center.x = 0;
						spec.center.y = Random.nextRange(0, spec.cheight);
					} else if(side === 1){
						spec.center.x = spec.cwidth;
						spec.center.y = Random.nextRange(0, spec.cheight);
					} else if(side === 2){
						spec.center.x = Random.nextRange(0, spec.cwidth);
						spec.center.y = 0;
					} else if(side === 3){
						spec.center.x = Random.nextRange(0, spec.cwidth);
						spec.center.y = spec.cheight;
					}
				}
				isAlive = true;
				spec.timeToNextFire = spec.fireRate;
				let randDir = Random.nextCircleVector();
				spec.momentum.x = randDir.x * 200;
				spec.momentum.y = randDir.y * 200;
				spec.rotatePerTurn = Random.nextDouble() * 3;
			}
		}
	}

	function killUfo() {
		isAlive = false;
		timeToNextUfo = ufoSpawningTime;
		spec.center.x = undefined;
		spec.center.y = undefined;
	}

	function setType(type) {
		spec.type = type;
	}

	return {
		get isAlive() {return isAlive;},
		get image() {return image},
		get ready() {return isReady;},
		get center() {return spec.center;},
		get size() {return spec.size;},
		get rotation() {return spec.rotation;},
		get curFrame() {return spec.curFrame;},
		get frameWidth() {return spec.frameWidth;},
		get frameHeight() {return spec.frameHeight;},
		get type() {return spec.type;},
		get dims() {return spec.dims;},
		get sheetHeight() {return spec.sheetHeight;},
		get lvlInPng() {return spec.lvlInPng;},
		setType: setType,
		update: update,
		killUfo: killUfo,
	}
}