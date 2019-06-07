
random = require('./random');
present = require('present');

function createUfo(ufoFire) {
	'use strict';

	let that = {};

	let mapSize = {
		width: 8,
		height: 4
	};

	let totalRunningTime = 0;
	let timeToSmartUFO = 20000;

	let timeToNextFire = random.nextGaussian(5000, 1000);

	let alive = true;
	let timeInbetweenUFOs = 20000;
	let timeToNext = 0;

	let size = {
		lrg: {
			width: .0324,
			height: .07
		},
		sml: {
			width: .0232,
			height: .05
		}
	}

	let position = {
		x: 0,
		y: 0
	};

	let rotateRateDist = {
		mean: .0005,
		stdev: .00015
	}

	let rotateRate = random.nextGaussian(rotateRateDist.mean, rotateRateDist.stdev);

	//the speed Distributions for the asteroids
	//will be multiplied depending on the type
	let speedDist = {
		mean: .0001,
		stdev: .00005
	}

	let type = 'lrg';

	let randomDir = random.nextCircleVector(1);

	let direction = {
		x: randomDir.x,
		y: randomDir.y
	};

	let speed = random.nextGaussian(speedDist.mean, speedDist.stdev);

	Object.defineProperty(that, 'speed', {
		get: () => speed
	});

	Object.defineProperty(that, 'timeInbetweenUFOs', {
		get: () => timeInbetweenUFOs
	});

	Object.defineProperty(that, 'timeToNext', {
		get: () => timeToNext,
		set: val => timeToNext = val
	});

	Object.defineProperty(that, 'alive', {
		get: () => alive,
		set: val => alive = val
	});

	Object.defineProperty(that, 'rotateRate', {
		get: () => rotateRate
	});

	Object.defineProperty(that, 'size', {
		get: () => size
	});

	Object.defineProperty(that, 'position', {
		get: () => position
	});

	Object.defineProperty(that, 'direction', {
		get: () => direction
	});

	Object.defineProperty(that, 'type', {
		get: () => type
	});

	that.resetUfo = function(){
		timeToNext = 0;
	}

	that.update = function(elapsedTime) {
		if(alive){
			position.x += direction.x * elapsedTime * speed;
			position.y += direction.y * elapsedTime * speed;

			//gotta keep the stroid in the lines
			if(position.x < 0){
				position.x = position.x * -1;
				direction.x = direction.x * -1;
			} else if(position.x > mapSize.width){
				position.x = mapSize.width - (mapSize.width - position.x);
				direction.x = direction.x * -1;
			}
			if(position.y < 0){
				position.y = position.y * -1;
				direction.y = direction.y * -1;
			} else if(position.y > mapSize.height){
				position.y = mapSize.height - (mapSize.height - position.y);
				direction.y = direction.y * -1;
			}
			timeToNextFire -= elapsedTime;
			if(timeToNextFire < 0){
				timeToNextFire = random.nextGaussian(5000, 1000);
				//calculate those values here.
				ufoFire();//this should have starting position and direction.

			}
		} else {
			timeToNext += elapsedTime;
			if(timeToNext > timeInbetweenUFOs){
				if(totalRunningTime > timeToSmartUFO){
					type = 'sml';
				}
				alive = true;
				timeToNext = 0;
				position.x = random.nextDouble() * mapSize.width;
				position.y = random.nextDouble() * mapSize.height;
			}
		}
		totalRunningTime += elapsedTime
	}

	return that;

}

module.exports.create = (ufoFire) => createUfo(ufoFire);