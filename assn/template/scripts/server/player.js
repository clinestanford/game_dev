
'use strict';

let random = require('./random');

function createPlayer() {

	console.log('creating a new player');
	let width = 8;
	let height = 4;
	let lastUpdateDiff = 0;

	let that = {};

	let momentum = {
		x: 0,
		y: 0
	}

	//this really should be a constant for the entire project
	let mapSize = {
		width: 8,
		height: 4
	};

	that.position = {
		x: 0, //(random.nextDouble() * (width-1)) + .5, //may need to multiply by width to get values within the range of the page
		y: 0  //(random.nextDouble() * (height-1)) + .5
	};

	let size = {
		width: .0185,
		height: .07
	};

	let shield = false;
	let unshieldTime = 10000;
	let shieldLeft = 0;
	let doubleShot = false;
	let missiles = false;

	let direction = random.nextDouble() * 2 * Math.PI;
	let rotateRate = Math.PI / 1000;
	let speed = .00001;
	let reportUpdate = false;

	Object.defineProperty(that, 'direction', {
		get: () => direction
	});

	Object.defineProperty(that, 'rotateRate', {
		get: () => rotateRate
	});

	Object.defineProperty(that, 'speed', {
		get: () => speed
	});

	Object.defineProperty(that, 'size', {
		get: () => size
	})

	Object.defineProperty(that, 'reportUpdate', {
		get: () => reportUpdate,
		set: value => reportUpdate = value
	});

	Object.defineProperty(that, 'momentum', {
		get: () => momentum
	});

	Object.defineProperty(that, 'shield', {
		get: () => shield,
		set: val => shield = val
	});

	Object.defineProperty(that, 'doubleShot', {
		get: () => doubleShot,
		set: val => doubleShot = val
	});

	Object.defineProperty(that, 'missiles', {
		get: () => missiles,
		set: val => missiles = val
	});

	that.shieldReset = function(){
		shieldLeft = unshieldTime;
		shield = true;
	}

	that.move = function(elapsedTime, updateDiff) {
		lastUpdateDiff += updateDiff;
		that.update(updateDiff, true);
		reportUpdate = true;
		let vectorX = Math.sin(direction);
		let vectorY = Math.cos(direction);

		that.momentum.x += (vectorX * speed);
		that.momentum.y -= (vectorY * speed);
	};

	that.rotateRight = function(elapsedTime) {
		reportUpdate = true;
		direction += elapsedTime * rotateRate;
	};

	that.rotateLeft = function(elapsedTime) {
		reportUpdate = true;
		direction -= elapsedTime * rotateRate;
	};

	that.getSafeLocation = function(asteroids) {

		momentum.x = 0;
		momentum.y = 0;

		let maxDistance = 0;
		let newCenter = {x: 0, y: 0};
		let x = 0;
		let y = 0;

		for(let i = 1; i < mapSize.width; ++i) {
			for(let j = 1; j < mapSize.height; ++j) {
				let curDist = 0;
				for(let asteroidId in asteroids){
					let curAst = asteroids[asteroidId];
					curDist += Math.sqrt((curAst.position.x - i) ** 2 + (curAst.position.y - j) ** 2);
				};
				if(curDist > maxDistance) {
					maxDistance = curDist;
					newCenter.x = i;
					newCenter.y = j;
				}
			}
		} 

		that.position.x = newCenter.x;
		that.position.y = newCenter.y;

		return newCenter;
	}

	that.update = function(elapsedTime, intraUpdate) {

		if(intraUpdate){
			reportUpdate = true;
		} else{
			elapsedTime -= lastUpdateDiff;
			lastUpdateDiff = 0;
		}

		if(elapsedTime){
			that.position.x += momentum.x * elapsedTime;
			that.position.y += momentum.y * elapsedTime;
		}

		if(shield){
			shieldLeft -= elapsedTime;
			if(shieldLeft < 0){
				shield = false;
			}
		}
	}

	return that;
}

module.exports.create = () => createPlayer();