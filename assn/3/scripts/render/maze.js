


MyGame.render.maze = (function(graphics) {


	function drawMaze(spec) {
		let sqwidth = graphics.canvas.width / spec.size;
		let sqheight = graphics.canvas.height / spec.size;
		let squares = spec.squares;
		graphics.context.beginPath();
		for (let i = 0; i < spec.size; ++i) {
			for (let j = 0; j < spec.size; ++j ) {
				graphics.drawSquare(squares[i][j], sqwidth, sqheight, spec.size);
				if(spec.showCrumb && squares[i][j].visited === true) {
					graphics.sprite(spec.image, {x: j, y:i}, spec.size);
				}
			}
		}
		graphics.context.stroke();
	}

	function showPath(spec, center) {
		let squares = spec.squares;
		let curr = squares[center.y][center.x].parent;
		let sqwidth = graphics.canvas.width / spec.size;
		let sqheight = graphics.canvas.height / spec.size;

		if (curr === null) {

		} else {

		//if(curr.parent !== null) {
			while(!(curr.parent === null)) {
				graphics.highlightSquare(curr, sqwidth, sqheight);
				curr = curr.parent;
			}
		}

		
	}

	function showHint(spec, center) {
		let squares = spec.squares;
		let curr = squares[center.y][center.x].parent;
		let sqwidth = graphics.canvas.width / spec.size;
		let sqheight = graphics.canvas.height / spec.size;
		let curdepth = 0;

		if(curr === null) {

		} else {
			while(!(curr.parent === null) && curdepth < 3) {
				graphics.highlightSquare(curr, sqwidth, sqheight);
				curr = curr.parent;
				curdepth++;
			}
		}
	}

	return {
		drawMaze: drawMaze,
		showPath: showPath,
		showHint: showHint
	}

}(MyGame.graphics));