

MyGame.managers.particleSystemManager = (function(graphics, objects) {
	'use strict';

	let orb;
	let orbImage;
	let orbReady = false;
	let orbs = {};
	let name = 1;





	function initializeObjects() {
		orbImage = 'assets/plasmaball.png';
		orbImage.onload = function () {
			orbReady = true;
		}

	}

	function fire(center, direction) {
		orbs.push(objects.animatedSprite.create(center, direction));
	}

	function update(elapsedTime) {

		//this will only be updating the orbs;
		let removeMe = [];
		Object.getOwnPropertyNames(orbs).forEach(val => {
			orbs[val].lifetime -= elapsedTime;
			if(orbs[val].lifetime < 0) {
				removeMe.push(orb);
			}
		})

		for(let orb = 0; orb < removeMe.length; ++orb) {
			delete orbs[removeMe[orb]];
		}
	}



	initializeObjects();

	return {
		fire: fire,

	}

}(MyGame.graphics, MyGame.objects));