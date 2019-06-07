

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

	let ice = new Image();
	let isReadyIce = false;
	ice.onload = function() {
		isReadyIce = true;
	}
	ice.src = 'assets/ice.png';


	let firecircle = new Image();
	let firewall = new Image();

	let isReadyfireCircle = false;
	let isReadyfireWall = false;

	firecircle.onload = () => {
		isReadyfireCircle = true;
	}
	firecircle.src = 'assets/firecircle.png';

	firewall.onload = () => {
		isReadyfireWall = true;
	}
	firewall.src = 'assets/firewall.png';

	let singlealien = new Image();
	let singleshock = new Image();

	let isReadySingleAlien = false;
	let isReadySingleShock = false;

	singlealien.onload = () => {
		isReadySingleAlien = true;
	}
	singlealien.src = 'assets/singlealien.png';

	singleshock.onload = () => {
		isReadySingleShock = true;
	}
	singleshock.src = 'assets/singleshock.png';

	let blless = new Image();
	let orbCurse = new Image();

	let isReadyBlless = false;
	let isReadyOrbCurse = false;

	blless.onload = () => {
		isReadyBlless = true;
	}
	blless.src = 'assets/Blless.png';

	orbCurse.onload = () => {
		isReadyOrbCurse = true;
	}
	orbCurse.src = 'assets/orbCurse.png';



	function createShipExplosion(center) {
		asteroidExplosions[astNames] = MyGame.objects.system({
			center: {x: center.x, y: center.y},
			size: {width: 30, height: 30},
			speed: {mean: 150, stdev: 50},
			lifetime: {mean: 1.5, stdev: .5},
			toCreate: 30,
			img1: firecircle,
			img2: singleshock,
		});
		asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics, isReadySingleShock, isReadyfireCircle);

	}
	function createAsteroidBreakup(center, size) {

		if(size === 'lrg') {
			asteroidExplosions[astNames] = MyGame.objects.system({
				center: {x: center.x, y: center.y},
				size: {width: 22, height: 22},
				speed: {mean: 100, stdev: 50},
				lifetime: {mean: 1, stdev: .25},
				toCreate: 20,
				img1: firecircle,
				img2: firewall,
			});
			asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics, isReadyfireWall, isReadyfireCircle);
		} else if(size === 'med') {
			asteroidExplosions[astNames] = MyGame.objects.system({
				center: {x: center.x, y: center.y},
				size: {width: 15, height: 15},
				speed: {mean: 100, stdev: 50},
				lifetime: {mean: .5, stdev: .2},
				toCreate: 10,
				img1: firecircle,
				img2: firewall,
			});
			asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics, isReadyfireWall, isReadyfireCircle);
		} else if(size === 'sml') {
			asteroidExplosions[astNames] = MyGame.objects.system({
				center: {x: center.x, y: center.y},
				size: {width: 10, height: 10},
				speed: {mean: 100, stdev: 50},
				lifetime: {mean: .5, stdev: .2},
				toCreate: 5,
				img1: firecircle,
				img2: firewall,
			});
			asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics, isReadyfireWall, isReadyfireCircle);
		}
	}
	function createUFOExplosion(x, y) {

		asteroidExplosions[astNames] = MyGame.objects.system({
			center: {x: x, y: y},
			size: {width: 25, height: 25},
			speed: {mean: 100, stdev: 50},
			lifetime: {mean: 1.25, stdev: .5},
			toCreate: 15,
			img1: singleshock,
			img2: singlealien,
		});
		asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics, isReadySingleAlien, isReadySingleShock);
	}

	function hyperSpaceJump(center) {
		asteroidExplosions[astNames] = MyGame.objects.system({
			center: {x: center.x, y: center.y},
			size: {width: 10, height: 10},
			speed: {mean: 100, stdev: 20},
			lifetime: {mean: 1, stdev: .35},
			toCreate: 30,
			img1: blless,
			img2: orbCurse,
		});
		asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics, isReadyBlless, isReadyOrbCurse);
	}
	function hyperSpaceAppear(center) {

		asteroidExplosions[astNames] = MyGame.objects.system({
			center: {x: center.x, y: center.y},
			size: {width: 12, height: 12},
			speed: {mean: 300, stdev: 20},
			lifetime: {mean: 1, stdev: .35},
			toCreate: 30,
			img1: blless,
			img2: orbCurse,
		});
		asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics, isReadyBlless, isReadyOrbCurse);
	}

	function leaveTrail(center) {

		asteroidExplosions[astNames] = MyGame.objects.system({
			center: {x: center.x, y: center.y},
			size: {width: 8, height: 8},
			speed: {mean: 10, stdev: 2},
			lifetime: {mean: 1, stdev: .35},
			toCreate: 1,
			img1: ice,
			img2: ice,
		});
		asteroidRenderers[astNames] = MyGame.renderer.particleSystemRenderer(asteroidExplosions[astNames++], MyGame.graphics, isReadyIce, isReadyIce);
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

	function render(elapsedTime) {
		Object.getOwnPropertyNames(asteroidRenderers).forEach(val => {
			asteroidRenderers[val].render(elapsedTime);
		});
	}

	let api = {
		update: update,
		render: render,
		createAsteroidBreakup: createAsteroidBreakup,
		createUFOExplosion: createUFOExplosion,
		createShipExplosion: createShipExplosion,
		hyperSpaceJump: hyperSpaceJump,
		hyperSpaceAppear: hyperSpaceAppear,
		leaveTrail: leaveTrail
	}

	return api;
}(MyGame.graphics));