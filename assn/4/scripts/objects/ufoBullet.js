/*
ufoBullets = {
	src: ,
	lifetime: ,
	speed: ,
	size: {width: , height: },
	drawSize: {width: , height: },
}
*/
MyGame.objects.ufoBullet = function(spec) {
	'use strict';

	let ufoBullets = {};
	let name = 1;

	let image = new Image();
	let isReady = false;
	image.onload = () => {
		isReady = true;
	}
	image.src = spec.src;

	function ufoFireNew(center, direction) {

		let p = {
			center: {x: center.x, y: center.y},
			direction: {x: direction.x, y: direction.y},
			life: spec.lifetime,
			direction: {x: direction.x, y: direction.y},
		}

		ufoBullets[name++] = p;
	} 

	function update(elapsedTime) {
		let removeMe = [];
		Object.getOwnPropertyNames(ufoBullets).forEach(val => {
			let bullet = ufoBullets[val];
			bullet.life -= elapsedTime;
			if(bullet.life < 0) {
				removeMe.push(val);
			}
			bullet.center.x += spec.speed * (elapsedTime / 1000) * bullet.direction.x;
			bullet.center.y += spec.speed * (elapsedTime / 1000) * bullet.direction.y;

				
		})
		for(let bullet = 0; bullet < removeMe.length; ++bullet) {
			delete ufoBullets[removeMe[bullet]];
		}
	}

	function clearAll() {
		let keys = Object.getOwnPropertyNames(ufoBullets);
		for(let i = 0; i < keys.length; ++i) {
			delete ufoBullets[keys[i]];
		}
	}

	return {
		get image() {return image;},
		get bullets() {return ufoBullets;},
		get width() {return spec.size.width;},
		get height() {return spec.size.height;},
		get ready() {return isReady;},
		get drawSize() {return spec.drawSize;},
		update: update,
		ufoFireNew: ufoFireNew,
		clearAll: clearAll
	}
}