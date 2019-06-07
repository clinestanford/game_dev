MyGame.main = (function(graphics) {
	'use strict';
	//endgame, dev. credit, highscores
	let lastTimeStamp = performance.now();
	let timeToNext = 500;
	let elapsedTime = 0;
	let obstacles = [];
	let run = true;
	let highscores = [];
	let drawObstacles = [];
	let startBut = document.getElementById("startButton");
	let apple;
	let drawApple;
	let moveRate = 50;
	let myWorm = {};
	let initialWorm = {
		'center': {x: 0, y: 0},
		'rest': [],
		'color': 'rgba(255,255,255,1)',
		'direction': "N",
		'elementsToAdd': 0,
		'totalElements': 1,
		'elapsedTime': moveRate
	}

	function onKeyDown(e){
		if(e.keyCode === KeyEvent.DOM_VK_RIGHT && myWorm.getDir() !== "L"){
			myWorm.setDir("R");
		}else if(e.keyCode === KeyEvent.DOM_VK_LEFT && myWorm.getDir() !== "R"){
			myWorm.setDir("L");
		}else if(e.keyCode === KeyEvent.DOM_VK_UP && myWorm.getDir() !== "D"){
			myWorm.setDir("U");
		}else if(e.keyCode === KeyEvent.DOM_VK_DOWN && myWorm.getDir() !== "U"){
			myWorm.setDir("D");
		}
	}

	function checkCollision(coord){
		for(var i = 0; i < obstacles.length; ++i){
			if(obstacles[i].x === Math.round(coord.x/10) && obstacles[i].y === Math.round(coord.y/10)){
				return true;
			}
		}
		return false
	}

	function checkApple(coord, apple){
		if(Math.round(coord.x/10) === apple.x && Math.round(coord.y/10) === apple.y){
			return true;
		}
		return false;
	}

	function endgame(){
		highscores.push(myWorm.getSegments().length);
		highscores.sort();
		obstacles = [];
		graphics.clear();
		startBut.onclick = initialize;
	}

	function update(elapsedTime) {
		if(isNaN(timeToNext)){
			timeToNext = moveRate;
		}
		timeToNext = timeToNext - elapsedTime;
		if(timeToNext < 0){
			timeToNext = moveRate - timeToNext;
			myWorm.move();
			let coord = myWorm.getXandY();
			if(checkCollision(coord)){
				run = false;
				endgame();
			}else if(myWorm.getCrashed()){
				run = false;
				endgame();
			}else if(checkApple(coord, apple)){
				var temp = obstacles.concat(myWorm.getSegments);
				apple = getCleanSquare(temp);
				drawApple = graphics.simpleSquare({'center': {x: apple.x * 10, y: apple.y * 10}, 'color': 'rgba(255,0,255,1)'});
				myWorm.grow();
			}

		}
	}

	function render() {
		graphics.clear();
		graphics.drawMainBoard();
		drawObstacles.forEach(function(el) {
			el.draw();
		})
		drawApple.draw();
		myWorm.draw();

	}

	function generateRandomPoint(){
		let x = Math.floor(Math.random() * 48) + 1;
		let y = Math.floor(Math.random() * 48) + 1;
		return {x: x, y: y}
	}

	function checkPt(pt, obstacles){
		obstacles.forEach(function(el) {
			if(pt.x === el.x && pt.y === el.y){
				true;
			}
		})
		return false;
	}

	function getCleanSquare(obstacles) {
		let pt = generateRandomPoint();
		while(checkPt(pt, obstacles)){
			pt = generateRandomPoint();
		}
		return pt;
	}

	function initialize(){
		for(var i = 0; i < 15; ++i){
			let pt = getCleanSquare(obstacles);
			obstacles.push(pt);
			drawObstacles.push(graphics.simpleSquare({'center': {x: pt.x * 10, y: pt.y * 10}, 'color': 'rgba(255,255,0,1)'}));
		}
		apple = getCleanSquare(obstacles);
		drawApple = graphics.simpleSquare({'center': {x: apple.x * 10, y: apple.y * 10}, 'color': 'rgba(255,0,255,1)'});
		obstacles.push(apple);
		let wormStart = getCleanSquare(obstacles);
		obstacles.pop();
		initialWorm.center = {x: wormStart.x * 10, y: wormStart.y * 10};
		myWorm = graphics.square(initialWorm);
		myWorm.initialize();
		startBut.onclick = null;
		
		gameLoop();
	}

	function gameLoop(time) {
		elapsedTime = time - lastTimeStamp;
		lastTimeStamp = time;
		update(elapsedTime);
		render();
		if(run){
			requestAnimationFrame(gameLoop);
		}
	}



	window.addEventListener('keydown', onKeyDown);
	initialize();
}(MyGame.graphics));