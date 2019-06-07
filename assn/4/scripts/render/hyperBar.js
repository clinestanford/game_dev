

MyGame.renderer.hyperBar = (function(graphics) {
	'use strict';

	let associatedTextLength = 0;

	function renderBar(spec) {
		graphics.drawHyperRect(spec, associatedTextLength, spec.offset_y, spec.width, spec.height);
	}

	function setAssociatedTextVals(spec) {
		associatedTextLength = graphics.context.measureText(spec.associatedText.text).width;
	}

	return {
		setAssociatedTextVals: setAssociatedTextVals,
		renderBar: renderBar,
	}

}(MyGame.graphics));