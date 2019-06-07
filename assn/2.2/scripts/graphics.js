
MyGame.graphics = (function(){
	'use strict';

	let canvas = document.getElementById("id-canvas");
	let context = canvas.getContext("2d");
	let sqWidth = canvas.width/50;
	let sqHeight = canvas.height/50;

	let obstacles = [];
	let segments = [];
	let apple;

	function clear(){
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	function drawMainBoard() {
		context.fillStyle = 'rgba(155, 0, 0, 1)';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = 'rgba(50, 50, 255, 1)';
		context.fillRect(sqWidth, sqHeight, canvas.width - (sqWidth * 2), canvas.height - (sqHeight * 2));
	}

	function generateRandomPoint(){
		let x = (Math.floor(Math.random() * 48) + 1) * 10;
		let y = (Math.floor(Math.random() * 48) + 1) * 10;
		return {x: x, y: y}
	}

	function checkSpec(pt, blockers){
		for(var i = 0; i < blockers.length; ++i){
			if(pt.x === blockers[i].x && pt.y === blockers[i].y){
				true;
			}
		}
		false;
	}

	function generateCenter(blockers){
		let pt = generateRandomPoint();
		while(checkSpec(pt, blockers)){
			pt = generateRandomPoint();
		}
		return pt;
	}

	function checkObstacles(center, worm){
		for(var i = 0; i < obstacles.length; ++i){
			if(center.x === obstacles[i].x && center.y === obstacles[i].y){
				return true;
			}
		}
		if(center.x > canvas.width - sqWidth * 2 || center.x < sqWidth){
			return true;
		}else if(center.y > canvas.height - sqHeight * 2 || center.y < sqHeight){
			return true;
		}else if(worm.length > 0){
			for(var i = 0; i < worm.length; ++i){
				if(center.x === worm[i].x && center.y === worm[i].y){
					return true;
				}
			}
		}
		return false;
	}

	function checkApples(center){
		if(center.x === apple.x && center.y === apple.y){
			apple = generateCenter(obstacles.concat(segments));
			return true;
		}
		return false;
	}

	/*
	spec = {
		color: rgba(0,0,0,1),
		'moveRate': rate
		'direction': "N",
	}
	*/

	function generateWorm(spec){
		spec.center = generateCenter(obstacles.concat(apple));
		spec.elementsToAdd = 0;
		spec.direction = null;
		spec.worm = [];

		function draw(center){
			context.fillStyle = spec.color;
			context.fillRect(center.x, center.y, sqWidth, sqHeight);
			context.strokeStyle = 'rgba(0, 0, 0, 1)';
			context.lineWidth = 2;
			context.strokeRect(
				center.x, center.y,
				sqWidth, sqHeight);
		}

		function drawAll(){
			draw(spec.center);
			spec.worm.forEach(function(segment){

				draw({
					x: segment.x,
					y: segment.y
				});
			});
		}

		function move(){
			if(spec.direction === 'U'){
				spec.center.y -= 10;
			}else if(spec.direction === 'D'){
				spec.center.y += 10;
			}else if(spec.direction === 'L'){
				spec.center.x -= 10;
			}else if(spec.direction === 'R'){
				spec.center.x += 10;
			}
			if(checkObstacles(spec.center, spec.worm)){
				return true;
			}
			if(checkApples(spec.center)){
				if(spec.worm.length === 0){
					spec.elementsToAdd += 4;
				} else {
					spec.elementsToAdd += 3;
				}
			}
			spec.worm.unshift({x: spec.center.x, y: spec.center.y});
			if(spec.elementsToAdd > 0){
				spec.elementsToAdd -= 1;
			} else {
				spec.worm.pop();
			}
			segments = spec.worm;
		}

		function setDir(dir){
			spec.direction = dir;
		}

		function getDir(){
			return spec.direction;
		}

		function getLength(){
			return spec.worm.length;
		}

		return {
			getDir: getDir,
			setDir: setDir,
			getLength: getLength,
			move: move,
			drawAll: drawAll
		}
	}

	/*
	spec = {
		color: rgba(0,0,0,1)
	}
	*/
	function generateSquare(spec){
		
		spec.center = generateCenter(obstacles);
		obstacles.unshift(spec.center);

		if(obstacles.length > 15){
			obstacles.pop();
		}

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
			draw: draw
		}
	}

	/*
	spec = {
		color: rgba(0,0,0,1)
	}
	*/
	function generateApple(spec){
		spec.center = generateCenter(obstacles);
		apple = {x: spec.center.x, y: spec.center.y};

		function draw(){
			spec.center.x = apple.x;
			spec.center.y = apple.y;
			context.fillStyle = spec.color;
			context.fillRect(spec.center.x, spec.center.y, sqWidth, sqHeight);
			context.strokeStyle = 'rgba(0, 0, 0, 1)';
			context.lineWidth = 2;
			context.strokeRect(
				spec.center.x, spec.center.y,
				sqWidth, sqHeight);
		}

		return {
			draw: draw
		}
	}

	function eraseSquares(){
		obstacles = [];
	}

	let api = {
		clear: clear,
		drawMainBoard: drawMainBoard,
		generateSquare: generateSquare,
		generateApple: generateApple,
		generateWorm: generateWorm,
		eraseSquares: eraseSquares
	}

	Object.defineProperty(api, 'canvas', {
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