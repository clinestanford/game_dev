

MyGame.objects.particleSystem = function(spec) {
	'use strict';

	let fireballs = [];
	let smoke1Balls = [];
	let smoke2Balls = [];

	let smoke1 = new Image();
	let smoke2 = new Image();
	let fire = new Image();
	let isfire = false;
	let isSmoke1 = false;
	let isSmoke2 = false;
	smoke1.onload = () => {
		isSmoke1 = true;
	}
	smoke1.src = spec.smoke1;
	smoke2.onload = () => {
		isSmoke2 = true;
	}
	smoke2.src = spec.smoke2;
	fire.onload = () => {
		isfire = true;
	}
	fire.src = spec.fire;

	function create(center) {

		let p = {
			center: {x: center.x, y: spec.cheight - center.y},
			size: {width: 25, height: 25},
			speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
			lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),
			direction: Random.nextCircleVector(),
			rotation: 0,
			lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), 
		}

		return p;
	}

	function createSmoke(center, rotation, size) {
		
		center.x = center.x - Math.sin(rotation) * size.width/2;
		center.y = center.y - Math.cos(rotation) * size.height/2;

		let gauss1 = Random.nextGaussian(-Math.sin(rotation)* 1.4,.2);
		let gauss2 = Random.nextGaussian(Math.cos(rotation)*1.4,.2);
		let direction = {x: gauss1, y: gauss2};

		let p = {
			center: {x: center.x, y: spec.cheight - center.y},
			size: {width: 5, height: 5},
			speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
			lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),
			direction: direction,
			rotation: 0,
			lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), 
		}

		return p;
	}

	function onThrust(center, rotation, size){
		
		let x = center.x * spec.cwidth;
		let y = center.y * spec.cheight;

		smoke1Balls.push(createSmoke({x: x, y: y}, rotation, size));
		smoke2Balls.push(createSmoke({x: x, y: y}, rotation, size));
	}

	function onCrash(center) {
		//center in terms of 0 < x < 1
		let x = center.x * spec.cwidth;
		let y = center.y * spec.cheight;
		for(let i = 0; i < 30; ++i){
			fireballs.push(create({x: x, y: y}));
		}
	}


	function update(elapsedTime) {
		let removeMe = [];
		
		for(let i = 0; i < fireballs.length; ++i) {
			let curBall = fireballs[i];
			curBall.lifetime -= elapsedTime;
			if(curBall.lifetime < 0){
				removeMe.push(i)
			}
			curBall.center.x += curBall.direction.x * curBall.speed * elapsedTime;
			curBall.center.y += curBall.direction.y * curBall.speed * elapsedTime;
		}

		for(let i = 0; i < removeMe.length; ++i) {
			let index = removeMe[i];
			fireballs.splice(index, index+1);
		}

		removeMe = [];
		
		for(let i = 0; i < smoke1Balls.length; ++i) {
			let curBall = smoke1Balls[i];
			curBall.lifetime -= elapsedTime;
			if(curBall.lifetime < 0){
				removeMe.push(i)
			}
			curBall.center.x += curBall.direction.x * curBall.speed * elapsedTime;
			curBall.center.y += curBall.direction.y * curBall.speed * elapsedTime;
		}

		for(let i = 0; i < removeMe.length; ++i) {
			let index = removeMe[i];
			smoke1Balls.splice(index, index+1);
		}

		removeMe = [];
		
		for(let i = 0; i < smoke2Balls.length; ++i) {
			let curBall = smoke2Balls[i];
			curBall.lifetime -= elapsedTime;
			if(curBall.lifetime < 0){
				removeMe.push(i)
			}
			curBall.center.x += curBall.direction.x * curBall.speed * elapsedTime;
			curBall.center.y += curBall.direction.y * curBall.speed * elapsedTime;
		}

		for(let i = 0; i < removeMe.length; ++i) {
			let index = removeMe[i];
			smoke2Balls.splice(index, index+1);
		}
	}

	return {
		get fire() {return fire},
		get smoke1() {return smoke1},
		get smoke2() {return smoke2},
		get fireballs() {return fireballs;},
		get smoke1Balls() {return smoke1Balls;},
		get smoke2Balls() {return smoke2Balls;},
		onCrash: onCrash,
		onThrust: onThrust,
		update: update
	}
}