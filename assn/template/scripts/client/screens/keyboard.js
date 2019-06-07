

MyGame.simpleInput = function (selected, inputHandler) {
	'use strict';

	let that = {
		keys: {},
		handlers: {}
	}

	function keyDown(e) {
		for(let select in selected){
			if(selected[select]){
				console.log(select);
				inputHandler(select, e.key);
			}
		}
	}

	window.addEventListener('keydown', keyDown);

	return that;
}