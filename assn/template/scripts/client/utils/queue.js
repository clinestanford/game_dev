

MyGame.utils.Queue = function() {
	'use strict';

	let that = [];

	that.enqueue = function(val){
		that.push(val);
	}

	that.dequeue = function(){
		return that.shift();
	}

	Object.defineProperty(that, 'front', {
		get: () => {return that[0]}
	});

	Object.defineProperty(that, 'empty', {
		get: () => {return that.length === 0;}
	});

	return that;
};