


MyGame.components.Player = function() {
	'use strict';

	let that = {}
	let position = {
		x: 0,
		y: 0
	};

	let momentum = {
		x: 0,
		y: 0
	}

	let size = {
		width: 0.0185,
		height: 0.07
	};

	let direction = 0;
	let rotateRate = 0;
	let speed = 0.00001;

	let shield = false;
	let unshieldTime = 10000;
	let shieldLeft = 0;
	let doubleShot = false;
	let missiles = false;

	Object.defineProperty(that, 'direction', {
		get: () => {return direction;},
		set: val => {direction = val;}
	});

	Object.defineProperty(that, 'shield', {
		get: () => {return shield;},
		set: val => {shield = val;}
	});

	Object.defineProperty(that, 'doubleShot', {
		get: () => {return doubleShot;},
		set: val => {doubleShot = val;}
	});

	Object.defineProperty(that, 'missiles', {
		get: () => {return missiles;},
		set: val => {missiles = val;}
	});

	Object.defineProperty(that, 'momentum', {
		get: () => momentum
	});

	Object.defineProperty(that, 'rotateRate', {
		get: () => {return rotateRate},
		set: val => {rotateRate = val;}
	});

	Object.defineProperty(that, 'position', {
		get: () => position,
	});

	Object.defineProperty(that, 'size', {
		get: () => size,
	});

	that.resetShield = function() {
		shieldLeft = unshieldTime;
		shield = true;
	}

	that.move = function(elapsedTime) {
		let vectorX = Math.sin(direction);
		let vectorY = Math.cos(direction);

		momentum.x += (vectorX  * speed);
		momentum.y -= (vectorY * speed);
	}

	that.rotateRight = function(elapsedTime) {
		direction += (elapsedTime * rotateRate);
	}

	that.rotateLeft = function(elapsedTime) {
		direction -= (elapsedTime * rotateRate);
	}

	that.update = function(elapsedTime, socketMessenger) {
		//console.log(that.position);
		//socketMessenger(elapsedTime);
		that.position.x += that.momentum.x * elapsedTime;
		that.position.y += that.momentum.y * elapsedTime;
		if(shield){
			shieldLeft -= elapsedTime;
			if(shieldLeft < 0){
				shield = false;
			}
		}
	}

	that.newBullet = function() {
		let center = {x: position.x, y: position.y};
		center.x += Math.sin(direction) * (size.width);
		center.y -= Math.cos(direction) * (size.height/2);
		return MyGame.components.bullet(center, {x: Math.sin(direction), y: Math.cos(direction)});
	}

	return that;
}

