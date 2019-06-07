

MyGame.main = (function(graphics, keyboard){
	'use strict';
	let startButton;
	let lastTimestamp = performance.now();
	let run = true;
	let board;
	let obstacles = 15;
	let drawSquares = [];
	let drawApple;
	let highScore = [];
	let worm;
	let moveRate = 50;
	let timeLeft = moveRate;

	function handleInput(){

		if(board.hasOwnProperty("q")){
			exit();
		}else if(board.hasOwnProperty("ArrowUp") && worm.getDir() !== "D"){
			worm.setDir("U");
		}else if(board.hasOwnProperty("ArrowDown") && worm.getDir() !== "U"){
			worm.setDir("D");
		}else if(board.hasOwnProperty("ArrowRight") && worm.getDir() !== "L"){
			worm.setDir("R");
		}else if(board.hasOwnProperty("ArrowLeft") && worm.getDir() !== "R"){
			worm.setDir("L")
		}
	}

	function update(elapsedTime) {
		if(isNaN(timeLeft)){
			timeLeft = moveRate;
		}
		let score = document.getElementById("curScore");
		if(score){
			score.innerText = worm.getLength();
		}
		timeLeft -= elapsedTime;
		if(timeLeft < 0){
			timeLeft = moveRate - timeLeft;
			if(worm.move()){
				exit();
			}
		}
	}

	function render() {
		graphics.clear();
		graphics.drawMainBoard();
		drawSquares.forEach(function(el){
			el.draw();
		})
		drawApple.draw();
		worm.drawAll();
	}

	function initialize() {
		drawSquares = [];
		graphics.eraseSquares();
		run = true;
		startButton.onclick = null;
		board = keyboard();
		for(var i = 0; i < obstacles; ++i){
			drawSquares.push(graphics.generateSquare({
				color: 'rgba(155,0,0,1)'
			}));
		}
		drawApple = graphics.generateApple({
			color: 'rgba(191, 255, 0, 1)'
		});

		worm = graphics.generateWorm({
			color: 'rgba(192, 0, 255, 1)',
		});

		gameloop();
	}

	function gameloop(time){
		let elapsedTime = time - lastTimestamp;
		lastTimestamp = time;

		handleInput();
		update(elapsedTime);
		render();

		if(run){
			requestAnimationFrame(gameloop);
		}
	}

	function fillHighScores(){
		highScore.sort(function(a,b){
			return b - a;
		});
		if(highScore[0]){
			document.getElementById("one").innerText = highScore[0];
		}
		if(highScore[1]){
			document.getElementById("two").innerText = highScore[1];
		}
		if(highScore[2]){
			document.getElementById("three").innerText = highScore[2];
		}
		if(highScore[3]){
			document.getElementById("four").innerText = highScore[3];
		}
		if(highScore[4]){
			document.getElementById("five").innerText = highScore[4];
		}
	}

	function exit(){
		alert('You Lost!');
		highScore.push(worm.getLength());
		fillHighScores();
		startButton.onclick = initialize;
		run = false;
	}

	//keyboard.register('q', exit);
	startButton = document.getElementById("startButton");
	startButton.onclick = initialize();

}(MyGame.graphics, MyGame.Keyboard));