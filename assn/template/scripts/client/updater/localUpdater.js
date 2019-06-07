

MyGame.updater = (function() {
	'use strict';

	//server doesn't care about how the ship is being
	//rendered to the local client. Here is the local
	//updating function for it.
	function updateShip(elapsedTime, model){

		model.curMillis += elapsedTime;
		if(model.curMillis > model.millisPerFrame) {
			model.curFrame += 1;
			model.curFrame %= model.numFrame;
			model.curMillis -= model.millisPerFrame;
		}
	}


	return {
		updateShip: updateShip
	}

}());