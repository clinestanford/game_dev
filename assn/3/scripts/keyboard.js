

MyGame.input.Keyboard = function() {
	let clickedKeys = {};

	let that = {
		keys: {},
		handlers: {}
	}

	function keyPress(e){
		that.keys[e.key] = e.timeStamp;
	}

	function keyRelease(e){
		delete that.keys[e.key];
		delete clickedKeys[e.key];
	}

	that.update = function(elapsedTime) {
		for(let key in that.keys){
			if(that.handlers.hasOwnProperty(key) && clickedKeys.hasOwnProperty(key) == false){
				if(that.handlers[key]){
					that.handlers[key](elapsedTime);
					clickedKeys[key] = elapsedTime;
				}
			}
		}
	}

	that.clearAll = function() {
		for(let key in clickedKeys) {
			delete clickedKeys[key];
		}
		for(let key in that.keys) {
			delete that.keys[key];
		}
	}

	that.register = function(key, handler){
		that.handlers[key] = handler;
	}

	window.addEventListener('keydown', keyPress);
	window.addEventListener('keyup', keyRelease);

	return that;
}