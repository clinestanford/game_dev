

MyGame.renderer.text = (function(graphics) {
	'use strict';

	function renderText(text) {
		graphics.drawText(text);
	}

	function renderOffset(text) {
		let textWidth = graphics.context.measureText(text.text).width;
		let xDis = graphics.canvas.width - textWidth - 20;
		graphics.drawTextOffset(text, xDis);
	}

	return {
		renderText: renderText,
		renderOffset: renderOffset
	}

}(MyGame.graphics));