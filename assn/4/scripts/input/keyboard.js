

MyGame.input.keyboard = function (orb, mode) {
	'use strict';
	let orbMax = 10;
	let firing = false;

	let that = {
		keys: {},
		handlers: {}
	}

	function keyDown(e) {
		if(mode === 'notGame') {
			if(that.handlers.hasOwnProperty(e.key)){
				that.handlers[e.key]();
			}
		}
		that.keys[e.key] = e.timestamp;
	}

	function keyUp(e) {
		if(that.keys.hasOwnProperty(e.key)) {
			if(e.key === ' '){
				firing = false;
			}
			delete that.keys[e.key];
		}
	}

	that.update = function(elapsedTime) {
		let missiles = Object.keys(orb.orbs).length;
		for(let key in that.keys) {
			if(key === ' '){
				if (missiles < orbMax && !firing){
					that.handlers[key](elapsedTime);
					firing = true;
				}
			}else if(that.handlers.hasOwnProperty(key)) {
				that.handlers[key](elapsedTime);
			}
		}
	}


	that.register = function(key, handler) {
		// if(key === 'y' || key === 'n'){
		// 	console.log('registered: ', key, handler);	
		// }
		that.handlers[key] = handler;
	}

	that.deregister = function(key) {
		delete that.handlers[key];
	}


	window.addEventListener('keydown', keyDown);
	window.addEventListener('keyup', keyUp)

	return that;
}