

MyGame.renderer.livesManager = (function(graphics) {
	'use strict';

	function renderLives(spec) {

		for(let i = 0; i < spec.lives; ++i) {
			if(spec.ready){
				graphics.drawNonRotate(spec.image, 
						{x: spec.position.x + i * spec.size.width,
						 y: spec.position.y},
						{width: spec.size.width, 
						 height: spec.size.height});
			}
		}
		
	}

	return {
		renderLives: renderLives,
	}

}(MyGame.graphics));