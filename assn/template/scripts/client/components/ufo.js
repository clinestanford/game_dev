

MyGame.components.ufo = function() {
	'use strict';

	let that = {};

	let mapSize = {
		width: 8,
		height: 4
	};

	//make sure the canvas is a square
	let size = {
		lrg: {
			width: .0324,
			height: .07
		},
		sml: {
			width: .0231,
			height: .05
		}
	}

	let position = {
		x: 0,
		y: 0
	};

	let rotateRate;

	let type = 'lrg';

	let direction = {
		x: 0,
		y: 0
	};

	let rotation = 0;

	let speed;

	Object.defineProperty(that, 'speed', {
		get: () => speed,
		set: val => speed = val
	});

	Object.defineProperty(that, 'rotation', {
		get: () => rotation,
		set: val => rotation = val
	});

	Object.defineProperty(that, 'rotateRate', {
		get: () => rotateRate,
		set: val => rotateRate = val
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
		get: () => type,
		set: val => type = val
	});

	that.update = function(elapsedTime) {
		if(elapsedTime){
			position.x += direction.x * elapsedTime * speed;
			position.y += direction.y * elapsedTime * speed;
			rotation += rotateRate * elapsedTime;	
		}
		

		//gotta keep the ufo in the lines
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