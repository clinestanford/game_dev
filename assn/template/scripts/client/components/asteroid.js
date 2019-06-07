

MyGame.components.asteroid = function() {
	'use strict';

	let that = {};

	let position = {
		x: 0,
		y: 0
	};

	let rotateRate = 0;
	let rotation = 0;

	let mapSize = {
		width: 8,
		height: 4
	};

	let row = 0;

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

	let direction = {
		x: 0,
		y: 0
	};

	let imgVals = {
		rowHeight: 48,
		lrg: {left: 64, dimension: 48},
		med: {left: 32, dimension: 32},
		sml: {left: 16, dimension: 16},
	}

	let type;

	let speed = 0;

	Object.defineProperty(that, 'speed', {
		get: () => speed,
		set: val => speed = val
	});

	Object.defineProperty(that, 'row', {
		get: () => row,
		set: val => row = val
	});

	Object.defineProperty(that, 'size', {
		get: () => size
	});	

	Object.defineProperty(that, 'imgVals', {
		get: () => imgVals
	});

	Object.defineProperty(that, 'rotateRate', {
		get: () => rotateRate,
		set: val => rotateRate = val
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

	Object.defineProperty(that, 'rotation', {
		get: () => rotation,
		set: val => rotation = val
	});

	that.update = function(elapsedTime) {

		if(elapsedTime){
			position.x += direction.x * elapsedTime * speed;
			position.y += direction.y * elapsedTime * speed;

			rotation += rotateRate * elapsedTime;
		}

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