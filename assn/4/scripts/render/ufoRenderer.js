


MyGame.renderer.ufoRenderer = (function(graphics) {
	'use strict';

	//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

	function drawUfo(spec) {

		if(spec.ready && spec.isAlive) {
			let dims = 0;
			if(spec.type === 'lrg'){
				dims = spec.dims.lrgDim;
			} else {
				dims = spec.dims.smlDim;
			}

			graphics.drawAnimatedSprite(
				spec.rotation,
				spec.image,
				//sx 
				spec.curFrame * dims,
				//sy
				spec.dims[spec.type] + spec.sheetHeight * spec.lvlInPng,
				//sWidth
				dims,
				//sHeight
				dims,
				spec.center,
				{width: dims, height: dims}
				)
		}
	}

	return {
		drawUfo: drawUfo
	}

}(MyGame.graphics));