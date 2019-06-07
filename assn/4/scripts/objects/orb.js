/*
orb = {
	src: ,
	sprite: ,
	lifetime: ,
	frames: ,
	millisPerFrame: ,
	frameWidth: ,
	frameHeight: ,
}
*/
MyGame.objects.orb = function(spec) {
	'use strict';

	let orbs = {};

	let image = new Image();
	let isReady = false;
	image.onload = () => {
		isReady = true;
	}
	image.src = spec.src;

	function createOrb() {
		spec.fireSound();
		orbs[name++] = {
			center: {x: spec.sprite.center.x - Math.cos(spec.sprite.rotation) * spec.sprite.size.width / 2, 
					 y: spec.sprite.center.y - Math.sin(spec.sprite.rotation) * spec.sprite.size.width / 2},
			rotation: spec.sprite.rotation - Math.PI / 2,
			lifetime: spec.lifetime,
			momentum: {x: spec.sprite.momentum.x, y: spec.sprite.momentum.y},
			alive: 0,
			curFrame: 0,
			curFrameTime: 0,
		}
	}

	function update(elapsedTime) {
		let removeMe = [];
		Object.getOwnPropertyNames(orbs).forEach(val => {
			let orb = orbs[val];
			orb.center.x += Math.cos(orb.rotation) * (spec.moveRate) * (elapsedTime / 1000);
			orb.center.y += Math.sin(orb.rotation) * (spec.moveRate) * (elapsedTime / 1000);

			//check boundaries of canvas
			if (orb.center.x < 0) { orb.center.x += spec.cwidth;}
			if (orb.center.x > spec.cwidth) { orb.center.x -= spec.cwidth;}
			if (orb.center.y < 0) { orb.center.y += spec.cheight;}
			if (orb.center.y > spec.cheight) { orb.center.y -= spec.cheight;}
			
			//check how long it has been alive
			orb.alive += elapsedTime;
			if(orb.alive > orb.lifetime) {
				removeMe.push(val);
			}

			//update the current frame we are on if we must
			orb.curFrameTime += elapsedTime;
			if(orb.curFrameTime > spec.millisPerFrame) {
				orb.curFrameTime = orb.curFrameTime - spec.millisPerFrame;
				orb.curFrame++;
				orb.curFrame %= spec.frames;
			}
		})
		for(let orb = 0; orb < removeMe.length; ++orb) {
			delete orbs[removeMe[orb]];
		}
	}

	function clearAll() {
		let keys = Object.getOwnPropertyNames(orbs);
		for(let i = 0; i < keys.length; ++i) {
			delete orbs[keys[i]];
		}
	}


	//return #frames, framewid/hei, 
	return {
		get image() {return image;},
		get radius() {return spec.radius;},
		get orbs() {return orbs;},
		get width() {return spec.frameWidth;},
		get height() {return spec.frameHeight;},
		get frames() {return spec.frames;},
		get ready() {return isReady;},
		get size() {return spec.size;},
		update: update,
		createOrb, createOrb,
		clearAll: clearAll
	}
}