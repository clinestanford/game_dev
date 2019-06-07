
/*
this is where the game logic will 
be controlled and called
*/

MyGame.screens.gameplay = (function(main, input, objects, graphics, renderer, persist) {
	'use strict';

	let lastTimeStamp;
	let paused;
	let running;
	let keyboard;
	let fuelText;
	let speedText;
	let angleText;
	let scoreText;
	let winText;
	let loseText;
	let restartText;
	let surface;
	let GRAVITY =  0.000000025;
	let cwidth = graphics.canvas.width;
	let cheight = graphics.canvas.height;
	let lander;
	let hasWon;
	let hasLost;
	let particleSystem;

	function initializeAllElements() {
		keyboard = input.keyboard();
		hasLost = false;
		hasWon = false;
		running = true;
		paused = false;
		lastTimeStamp = performance.now();
		graphics.setTextParameters({font: "15pt Arial", location: "top"});

		//position: {x: graphics.context.measureText(livesText.text).width + 20, y: hangFromTop},
		winText = objects.text({
			position: {x: cwidth/2 - graphics.context.measureText('Safe Landing!!').width/2, y: cheight/2},
			text: 'Safe Landing!!',
			fillStyle: 'rgba(255,255,255,1)',
			strokeStyle : 'rgba(255,255,255,1)',
		});

		restartText = objects.text({
			position: {x: cwidth/2 - graphics.context.measureText("Press 'R' to Restart").width/2, y: cheight/2 + 40},
			text: "Press 'R' to Restart",
			fillStyle: 'rgba(255,255,255,1)',
			strokeStyle : 'rgba(255,255,255,1)',
		});

		scoreText = objects.text({
			position: {x: cwidth/2 - graphics.context.measureText("Your Score: 00.000").width/2, y: cheight/2 + 20},
			text: "Press 'R' to Restart",
			fillStyle: 'rgba(255,255,255,1)',
			strokeStyle : 'rgba(0,255,0,1)',
			cwidth: cwidth,
			context: graphics.context
		});

		loseText = objects.text({
			position: {x: cwidth/2 - graphics.context.measureText('Better Luck Next Time').width/2, y: cheight/2},
			text: 'Better Luck Next Time',
			fillStyle: 'rgba(255,255,255,1)',
			strokeStyle : 'rgba(255,255,255,1)',
		});

		fuelText = objects.text({
			position: {x: cwidth - 150, y: 30},
			initFuel: 20,
			text: 'fuel : 20 s',
			fillStyle: 'rgba(0,0,0,0)',
			strokeStyle : 'rgba(0,255,0,1)',
		});

		speedText = objects.text({
			position: {x: cwidth - 150, y: 50},
			initFuel: 20,
			text: 'speed : 20 m/s',
			fillStyle: 'rgba(0,0,0,0)',
			strokeStyle : 'rgba(0,255,0,1)',
		});

		angleText = objects.text({
			position: {x: cwidth - 150, y: 70},
			initFuel: 20,
			text: 'angle : 270 deg.',
			fillStyle: 'rgba(0,0,0,0)',
			strokeStyle : 'rgba(255,255,255,1)',
		});

		surface = objects.surface({
			surface : [
		     { x: 0.00, y: 0.00, safe: false },
		     { x: 0.25, y: 0.25, safe: false },
		     { x: 0.40, y: 0.10, safe: true },
		     { x: 0.70, y: 0.10, safe: true },
		     { x: 0.80, y: 0.45, safe: false },
		     { x: 1.00, y: 0.00, safe: false },
		 	],
		 	cwidth: cwidth,
		 	cheight: cheight,
		 	fillStyle: 'rgba(50,50,255,1)'}
		);

		particleSystem = objects.particleSystem({
			smoke1: 'assets/smoke.png',
			smoke2: 'assets/smoke-2.png',
			fire: 'assets/fire.png',
			lifetime: {mean: 2000, stdev: 500},
			speed: {mean: 0.3, stdev: .05},
			cwidth: cwidth,
			cheight: cheight
		});

		lander = objects.lunarLander({
			src: 'assets/lander-4.png',
			cwidth: cwidth,
			cheight: cheight,
		    center: { x: 0.25, y: 0.90 }, // world coordinates
		    size: { width: 0.05, height: 0.05 }, // world units
		    rotation: 3 * (Math.PI / 2), // radians
		    rotateRate: 0.0015, // radians per millisecond
		    thrustRate: 0.00000005,  // world units per millisecond of acceleration
		    fuel: 20000, // milliseconds of thrust
		    fuelText: fuelText.setFuelText,
		    angleText: angleText.setAngleText,
		    speedText: speedText.setSpeedText,
		    scoreText: scoreText,
		    isSafe: surface.isSafe,
		    safeRegion: surface.safeRegion,
		    setColor: speedText.setStrokeStyle,
		    win: win,
		    lose: lose,
		    onCrash: particleSystem.onCrash,
		    onThrust: particleSystem.onThrust
		 });

		keyboard.register('q', quit);
		keyboard.register('Escape', showMain);
		keyboard.register('ArrowRight', lander.turnRight);
		keyboard.register('ArrowLeft', lander.turnLeft);
		keyboard.register('ArrowUp', lander.thrust);
		keyboard.register('p', pause);
		keyboard.register('r', restart);
		window.requestAnimationFrame(gameloop);
	}

	function showMain() {
		quit();
		initialize();
	}

	function restart() {
		running = false;
		setTimeout(run, .5);
	}

	function pause() {
		if(paused) {
			paused = false;
		} else {
			paused = true;
		}
	}

	function processInput(elapsedTime) {

	}

	function deregister() {
		keyboard.deregister('ArrowUp');
		keyboard.deregister('ArrowRight');
		keyboard.deregister('ArrowLeft');
	}

	function win(){
		deregister();
		persist.add(Math.floor(lander.fuel) / 1000);
		hasWon = true;
	}

	function lose(){
		deregister();
		hasLost = true;
	}

	function update(elapsedTime) {
		keyboard.update(elapsedTime);
		if(!paused){
			lander.update(elapsedTime);	
		}
		particleSystem.update(elapsedTime);
	}


	function render(elapsedTime) {
		graphics.clear();
		graphics.drawSurface(surface.surface, surface.fillStyle);
		graphics.traceLand(surface.surface);
		renderer.text.renderText(fuelText);
		renderer.text.renderText(speedText);
		renderer.text.renderText(angleText);	
		if(lander.alive){
			renderer.landerRenderer.drawLander(lander);
		}
		if(hasWon){
			renderer.text.renderText(winText);
			renderer.text.renderText(restartText);
			renderer.text.renderText(scoreText);
		}else if(hasLost){
			renderer.text.renderText(loseText);
			renderer.text.renderText(restartText);
		}
		graphics.renderFireBalls(particleSystem.fire, particleSystem.fireballs);
		graphics.renderFireBalls(particleSystem.smoke1, particleSystem.smoke1Balls);
		graphics.renderFireBalls(particleSystem.smoke2, particleSystem.smoke2Balls);
	}

	function gameloop(time) {

		let elapsedTime = time - lastTimeStamp;
		lastTimeStamp = time;

		processInput(elapsedTime);
		update(elapsedTime);
		render(elapsedTime);

		if(running){
			requestAnimationFrame(gameloop);
		} else {
			quit();
		}
	}

	function initialize() {
		main.showScreen('mainmenu');
	}

	function run() {
		initializeAllElements();
	}

	return {
		initialize: initialize,
		run: run
	}

	function quit() {
		running = false;
	}

}(MyGame.main, MyGame.input, MyGame.objects, MyGame.graphics, MyGame.renderer, MyGame.persistence));