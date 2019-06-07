

MyGame.graphics = (function() {
	'use strict';

	let canvas = document.getElementById('gameCanvas');
	let context = canvas.getContext('2d');
	let hyperWidth;
	let hangFromTop; 

	let toWidth = window.innerWidth;
	let toHeight = window.innerHeight;

	canvas.width = toWidth * .9;

	window.addEventListener('resize', () => {
		let toWidth = window.innerWidth;
		canvas.width = toWidth * .9;
	}, false);

	function clear() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	function drawObject (img, center, rotation, size) {
		context.save();

		context.translate(center.x, center.y);
		context.rotate(rotation);
		context.translate(-center.x, -center.y);

		context.drawImage(
			img, 
			center.x - size.width / 2, 
			center.y - size.height / 2,
			size.width, size.height);

		context.restore();
	}

	function drawText(spec) {

		context.fillStyle = spec.fillStyle;
		context.strokeStyle = spec.strokeStyle;
		context.fillText(spec.text, spec.position.x, spec.position.y);
		context.strokeText(spec.text, spec.position.x, spec.position.y);
	}

	function drawTextOffset(spec, xDis) {
		context.fillStyle = spec.fillStyle;
		context.strokeStyle = spec.strokeStyle;
		context.fillText(spec.text, xDis, spec.position.y);
		context.strokeText(spec.text, xDis, spec.position.y);
	}

	function drawHyperRect(spec, offset_x, offset_y, width, height) {
		context.strokeStyle = 'rgba(255,0,0,1)';
		context.strokeRect(canvas.width / 2 + offset_x + 10, offset_y, width, height);
		context.fillStyle = 'red';
		context.fillRect(canvas.width / 2 + offset_x + 12, offset_y + 2, spec.fillPercentage * (width - 4), height - 4);
	}

	function drawNonRotate (img, center, size) {

		context.drawImage(
			img, 
			center.x, 
			center.y,
			size.width, 
			size.height);
	}

	function drawAnimatedOrb (rotation, image, sx, sy, sWidth, sHeight, center, size) {
		context.save();

		context.translate(center.x, center.y);
		context.rotate(rotation);
		context.translate(-center.x, -center.y);

		context.drawImage(
			image,
			sx,
			sy,
			sWidth,
			sHeight,
			center.x,
			center.y,
			size.width,
			size.height);

		context.restore();	
	}

	//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
	function drawAnimatedSprite (rotation, image, sx, sy, sWidth, sHeight, center, size) {
		context.save();

		context.translate(center.x, center.y);
		context.rotate(rotation);
		context.translate(-center.x, -center.y);

		context.drawImage(
			image,
			sx,
			sy,
			sWidth,
			sHeight,
			center.x - size.width / 2,
			center.y - size.height / 2,
			size.width,
			size.height);
		
		context.restore();
	}

	function setTextParameters(spec) {
		context.font = spec.font;
		context.textBaseline = spec.location;

	}


	let api = {
		drawAnimatedOrb: drawAnimatedOrb,
		drawAnimatedSprite, drawAnimatedSprite,
		drawNonRotate: drawNonRotate,
		clear: clear,
		drawObject: drawObject,
		drawText: drawText,
		drawHyperRect: drawHyperRect,
		setTextParameters: setTextParameters,
		drawTextOffset: drawTextOffset
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