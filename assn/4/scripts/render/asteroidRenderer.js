


MyGame.renderer.asteroids = (function(graphics) {
	'use strict';

	function drawAsteroids(asteroids) {
		let imgVals = asteroids.imageValues;
		let all = asteroids.asteroids;

		Object.getOwnPropertyNames(all).forEach(val => {
			let asteroid = all[val];
			if(asteroid.size === "lrg"){
				graphics.drawAnimatedSprite(
						asteroid.rotation,
						asteroids.image,
						imgVals.lrg.left,
						asteroids.row * imgVals.rowHeight,
						imgVals.lrg.dimension,
						imgVals.lrg.dimension,
						asteroid.center,
						{width: imgVals.lrg.appearanceDim, height: imgVals.lrg.appearanceDim}

					)
			} else if(asteroid.size === 'med') {
				graphics.drawAnimatedSprite(
						asteroid.rotation,
						asteroids.image,
						imgVals.med.left,
						asteroids.row * imgVals.rowHeight,
						imgVals.med.dimension,
						imgVals.med.dimension,
						asteroid.center,
						{width: imgVals.med.appearanceDim, height: imgVals.med.appearanceDim}

					)
			} else if(asteroid.size === 'sml') {
				graphics.drawAnimatedSprite(
						asteroid.rotation,
						asteroids.image,
						imgVals.sml.left,
						asteroids.row * imgVals.rowHeight,
						imgVals.sml.dimension,
						imgVals.sml.dimension,
						asteroid.center,
						{width: imgVals.sml.appearanceDim, height: imgVals.sml.appearanceDim}

					)
			}
		});
	}

	return {
		drawAsteroids: drawAsteroids
	}
}(MyGame.graphics));