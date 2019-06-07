
let random = require('./random');

function createPowerUp() {
	'use strict';

	let that = {};

	let types = ['shield', 'orb'];
	
	let type = types[random.nextRange(0, types.length-1)]; 

	let mapSize = {
		width: 8,
		height: 4
	}

	let position = {
		x: (random.nextDouble() * (mapSize.width - 1)) + .5,
		y: (random.nextDouble() * (mapSize.height - 1)) + .5
	};

	let size = {
		width: .0347,
		height: .075 
	};

	Object.defineProperty(that, 'position', {
		get: () => position
	});

	Object.defineProperty(that, 'size', {
		get: () => size
	});

	Object.defineProperty(that, 'type', {
		get: () => type
	});

	return that;
}

module.exports.create = () => createPowerUp();