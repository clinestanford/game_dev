
/*
obj = {
	src: ,
	sprite: ,
	cwidth: ,
	cheight: ,
	spacing: ,  this value is for how close it can be to the ship when spawning
	rotMean: ,
	rotStdev: ,
	speedMean: ,
	speedStdev: ,
	row: ,
	
}
*/

//large: right side: 64 px, left: 112
//large: height top: 192 px, height bottom: 240
//specs: height-48, width: 48

//medium: right side: 32 px, left: 64
//medium: height top: 192 px, height bottom: 224
//specs: height: 32, width: 32

//small: right side: 16 px, left: 32
//small: height top: 192 px, height bottom: 208
//specs: height: 16, width: 16

MyGame.objects.asteroid = function(spec) {
	'use strict';

	let asteroids = {};
	let name = 1;

	let cwidth = spec.cwidth;
	let cheight = spec.cheight;

	let imageValues = {
		rowHeight: 48,
		lrg: {left: 64, dimension: 48, appearanceDim: 60},
		med: {left: 32, dimension: 32, appearanceDim: 40},
		sml: {left: 16, dimension: 16, appearanceDim: 20},
	}

	let image = new Image();
	let isReady = false;
	image.onload = () => {
		isReady = true;
	}
	image.src = spec.src;

	function calcDistance(centerShip, centerAstroid){
		return Math.sqrt(Math.min(Math.abs(centerShip.x - centerAstroid.x), Math.abs(cwidth - (centerShip.x + centerAstroid.x))) ** 2 + Math.min(Math.abs(centerShip.y - centerAstroid.y), Math.abs(cwidth - (centerShip.y + centerAstroid.y))) ** 2);
	}

	function createAsteroid(size, spriteCenter){
		let center = {x: Random.nextRange(0, cwidth), y: Random.nextRange(0, cheight)};
		while(calcDistance(center, spriteCenter) < spec.spacing){
			center = {x: Random.nextRange(0, cwidth), y: Random.nextRange(0, cheight)};
		}

		let asteroid = {
			center: {x: center.x, y: center.y},
			size: size,
			rotation: 0,
			rotationRate: Random.nextGaussian(spec.rotMean, spec.rotStdev),
			speed: Random.nextGaussian(spec.speedMean, spec.speedStdev),
			angle: Random.nextCircleVector(),
			radius: imageValues[size].dimension
		}

		return asteroid;
	}

	function createAsteroidWithCenter(center, size) {
		asteroids[name++] = {
			center: {x: center.x, y: center.y},
			size: size,
			rotation: 0,
			rotationRate: Random.nextGaussian(spec.rotMean, spec.rotStdev),
			speed: Random.nextGaussian(spec.speedMean, spec.speedStdev) * spec[size+'scale'],
			angle: Random.nextCircleVector(),
			radius: imageValues[size].dimension
		}
	}

	function brokenAsteroid(center, size) {
		if(size === 'lrg') {
			//break into 3
			for(let i = 0; i < 3; ++i) {
				createAsteroidWithCenter(center, 'med');
			}
			return 400;
		} else if(size === 'med') {
			//break into 4
			for(let i = 0; i < 4; ++i) {
				createAsteroidWithCenter(center, 'sml');
			}
			return 800;
		} else if (size === 'sml') {
			return 1200;
		}

	}


	function startLevel(asteroidCount, spriteCenter) {
		for(let i = 0; i < asteroidCount; ++i) {
			asteroids[name++] = createAsteroid('lrg', spriteCenter);
		}
	}

	function update(elapsedTime) {

		Object.getOwnPropertyNames(asteroids).forEach(val => {
			let asteroid = asteroids[val];
			if(!isNaN(elapsedTime)){
				asteroid.center.x += asteroid.angle.x * asteroid.speed * (elapsedTime / 1000);
				asteroid.center.y += asteroid.angle.y * asteroid.speed * (elapsedTime / 1000);
				asteroid.rotation += asteroid.rotationRate;
			}
			//make sure we are still in bounds
			if(asteroid.center.x > cwidth) {asteroid.center.x %= cwidth;}
			if(asteroid.center.y > cheight) {asteroid.center.y %= cheight;}
			if(asteroid.center.x < 0) {asteroid.center.x += cwidth;}
			if(asteroid.center.y < 0) {asteroid.center.y += cheight;}

		});
	}

	return {
		brokenAsteroid: brokenAsteroid,
		get asteroids() {return asteroids;},
		get image() {return image},
		get ready() {return isReady},
		get imageValues() {return imageValues},
		get row() {return spec.row},
		update: update,
		startLevel: startLevel
	}
}