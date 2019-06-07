

//TODO
//manage stack that leads to exit
//

MyGame.main = (function (objects, input, renderer, graphics){

	let lastTimeStamp = performance.now();
	let running = true;
	let keyboard = input.Keyboard();
	let sprite; 
	let board;
	let size = 5; //do not hard code this value
	let background;
	let showPath = false;
	let showHint = false;
	let time = 0;
	let docScore = document.getElementById("showScore");
	let docTime = document.getElementById("showTime");
	let highscores = [];
	let startButton = document.getElementById("startButton");
	let start = true;

	function getSize() {
		if(document.getElementById("fivexfive").checked){
			return 5;
		}else if(document.getElementById("tenxten").checked){
			return 10;
		}else if(document.getElementById("fifteenxfifteen").checked){
			return 15;
		}else if(document.getElementById("twentyxtwenty").checked){
			return 100;
		} else {
			return 5;
		}
	}


	function initialize(){
		start = false;
		size = getSize();

		showPath = false;
		showHint = false;
		keyboard.clearAll();

		background = objects.texture({
			size: size,
			src: 'assets/background.png'
		});

		board = objects.maze({
			size: size,
			src: 'assets/halftone.png'
		})

		sprite = objects.sprite({
			src:   'assets/mouse.png',
			center: {x: 0, y: 0},
			size: size,
			maze: board.squares,
		});

		running = true;

		keyboard.register('b', board.toggleCrumb);
		keyboard.register('ArrowDown', sprite.moveDown);
		keyboard.register('ArrowUp', sprite.moveUp);
		keyboard.register('ArrowRight', sprite.moveRight);
		keyboard.register('ArrowLeft', sprite.moveLeft);

		gameLoop();
	}


	function fillHighScores(){
		highscores.sort(function(a,b){
			return b - a;
		});
		if(highscores[0]){
			document.getElementById("one").innerText = highscores[0];
		}
		if(highscores[1]){
			document.getElementById("two").innerText = highscores[1];
		}
		if(highscores[2]){
			document.getElementById("three").innerText = highscores[2];
		}
		if(highscores[3]){
			document.getElementById("four").innerText = highscores[3];
		}
		if(highscores[4]){
			document.getElementById("five").innerText = highscores[4];
		}
	}

	function endLoop(){
		highscores.push(sprite.score);
		fillHighScores();
		running = false;
	}

	function toggleShowPath() {
		if(showPath) {
			showPath = false;
		} else {
			showPath = true;
		}
	}

	function toggleShowHint() {
		if(showHint) {
			showHint = false;
		} else {
			showHint = true;
		}
	}

	function processInput(elapsedTime){
		
	}

	function update(elapsedTime){
		time -= elapsedTime;
		keyboard.update(elapsedTime);
	}

	function checkWin() {
		if(sprite.center.x === size - 1 && sprite.center.y === size - 1) {
			alert('you just beat the maze!!!');
			endLoop();
		}
	}

	function render(elapsedTime){
		graphics.clear();
		renderer.texture.fillBackground(background);
		renderer.maze.drawMaze(board);
		renderer.sprite.render(sprite);
		docScore.innerText = sprite.score;
		if(showPath) {
			renderer.maze.showPath(board, sprite.center);
		}
		if(showHint) {
			renderer.maze.showHint(board, sprite.center);
		}
		if (isNaN(time)){time = 0;}
		docTime.innerText = Math.floor(time / 1000);

		checkWin();
	}


	function gameLoop(time){
		let elapsedTime = lastTimeStamp - time;
		lastTimeStamp = time;

		processInput(elapsedTime);
		update(elapsedTime);
		render(elapsedTime);

		if(running){
			requestAnimationFrame(gameLoop);
		} 
	}


	keyboard.register('q', endLoop);
	keyboard.register('p', toggleShowPath);
	keyboard.register('h', toggleShowHint);

	

	startButton.onclick = initialize;

}(MyGame.objects, MyGame.input, MyGame.render, MyGame.graphics));