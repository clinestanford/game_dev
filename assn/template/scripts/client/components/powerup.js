

MyGame.components.powerup = function(center, myType) {
	'use strict';

	let that = {};

	let type = myType; //for now all we'll have is the shield

	let position = {
		x: center.x,
		y: center.y
	};

	let size = {
		width: .0347,
		height: .075 
	};

	Object.defineProperty(that, 'position', {
		get: () => position
	});

	Object.defineProperty(that, 'type', {
		get: () => type
	});

	Object.defineProperty(that, 'size', {
		get: () => size
	});

	return that;
}
