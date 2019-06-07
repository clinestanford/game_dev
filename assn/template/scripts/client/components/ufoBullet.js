
MyGame.components.ufoBullet = function() {
	'use strict';

	let that = {};

	let lifetime = 4000;

	let position = {
		x: 0,
		y: 0
	};

	let size = {
		width: .0162,
		height: .035
	}

	let direction = {
		x: 0,
		y: 0
	};

	let speed = .0006;

	Object.defineProperty(that, 'speed', {
		get: () => speed,
		set: val => speed = val
	});

	Object.defineProperty(that, 'lifetime', {
		get: () => lifetime,
		set: val => lifetime = val
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

	that.update = function(elapsedTime) {
		position.x += direction.x * elapsedTime * speed;
		position.y += direction.y * elapsedTime * speed;
		lifetime -= elapsedTime;
		if(lifetime < 0){
			return true;
		}
	}

	return that;
}