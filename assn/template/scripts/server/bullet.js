


function createBullet(pos, dir) {
	'use strict';

	//id will be handled in the gameplay
	//will keep a dictionary of all the bullets
	//and the id will be its key

	let that = {};

	let imgs = {
		numFrames: 0,
		curFrame: 0,
		frameWidth: 0,
		frameHeight: 0,
		millisPerFrame: 0,
		curMillis: 0
	}

	let ownerId = 0;

	//let's assume the input parameters are exactly where it
	//needs to be
	let position = {
		x: pos.x,
		y: pos.y
	};

	let direction = {
		x: dir.x,
		y: dir.y
	};

	let lifetime = 4000;

	let speed = .0006;

	let size = {
		width: .0185,
		height: .04 
	};

	Object.defineProperty(that, 'position', {
		get: () => position
	});

	Object.defineProperty(that, 'direction', {
		get: () => direction
	});

	Object.defineProperty(that, 'lifetime', {
		get: () => lifetime,
		set: val => lifetime = val
	});

	Object.defineProperty(that, 'ownerId', {
		get: () => ownerId,
		set: val => ownerId = val
	});

	Object.defineProperty(that, 'speed', {
		get: () => speed
	});

	Object.defineProperty(that, 'size', {
		get: () => size
	});

	Object.defineProperty(that, 'imgs', {
		get: () => imgs
	});

	that.update = function(elapsedTime) {
		if(elapsedTime){
			imgs.curMillis += elapsedTime;
			if(imgs.curMillis > imgs.millisPerFrame){
				imgs.curMillis -= imgs.millisPerFrame;
				imgs.curFrame += 1;
				imgs.curFrame %= imgs.numFrames;
			}
			position.x += direction.x * speed * elapsedTime;
			position.y -= direction.y * speed * elapsedTime;
			lifetime -= elapsedTime;
			if(lifetime < 0){
				return true;
			}
		}
		return false;
	}

	return that;
}

module.exports.create = (pos, dir) => createBullet(pos, dir);