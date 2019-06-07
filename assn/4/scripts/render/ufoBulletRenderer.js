


MyGame.renderer.ufoBulletRenderer = (function(graphics) {
	'use strict';

	//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

	function drawUfoBullets(spec) {
		let bullets = spec.bullets;

		Object.getOwnPropertyNames(bullets).forEach(val => {
			let curBullet = bullets[val];
			graphics.drawNonRotate(spec.image, curBullet.center, spec.drawSize)

		});
	}

	return {
		drawUfoBullets: drawUfoBullets
	}

}(MyGame.graphics));