
MyGame.graphics = (function() {
	'use strict';

	let canvas = document.getElementById('id-canvas');
	let context = canvas.getContext('2d');
	let sqWidth = canvas.width/50;
	let sqHeight = canvas.height/50;

	function clear() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	function drawMainBoard() {
		context.fillStyle = 'rgba(255, 0, 0, 1)';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = 'rgba(0, 0, 255, 1)';
		context.fillRect(sqWidth, sqHeight, canvas.width - (sqWidth * 2), canvas.height - (sqHeight * 2));
	}

	function simpleSquare(spec){
		function draw(){
			context.fillStyle = spec.color;
			context.fillRect(spec.center.x, spec.center.y, sqWidth, sqHeight);
			context.strokeStyle = 'rgba(0, 0, 0, 1)';
			context.lineWidth = 2;
			context.strokeRect(
				spec.center.x, spec.center.y,
				sqWidth, sqHeight);
		}

		return {
			draw:draw
		}
	}

	function square(spec) {
		function grow(){
			spec.elementsToAdd += 300;
		}

		function getCrashed(){
			if(spec.center.x < sqWidth || spec.center.x > canvas.width - sqWidth * 2){
				return true;
			}else if(spec.center.y < sqHeight || spec.center.y > canvas.height - sqHeight * 2){
				return true;
			}
			for(var i = 3; i < spec.rest.length; ++i){
				if(spec.center.x === spec.rest[i].x && spec.center.y === spec.rest[i].y){
					return true;
				}
			}
			return false;
		}

		function getXandY(){
			return {x: spec.center.x, y:spec.center.y};
		}

		function getDir(){
			return spec.direction;
		}

		function setDir(dir){
			spec.direction = dir;
		}

		function getSegments(){
			return spec.rest;
		}

		function move() {
			if(spec.direction === "L"){
				spec.center.x -= sqWidth;
			}else if(spec.direction === "R"){
				spec.center.x += sqWidth;
			}else if(spec.direction === "U"){
				spec.center.y -= sqHeight;
			}else if(spec.direction === "D"){
				spec.center.y += sqHeight;
			}
			spec.rest.unshift({x: spec.center.x, y: spec.center.y});
			if(spec.elementsToAdd > 0){
				spec.elementsToAdd -= 1;
			} else {
				spec.rest.pop();
			}
		}

		function drawElement(coord, color){
			context.fillStyle = spec.color;
			context.fillRect(coord.x, coord.y, sqWidth, sqHeight);
			context.strokeStyle = 'rgba(0, 0, 0, 1)';
			context.lineWidth = 2;
			context.strokeRect(
				coord.x, coord.y,
				sqWidth, sqHeight);
		}

		function draw() {
			for(var i = 0; i < spec.rest.length; ++i){
				drawElement(spec.rest[i], spec.color);
			}
		}

		function initialize(){
			spec.rest.unshift(spec.center);
		}

		return {
			move: move,
			draw: draw,
			setDir: setDir,
			getDir: getDir,
			getXandY: getXandY,
			getCrashed: getCrashed,
			grow: grow,
			initialize: initialize,
			getSegments: getSegments
		}
	}

	function Texture(spec) {
		let ready = false;
		let image = new Image();
		image.onLoad = function() {
			ready = true;
		}
		image.src = spec.imageSrc;

		function draw() {
			if (ready) {

			}
		}
	}

	let api = {
		clear: clear,
		drawMainBoard: drawMainBoard,
		square: square,
		simpleSquare: simpleSquare
	}

	Object.defineProperty(api, 'canvas', {
		value: canvas,
		writeable: false,
		enumerable: true,
		configurable: false,
	});

	Object.defineProperty(api, 'context', {
		value: context,
		writeable: false,
		enumerable: true,
		configurable: false,
	});

	return api;
}());
