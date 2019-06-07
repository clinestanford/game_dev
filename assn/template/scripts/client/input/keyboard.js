

MyGame.input.keyboard = function() {
	'use strict';

	let keys = {},
		keyRepeat = {},
		handlers = {},
		nextHandlerId = 0,
		that = {};

	that.registerHandler = function(handler, key, repeat, rate) {

		if(rate === undefined) {
			rate = 0;
		}

		if(!handlers.hasOwnProperty(key)) {
			handlers[key] = [];
		}
		handlers[key].push({
			handlerId: nextHandlerId,	
			key: key,
			repeat: repeat,
			rate: rate,
			elapsedTime: rate,
			handler: handler
		});

		nextHandlerId++;

		return handlers[key][handlers[key].length - 1].id;
	}

	that.unregisterHandler = function(key, id) {
		if(handlers.hasOwnProperty(key)) {
			for(let entry = 0; entry < handlers[key].length; ++entry) {
				if(handlers[key][entry].id === id) {
					handlers[key].splice(entry, 1);
					break;
				}
			}
		}
	};

	that.update = function(elapsedTime) {
		for(let key in keys){
			if(handlers.hasOwnProperty(key)) {
				for(let entry = 0; entry < handlers[key].length; ++entry){//a key can have multiple handlers.
					let event = handlers[key][entry];	//this is iterating through all of its handlers.
					event.elapsedTime += elapsedTime;
					if(event.repeat === true){
						if(event.elapsedTime > event.rate){
							event.handler(elapsedTime);
							keyRepeat[key] = true;
							event.elapsedTime = (elapsedTime - event.rate);
						}
					} else if(event.repeat === false && keyRepeat[key] === false) {
						event.handler(elapsedTime);
						keyRepeat[key] = true;
					}
				}
			}
		}
	}

	function keyDown(event) {
		keys[event.key] = event.timeStamp;

		if(keyRepeat.hasOwnProperty(event.key) === false) {
			keyRepeat[event.key] = false;
		}
	}

	function keyRelease(event) {
		delete keys[event.key];
		delete keyRepeat[event.key];
	}


	window.addEventListener('keydown', keyDown);
	window.addEventListener('keyup', keyRelease);	


	return that;
}