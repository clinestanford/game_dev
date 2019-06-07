


MyGame.renderer.spriteRenderer = (function(graphics) {
	'use strict';

	//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

	function drawSprite(spec) {
		if(spec.ready && !spec.dead) {
			graphics.drawAnimatedSprite(
				spec.rotation,
				spec.image,
				spec.frameWidth * spec.curFrame,
				0,
				spec.frameWidth,
				spec.frameHeight,
				spec.center,
				spec.size
				)
		}
	}

	function drawOrb(spec){
		if(spec.ready){
			Object.getOwnPropertyNames(spec.orbs).forEach(val => {
				let orb = spec.orbs[val];
				graphics.drawAnimatedOrb(
					orb.rotation,
					spec.image,
					spec.width * orb.curFrame,
					0,
					spec.width,
					spec.height,
					orb.center,
					spec.size);
			})	
		}
	}

	return {
		drawSprite: drawSprite,
		drawOrb: drawOrb
	}

}(MyGame.graphics));