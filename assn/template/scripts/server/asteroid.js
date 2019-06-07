
random = require('./random');
present = require('present');

function createAsteroid(fromType, center) {
	'use strict';

	let that = {};

	let mapSize = {
		width: 8,
		height: 4
	};

	let size = {
		lrg: {
			width: .0463,
			height: .1
		},
		med: {
			width: .0323,
			height: .07
		},
		sml: {
			width: .0185,
			height: .04
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

	let type;

	if(center){
		position.x = center.x;
		position.y = center.y;
	} else {
		position.x = random.nextDouble() * mapSize.width;
		position.y = random.nextDouble() * mapSize.height;
	}

	if(fromType) {
		if(fromType === 'lrg'){
			type = 'med';
		} else if(fromType === 'med'){
			type = 'sml';
		}
	} else {
		type = 'lrg';
	}

	let randomDir = random.nextCircleVector(1);

	let direction = {
		x: randomDir.x,
		y: randomDir.y
	};

	let speedScales = {
		'lrg': 1,
		'med': 2,
		'sml': 2.5
	};

	let speed = random.nextGaussian(speedDist.mean, speedDist.stdev) * speedScales[type];

	Object.defineProperty(that, 'speed', {
		get: () => speed
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

	that.update = function(elapsedTime) {
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
	}

	return that;

}

module.exports.create = (fromType, center) => createAsteroid(fromType, center);