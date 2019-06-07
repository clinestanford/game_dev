

/*
This is the particleSystem Manager. There will also be a 
Particle System file that is resposible for creating each of the
indivicual pieces, and a particleSystemRenderer that knows how to 
render each of the types. The renderer should be given two files
as images to render.
*/

MyGame.particles.systemManager = (function(graphics) {
	'use strict';

	let astNames = 1;
	let asteroidExplosions = {};
	let asteroidRenderers = {};
	let getLocalPosition;

	function setFunctionGetLocal(func){
		getLocalPosition = func;
	}

	function createAsteroidBreakup(center, size) {
		if(size === 'lrg') {
			asteroidExplosions[astNames] = MyGame.components.system({
				center: {x: center.x, y: center.y},
				size: {width: .046, height: .1},
				speed: {mean: .1, stdev: .01},
				lifetime: {mean: 1.5, stdev: .3},
				toCreate: 20,
				img1: MyGame.assets['firecircle'],
				img2: MyGame.assets['firewall'],
				type: 'circular'
			});
			asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics);
		} else if(size === 'med') {
			asteroidExplosions[astNames] = MyGame.components.system({
				center: {x: center.x, y: center.y},
				size: {width: .037, height: .08},
				speed: {mean: .1, stdev: .03},
				lifetime: {mean: .75, stdev: .2},
				toCreate: 10,
				img1: MyGame.assets['firecircle'],
				img2: MyGame.assets['firewall'],
				type: 'circular'
			});
			asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics);
		} else if(size === 'sml') {
			asteroidExplosions[astNames] = MyGame.components.system({
				center: {x: center.x, y: center.y},
				size: {width: .023, height: .05},
				speed: {mean: .1, stdev: .03},
				lifetime: {mean: .5, stdev: .2},
				toCreate: 5,
				img1: MyGame.assets['firecircle'],
				img2: MyGame.assets['firewall'],
				type: 'circular'
			});
			asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics);
		}
	}
	function createUFOExplosion(x, y) {

		asteroidExplosions[astNames] = MyGame.components.system({
			center: {x: x, y: y},
			size: {width: .0162, height: .035},
			speed: {mean: .15, stdev: .05},
			lifetime: {mean: 1.25, stdev: .5},
			toCreate: 15,
			img1: MyGame.assets['shock'],
			img2: MyGame.assets['alien'],
			type: 'circular'
		});
		asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics);
	}

	function hyperSpaceAppear(center) {

		asteroidExplosions[astNames] = MyGame.components.system({
			center: {x: center.x, y: center.y},
			size: {width: .0046, height: .01},
			speed: {mean: .5, stdev: .2},
			lifetime: {mean: 1, stdev: .35},
			toCreate: 30,
			img1: MyGame.assets['orbCures'],
			img2: MyGame.assets['bless'],
			type: 'circular'
		});
		asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics);
	}

	//to convert, change size, speed, change boolean input for MyGame.renderer

	function leaveTrail(center) {

		asteroidExplosions[astNames] = MyGame.components.system({
			center: {x: center.x, y: center.y},
			size: {width: .0069, height: .015},
			speed: {mean: .07, stdev: .03},
			lifetime: {mean: 1, stdev: .35},
			toCreate: 1,
			img1: MyGame.assets['ice'],
			img2: MyGame.assets['ice'],
			type: 'circular'
		});
		asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics);
	}

	function update(elapsedTime) {
		let removeMe = [];
		Object.getOwnPropertyNames(asteroidExplosions).forEach(val => {
			let deleteThis = asteroidExplosions[val].update(elapsedTime);
			if(deleteThis) {
				removeMe.push(val);
			}
		});

		for(let i = 0; i < removeMe.length; ++i) {
			delete asteroidExplosions[removeMe[i]];
			delete asteroidRenderers[removeMe[i]];
		}
	}

	function render() {
		Object.getOwnPropertyNames(asteroidRenderers).forEach(val => {
			asteroidRenderers[val].render(getLocalPosition);
		});
	}

	let api = {
		setFunctionGetLocal: setFunctionGetLocal,
		update: update,
		render: render,
		createAsteroidBreakup: createAsteroidBreakup,
		createUFOExplosion: createUFOExplosion,
		hyperSpaceAppear: hyperSpaceAppear,
		leaveTrail: leaveTrail
	}

	return api;
}(MyGame.graphics));