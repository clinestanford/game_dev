
MyGame.graphics = (function(){

	let canvas = document.getElementById("my-canvas");
	let context = canvas.getContext('2d');


	function clear() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	/*
	spec = {
		location: {row: , col: },
		'n': ,
		'e': ,
		's': ,
		'w': 
	}

	*/
	function drawLine (start, end) {
		//context.beginPath();
		context.moveTo(start.x, start.y);
		context.lineTo(end.x, end.y);
		context.closePath();
		//context.stroke();
	}

	function drawSquare(spec, width, height, size) {
		context.lineWidth = 3;

		if(spec.edges.n === null) {
			drawLine({x: spec.x * width        , y: spec.y * height},
					 {x: spec.x * width + width, y: spec.y * height});
		}
		if(spec.edges.e === null) {
			drawLine({x: spec.x * width + width, y: spec.y * height         },
					 {x: spec.x * width + width, y: spec.y * height + height});
		}
		if(spec.edges.s === null) {
			drawLine({x: spec.x * width        , y: spec.y * height + height},
					 {x: spec.x * width + width, y: spec.y * height + height});
		}
		if(spec.edges.w === null) {
			drawLine({x: spec.x * width, y: spec.y * height         },
					 {x: spec.x * width, y: spec.y * height + height});
		}
		//draw start and finish
		if(spec.x === 0 && spec.y === 0) {
			context.fillStyle = 'rgba(0, 255, 0, .3)';
			context.fillRect(spec.x, spec.y, width, height);
		}
		if(spec.x === size - 1 && spec.y === size - 1) {
			context.fillStyle = 'rgba(0, 0, 255, .5)';
			context.fillRect(spec.x * width, spec.y * height, width, height);
		}
	}

	function highlightSquare(square, width, height) {
		context.fillStyle = 'rgba(255,255,153,.5)';
		context.fillRect(square.x * width, square.y * height, width, height);
	}

	/*
	spec = {
		image,
		location: {x: , y: },
		size: {width: , height: }
	}
	*/

	function drawTexture(image, center, size) {
		context.drawImage(
			image,
			center.x,
			center.y,
			size.width,
			size.height);
	}

	function sprite(image, center, size) {
		context.drawImage(
			image,
			center.x * (canvas.width / size),
			center.y * (canvas.height / size),
			(canvas.width / size),
			(canvas.height / size));
	}

	let api = {
		sprite: sprite,
		clear: clear,
		drawSquare: drawSquare,
		drawTexture: drawTexture,
		highlightSquare: highlightSquare
	}

	Object.defineProperty(api, 'canvas',{
		value: canvas,
		writeable: false,
		enumerable: true,
		configurable: false
	});

	Object.defineProperty(api, 'context', {
		value: context,
		writeable: false,
		enumerable: true,
		configurable: false
	});

	return api;
}());