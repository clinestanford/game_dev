
MyGame.render.texture = (function(graphics) {

	function fillBackground(spec) {
		let sqwidth = graphics.canvas.width / spec.size;
		let sqheight = graphics.canvas.height / spec.size;
		let size = {
			width: sqwidth,
			height: sqheight
		}
		// for (let i = 0; i < spec.size; ++i) {
		// 	for (let j = 0; j < spec.size; ++j) {
		// 		center = {
		// 			x: i * sqwidth,// + (sqwidth / 2),
		// 			y: j * sqheight// + (sqheight / 2)
		// 		}
		// 		graphics.drawTexture(spec.image, center, size);
		// 	}
		// }
		graphics.drawTexture(spec.image, {x:0,y:0}, {width: graphics.canvas.width, height: graphics.canvas.height});
	}

	return {
		fillBackground: fillBackground
	}

}(MyGame.graphics));