


MyGame.graphics = (function () {
	'use strict';

	let canvas = document.getElementById('game');
	let context = canvas.getContext('2d');

	let toWidth = window.innerWidth;
	let toHeight = window.innerHeight;

	canvas.width = toWidth * .95;

	console.log(canvas.width, canvas.height);

	function clear() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	function saveContext() {
		context.save();
	}

	function restoreContext() {
		context.restore();
	}

	function setTextParameters(spec) {
		context.font = spec.font;
		context.textBaseline = spec.location;
	}

	function rotateCanvas(position, rotation){
		context.translate(position.x * canvas.width, position.y * canvas.height);
		context.rotate(rotation);
		context.translate(-position.x * canvas.width, -position.y * canvas.height);
	}

	function drawAnimated (rotation, image, sx, sy, sWidth, sHeight, center, size) {
		//console.log(rotation, image, sx, sy, sWidth, sHeight, center, size);
		let localCenter = {
			x: center.x * canvas.width,
			y: center.y * canvas.height
		}

		let localSize = {
			width: size.width * canvas.width,
			height: size.height * canvas.height
		}

		saveContext();


		rotateCanvas(center, rotation);

		context.drawImage(
			image,
			sx,
			sy,
			sWidth,
			sHeight,
			localCenter.x - localSize.width / 2,
			localCenter.y - localSize.height / 2,
			localSize.width,
			localSize.height);
		
		restoreContext();
	}


	//this function takes coordinates in the local window [0,1]
	function drawImage(asset, center, rotation, size){

		let localCenter = {
			x: center.x * canvas.width,
			y: center.y * canvas.height
		}

		let localSize = {
			width: size.width * canvas.width,
			height: size.height * canvas.height
		}

		// console.log(localCenter, localSize);

		saveContext();
		rotateCanvas(center, rotation);
		context.drawImage(asset,
			localCenter.x - localSize.width/2,
			localCenter.y - localSize.height/2,
			localSize.width,
			localSize.height);
		restoreContext();
	}

	function drawSimple(asset, center, size){
		context.drawImage(
			asset,
			(center.x - size.width/2) * canvas.width,
			(center.y - size.height/2) * canvas.height,
			size.width * canvas.width,
			size.height * canvas.height);
	}

	function drawNonRotate(asset, center, size, sx, sy, swidth, sheight) {
		let localCenter = {
			x: center.x * canvas.width,
			y: center.y * canvas.height
		}

		let localSize = {
			width: size.width * canvas.width,
			height: size.height * canvas.height
		}

		context.drawImage(
			asset,
			sx, sy,
			swidth, sheight,
			localCenter.x - localSize.width/2,
			localCenter.y - localSize.height/2,
			localSize.width,
			localSize.height);
	}

	function drawScreenPortion(img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
		if(img){
			context.drawImage(img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);	
		}
	}

	function drawMiniMap(windowManager, playerSelf, playerOthers, asteroids, powerUps, ufo) {
		
		let mini = {
			x: 20,
			y: canvas.height - 120,
			width: 200,
			height: 100
		}

		let x_units = mini.width / 8;
		let y_units = mini.height / 4;

		context.lineWidth = 2;
		context.strokeStyle = 'blue';
		context.strokeRect(mini.x, mini.y, mini.width, mini.height);
		context.strokeStyle = '#726f08';
		context.strokeRect(mini.x + windowManager.viewport.x * x_units, mini.y + windowManager.viewport.y * y_units, x_units, y_units);
		//minimap players
		context.strokeStyle = '#098709';
		context.strokeRect(mini.x + playerSelf.model.position.x * x_units, mini.y + playerSelf.model.position.y * y_units, 2,2);
		for(let playerId in playerOthers){
			let curPlayer = playerOthers[playerId];
			context.strokeRect(mini.x + curPlayer.model.state.position.x * x_units, mini.y + curPlayer.model.state.position.y * y_units, 2, 2);
		}
		//minimap asteroids
		context.strokeStyle = 'red';
		for(let asteroidId in asteroids){
			let curAst = asteroids[asteroidId];
			//console.log(curAst.position.x * x_units);
			context.strokeRect(mini.x + curAst.position.x * x_units - 1, mini.y + curAst.position.y * y_units - 1, 2, 2);
		}
		if(ufo){
			context.strokeStyle = 'black';
			context.strokeRect(mini.x + ufo.position.x * x_units - 1, mini.y + ufo.position.y * y_units - 1, 2, 2);
		}
		//minimap powerUps
		context.strokeStyle = 'blue';
		for(let powerId in powerUps){
			let curPower = powerUps[powerId];
			context.strokeRect(mini.x + curPower.position.x * x_units - 1, mini.y + curPower.position.y * y_units - 1, 2, 2);	
		}
	}

	function drawHyperRect(spec, offset_x, offset_y, width, height) {
		context.strokeStyle = 'rgba(255,0,0,1)';
		context.strokeRect(offset_x, offset_y, width, height);
		context.fillStyle = 'red';
		context.fillRect(offset_x + 4, offset_y + 4, spec.fillPercentage * (width - 8), height - 8);
	}

	function drawText(spec) {
		context.fillStyle = spec.fillStyle;
		context.strokeStyle = spec.strokeStyle;
		context.fillText(spec.text, spec.position.x, spec.position.y);
		context.strokeText(spec.text, spec.position.x, spec.position.y);
	}

	let api = {
		drawHyperRect: drawHyperRect,
		drawText: drawText,
		drawSimple: drawSimple,
		drawMiniMap: drawMiniMap,
		drawNonRotate: drawNonRotate,
		drawScreenPortion: drawScreenPortion,
		clear: clear,
		drawImage: drawImage,
		drawAnimated: drawAnimated,
		setTextParameters: setTextParameters
	}

	Object.defineProperty(api, 'canvas', {
		value: canvas,
		writeable: false,
		enumerable: true,
		configureable: false
	});

	Object.defineProperty(api, 'context', {
		value: context,
		writeable: false,
		enumerable: true,
		configureable: false
	});

	return api;

}());
