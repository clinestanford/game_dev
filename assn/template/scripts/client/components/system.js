

MyGame.components.system = function(spec) {
	'use strict';

	let name = 1;
	let obj1 = {};
	let obj2 = {};

	function create() {
		let p = {
			center: {x: spec.center.x, y: spec.center.y},
			size: {width: spec.size.width, height: spec.size.height},
			speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
			lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),
			direction: Random.nextCircleVector(),
			rotation: 0,
			lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), 
		}

		return p;
	}

	for(let i = 0; i < spec.toCreate; ++i) {
		obj1[name++] = create();
	}

	for(let i = 0; i < spec.toCreate; ++i) {
		obj2[name++] = create();
	}

	function update(elapsedTime) {

		let milliTime = elapsedTime;
		elapsedTime = elapsedTime / 1000;
		let deleteThis = true;
		let removeObjs = [];

		Object.getOwnPropertyNames(obj1).forEach(val => {
			let curObj = obj1[val];
			curObj.rotation += curObj.speed * 1.5;
			curObj.center.x += curObj.speed * elapsedTime * curObj.direction.x;
			curObj.center.y += curObj.speed * elapsedTime * curObj.direction.y;
			curObj.lifetime -= elapsedTime;
			if(deleteThis && curObj.lifetime > 0) {
				deleteThis = false;
			}
			if(curObj.lifetime < 0){
				removeObjs.push(val);
			}
		});

		for(let i = 0; i < removeObjs.length; ++i) {
			delete obj1[removeObjs[i]];
		}

		removeObjs.length = 0;

		Object.getOwnPropertyNames(obj2).forEach(val => {
			let curObj = obj2[val];
			curObj.rotation += curObj.speed * 1.5;
			curObj.center.x += curObj.speed * elapsedTime * curObj.direction.x;
			curObj.center.y += curObj.speed * elapsedTime * curObj.direction.y;
			curObj.lifetime -= elapsedTime;
			if(deleteThis && curObj.lifetime > 0) {
				deleteThis = false;
			}
			if(curObj.lifetime < 0){
				removeObjs.push(val);
			}
		});

		for(let i = 0; i < removeObjs.length; ++i) {
			delete obj1[removeObjs[i]];
		}

		return deleteThis;
	}

	return {
		obj1: obj1,
		obj2: obj2,
		img1: spec.img1,
		img2: spec.img2,
		update: update,
	}
}