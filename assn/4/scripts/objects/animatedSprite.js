

MyGame.objects.AnimatedSprite = function(spec) {
	'use strict';

	let currentFrameTime = 0;
	let dead = false;
	let timeToRespawn = 0;

	let image = new Image();
	let isReady = false;
	image.onload = () => {
		isReady = true;
	}
	image.src = spec.src;

	let everySoOften = 1;

	function moveForward(elapsedTime) {
		if(everySoOften % 5 === 0){
			spec.particles.systemManager.leaveTrail(spec.center);	
		}
		everySoOften++;
		spec.momentum.x -= Math.cos(spec.rotation + (Math.PI / 2)) * spec.movePerTurn;
		spec.momentum.y -= Math.sin(spec.rotation + (Math.PI / 2)) * spec.movePerTurn;
	}

	function turnRight() {
		spec.rotation += Math.PI / 45;
	}

	function turnLeft() {
		spec.rotation -= Math.PI / 45;
	}

	function spawnAgain() {
		dead = true;
		timeToRespawn = 2;
		spec.center.x = undefined;
		spec.center.y = undefined;
	}

	function update(elapsedTime) {

		//everything to handle location on screen
		if(!dead){
			if(isNaN(spec.center.x)){spec.center.x = spec.cwidth/2;}
			if(isNaN(spec.center.y)){spec.center.y = spec.cheight/2;}

			//governor for the momentums
			if(spec.momentum.x > spec.momentumCap){spec.momentum.x = spec.momentumCap;}
			if(spec.momentum.x < -1 * spec.momentumCap){spec.momentum.x = -1 * spec.momentumCap;}
			if(spec.momentum.y > spec.momentumCap){spec.momentum.y = spec.momentumCap;}
			if(spec.momentum.y < -1 * spec.momentumCap){spec.momentum.y = -1 * spec.momentumCap;}

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
			timeToRespawn -= (elapsedTime / 1000);
			if(timeToRespawn < 0){
				dead = false;
				let newCenter = getSafeLocation();
				spec.center.x = newCenter.x;
				spec.center.y = newCenter.y;
				spec.particles.systemManager.hyperSpaceAppear(newCenter);
			}
		}
	}

	function getSafeLocation() {
		spec.momentum.x = 0;
		spec.momentum.y = 0;

		let asteroids = spec.astObject.asteroids;
		let offset_x = (spec.cwidth / 10) / 2;
		let offset_y = (spec.cheight / 10) / 2;
		let distx = spec.cwidth / 10;
		let disty = spec.cheight / 10;
		let maxDistance = 0;
		let newCenter = {x: 0, y: 0};
		let x = 0;
		let y = 0;

		for(let i = 0; i < 10; ++i) {
			x = i * distx + offset_x;
			for(let j = 0; j < 10; ++j) {
				let curDist = 0;
				let y = j * disty + offset_y;
				Object.getOwnPropertyNames(asteroids).forEach(val => {

					let curAst = asteroids[val];

					curDist += Math.sqrt(Math.min(Math.abs(y - curAst.center.y), Math.abs(spec.cheight - (y + curAst.center.y))) ** 2 + Math.min(Math.abs(x - curAst.center.x), Math.abs(spec.cwidth - (x + curAst.center.x))) ** 2);
				});
				if(curDist > maxDistance) {
					maxDistance = curDist;
					newCenter.x = i * distx + offset_x;
					newCenter.y = j * disty + offset_y;
				}
			}
		} 

		return newCenter;
	}

	function jumpHyperSpace(hyperBar) {
		if(hyperBar.reset()) {

			spec.particles.systemManager.hyperSpaceJump(spec.center);
			dead = true;
			timeToRespawn = .5;
			spec.center.x = undefined;
			spec.center.y = undefined;
		}
	}


	return {
		jumpHyperSpace: jumpHyperSpace,
		spawnAgain: spawnAgain,
		getSafeLocation: getSafeLocation,
		get image() {return image},
		get ready() {return isReady;},
		get center() {return spec.center;},
		get size() {return spec.size;},
		get rotation() {return spec.rotation;},
		get curFrame() {return spec.curFrame;},
		get frameWidth() {return spec.frameWidth},
		get frameHeight() {return spec.frameHeight},
		get momentum() {return spec.momentum},
		moveForward: moveForward,
		turnRight: turnRight,
		turnLeft: turnLeft,
		update: update
	}
}