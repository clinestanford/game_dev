

MyGame.components.PlayerRemote = function() {
	'use strict';

	let that = {};

	let size = {
		width: .0185,
		height: .07
	}

	let state = {
        shield: false,
		direction: 0,
		position: {
			x: 0,
			y: 0
		},
		momentum: {
			x: 0,
			y: 0
		}
	};

	let goal = {
		direction: 0,
		position: {
			x: 0,
			y: 0
		},
		updateWindow: 0		//server reports the time since our last update
	};

	let imgs = {
		numFrame: 4,
		frameWidth: 48,
		frameHeight: 80,
		startX: 127,
		startY: 0, // starts a new one every 240 pixels
		curFrame: 0,
		millisPerFrame: 160,
		curMillis: 0,
	}

    Object.defineProperty(that, 'state', {
        get: () => state
    });

    Object.defineProperty(that, 'momentum', {
    	get: () => state.momentum
    })

    Object.defineProperty(that, 'imgs', {
    	get: () => imgs
    })

    Object.defineProperty(that, 'goal', {
        get: () => goal
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    that.updateFunction = function(elapsedTime) {
    	//update everything with imgs
    	imgs.curMillis += elapsedTime;
    	if(imgs.curMillis > imgs.millisPerFrame){
    		imgs.curFrame += 1;
    		imgs.curFrame %= imgs.numFrame;
    		imgs.curMillis -= imgs.millisPerFrame;
    	}
    	let goalTime = Math.min(elapsedTime, goal.updateWindow);	
    	if(goal.updateWindow > 0) {
    		let updateFraction = elapsedTime/goal.updateWindow;
    		state.direction -= (state.direction - goal.direction) * updateFraction;
    		state.position.x -= (state.position.x - goal.position.x) * updateFraction;
    		state.position.y -= (state.position.y - goal.position.y) * updateFraction;
    		goal.updateWindow -= goalTime;
    	} else {
    		state.position.x += (state.momentum.x * elapsedTime);
    		state.position.y += (state.momentum.y * elapsedTime);
    	}
    }


    return that;

}