

MyGame.input.keyboard = function () {
	'use strict';

	let that = {
		keys: {},
		handlers: {}
	}

	function keyDown(e) {
		that.keys[e.key] = e.timestamp;
	}

	function keyUp(e) {
		if(that.keys.hasOwnProperty(e.key)) {
			delete that.keys[e.key];
		}
	}

	that.update = function(elapsedTime) {
		for(let key in that.keys) {
			if(that.handlers.hasOwnProperty(key)) {
				that.handlers[key](elapsedTime);
			}
		}
	}

	that.register = function(key, handler) {
		that.handlers[key] = handler;
	}

	that.deregister = function(key) {
		delete that.handlers[key];
	}

	window.addEventListener('keydown', keyDown);
	window.addEventListener('keyup', keyUp)

	return that;
}