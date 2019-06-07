

MyGame.objects.lunarLander = function(spec) {
	'use strict';

	spec.momentum = {x: 0, y: 0};

	let GRAVITY = 0.000000025;

	let image = new Image();
	let isReady = false;
	image.onload = () => {
		isReady = true;
	}
	image.src = spec.src;

	let alive = true;
	let stop = false;

	let mySize = {
		width: spec.size.width * spec.cwidth,
		height: spec.size.height * spec.cheight
	}

	function turnRight(elapsedTime) {
		spec.rotation += spec.rotateRate * elapsedTime * 3;
		spec.angleText(Math.floor((spec.rotation * 180 / Math.PI)%360));
	}

	function turnLeft(elapsedTime) {
		spec.rotation -= spec.rotateRate * elapsedTime * 3;
		spec.angleText(Math.floor((spec.rotation * 180 / Math.PI)%360));
	}

	function thrust(elapsedTime) {
		if(spec.fuel > 0){
			spec.onThrust(spec.center, spec.rotation, mySize);
			spec.momentum.x += Math.sin(spec.rotation) * spec.thrustRate * elapsedTime;
			spec.momentum.y += Math.cos(spec.rotation) * spec.thrustRate * elapsedTime;
			spec.fuel -= elapsedTime;
			spec.fuelText(Math.floor(spec.fuel / 1000));
		}
	}

	function update(elapsedTime) {
		let angle = (spec.rotation * (180 / Math.PI)) % 360;
		if(!stop){
			let speed = Math.sqrt((elapsedTime * 1000 * spec.momentum.x) ** 2 + (elapsedTime * 1000 * spec.momentum.y) ** 2) * elapsedTime;
			speed = Math.floor(speed);
			if(speed > 3){
				spec.setColor('rgba(255,255,255,1)')
			} else {
				spec.setColor('rgba(0,255,0,1)')
			}
			if(spec.isSafe(spec.center.x, spec.center.y, spec.size)){
				spec.momentum.y -= GRAVITY * elapsedTime;
				spec.center.x += spec.momentum.x * elapsedTime;
				spec.center.y += spec.momentum.y * elapsedTime;
				spec.speedText(speed);		
			} else if(spec.safeRegion(spec.center.x) && speed <= 3 && (angle > 350 || angle <= 10)){
				console.log(speed, angle);
				spec.scoreText.setText("Score: " + Math.floor(spec.fuel)/1000);
				spec.scoreText.centerText();
				spec.win();
				stop = true;
			} else {
				console.log(speed, angle);
				alive = false;
				stop = true;
				spec.onCrash(spec.center);
				spec.lose();
			}
		}
	}

	return {
		get alive() {return alive;},
		get fuel() {return spec.fuel;},
		get image() {return image},
		get ready() {return isReady;},
		get center() {return spec.center;},
		get size() {return mySize;},
		get rotation() {return spec.rotation;},
		get curFrame() {return spec.curFrame;},
		get frameWidth() {return spec.frameWidth},
		get frameHeight() {return spec.frameHeight},
		get momentum() {return spec.momentum},
		turnRight: turnRight,
		turnLeft: turnLeft,
		thrust: thrust,
		update: update
	}
}