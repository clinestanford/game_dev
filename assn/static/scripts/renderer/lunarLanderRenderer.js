


MyGame.renderer.landerRenderer = (function(graphics) {
	'use strict';


	/*
	source: 'assets/lander-4.png',
    center: { x: 0.25, y: 0.90 }, // world coordinates
    size: { width: 0.05, height: 0.05 }, // world units
    rotation: 3 * (Math.PI / 2), // radians
    rotateRate: 0.0015, // radians per millisecond
    thrustRate: 0.00000005,  // world units per millisecond of acceleration
    fuel: 20000 // milliseconds of thrust

	*/
	function drawLander(lander) {
		let x = lander.center.x * graphics.canvas.width;
		let y = graphics.canvas.height - lander.center.y * graphics.canvas.height;
		
		if(lander.ready) {
			graphics.drawObject(lander.image, {x: x, y: y}, lander.rotation, lander.size);
		}
	}

	return {
		drawLander: drawLander,
	}

}(MyGame.graphics));