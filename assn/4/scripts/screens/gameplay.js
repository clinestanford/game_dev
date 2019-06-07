
//TODO: keyboard, registering input w/ callback, persisting highscore
//TODO: particle system, collision detection


MyGame.screens['maingame'] = (function(input, game, sounds, objects, graphics, renderer, persistence, particles) {
	'use strict';
	let sprite;
	let orb;
	let asteroids;
	let keyboard;
	let lastTimeStamp = performance.now();
	let running = true;
	let cwidth = graphics.canvas.width;
	let cheight = graphics.canvas.height;
	let levels = [1,2,3,5,7,8,9,10,11,12,13,14,15,16];
	let curLevel = 0;
	let hangFromTop = 5;
	let hyperText;
	let textParameters;
	let hyperBar;
	let livesText;
	let livesManager;
	let scoreText;
	let levelText;
	let gameHeight = 25;
	let currentScore = 0;
	let internalScore = 0;
	let increment;
	let extraLifeScore = 30000;
	let ufo;
	let ufoBullets;
	let paused = false;
	let pauseText;

	function initialize() {
		
	}

	function initializeRun() {

		game.removeEscapeListener();

		textParameters = {
			font: "20pt Arial",
			location: 'top'
		}

		graphics.setTextParameters(textParameters);

		livesText = objects.text({
			position: {x: 10, y:hangFromTop},
			text: "LIVES:",
			fillStyle: 'rgba(0,0,0,0)',
			strokeStyle : 'rgba(255,0,0,1)',
		});

		scoreText = objects.text({
			position: {x: 10, y: cheight - 30},
			text: 'score: 0',
			fillStyle: 'rgba(0,0,0,0)',
			strokeStyle : 'rgba(255,0,0,1)',
		});

		levelText = objects.text({
			position: {x: cwidth - 50, y: cheight - 30},
			text: "level: " + curLevel,
			fillStyle: 'rgba(0,0,0,0)',
			strokeStyle : 'rgba(255,0,0,1)',
		})

		livesManager = objects.livesManager({
			lives: 3,
			src: 'assets/singleShip.png',
			position: {x: graphics.context.measureText(livesText.text).width + 20, y: hangFromTop},
			size: {width: gameHeight, height: gameHeight},
			maxLives: 7
		});

		pauseText = objects.text({
			text: 'PAUSED! Y => CONTINUE, N => QUIT',
			position: {x: (cwidth/2) - graphics.context.measureText('PAUSED! Y => CONTINUE, N => QUIT').width / 2, y: cheight/2},
			fillStyle: 'rgba(0,0,0,0)',
			strokeStyle : 'rgba(255,0,0,1)'
		})

		hyperText = objects.text({
			position: {x: cwidth / 2, y: hangFromTop},
			text: "HYPERSPACE",
			fillStyle: 'rgba(0,0,0,0)',
			strokeStyle: 'rgba(255,0,0,1)',
		});

		hyperBar = objects.hyperBar({
			sound: sounds.hyperSpace,
			position: {x: 50, y: 50},
			fillStyle: 'rgba(255,0,0,1)',
			strokeStyle: 'rgba(255,0,0,1)',
			percentPerSecond: .33,
			associatedText: hyperText,
			width: 100,
			offset_y: hangFromTop,
			height: gameHeight,
		});

		asteroids = objects.asteroid({
			src: 'assets/ships_asteroids.png',
			cwidth: cwidth,
			cheight: cheight,
			spacing: 200,
			rotMean: .05,
			rotStdev: .01,
			speedMean: 75,
			speedStdev: 50,
			smlscale: 2.0,
			medscale: 1.75,
			lrgscale: 1.33,
			row: 10,
		});

		ufoBullets = objects.ufoBullet({
			src: 'assets/new_bullet.png',
			lifetime: 2000,
			speed: 300,
			size: {width: 10, height: 10},
			drawSize: {width: 20, height: 20},
		});

		sprite = objects.AnimatedSprite({
			astObject: asteroids,
			src: 'assets/animatedShip.png',
			center: {x: cwidth/2, y: cheight/2},
			size: {width: 30, height: 50},
			rotation: 0,
			rotatePerTurn: 10,
			momentum: {x: 0, y: 0},
			movePerTurn: 5,
			cwidth: graphics.canvas.width,
			cheight: graphics.canvas.height,
			millisPerFrame: 160,
			curFrame: 0,
			numFrame: 4,
			frameWidth: 48,
			frameHeight: 80,
			momentumCap: 400,
			particles: particles,
		});

		ufo = objects.ufo({
			waitTime: 10,
			range: {min: -10, max: 10},
			src: 'assets/ships_saucer.png',
			center: {x: undefined, y: undefined},
			size: {width: 30, height: 30},
			rotation: 0,
			rotatePerTurn: 10,
			momentum: {x: 0, y: 0},
			movePerTurn: 5,
			cwidth: graphics.canvas.width,
			cheight: graphics.canvas.height,
			millisPerFrame: 160,
			curFrame: 0,
			numFrame: 4,
			lvlInPng: 0,
			dims: {
				lrg: 144,
				sml: 193,
				lrgDim: 48,
				smlDim: 32
			},
			fireRate: 1500,
			timeToNextFire: 0,
			fire: ufoBullets.ufoFireNew,
			momentumCap: 400,
			sound: sounds.ufoShot,
			sprite: sprite,
			type: 'lrg',
			sheetHeight: 224,
			rotating: .4
		});

		orb = objects.orb({
			src: 'assets/plasmaball.png',
			fireSound: sounds.orbShot,
			sprite: sprite,
			lifetime: 1500,
			frames: 4,
			millisPerFrame: 80,
			frameWidth: 64,
			frameHeight: 64,
			moveRate: 350,
			size: {width: 40, height: 40},
			cwidth: graphics.canvas.width,
			cheight: graphics.canvas.height,
			radius: 40,
		});

		renderer.hyperBar.setAssociatedTextVals(hyperBar);


		keyboard = input.keyboard(orb);
		keyboard.register('ArrowUp', sprite.moveForward);
		keyboard.register('ArrowLeft', sprite.turnLeft);
		keyboard.register('ArrowRight', sprite.turnRight);
		keyboard.register(' ', orb.createOrb);//on space should 'fire'
		keyboard.register('ArrowDown', hyperBar.reset);
		keyboard.register('q', quit);
		keyboard.register('z', hyperSpaceJump);
		keyboard.register('Escape', pause);

		running = true;

		gameloop();
	}

	function uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	// sound to level up
	// particle manager have the trail be left behind
	// figure out the safe location for respawning

	function proceed() {
		paused = false;
		keyboard.deregister('y');
		keyboard.deregister('n');
	}

	function pause() {
		paused = true;
		let newKeyboard = input.keyboard({}, 'notGame');
		newKeyboard.register('y', proceed);
		newKeyboard.register('n', quit);
	}

	function hyperSpaceJump() {
		sprite.jumpHyperSpace(hyperBar);
	}

	function processInput(elapsedTime) {

	}

	function checkOrbToAsteroid() {
		let removeMeOrb = [];
		let removeMeAst = [];
		let allOrbs = orb.orbs;
		let allAsteroids = asteroids.asteroids;
		Object.getOwnPropertyNames(allOrbs).forEach(val => {
			let curOrb = allOrbs[val];
			Object.getOwnPropertyNames(allAsteroids).forEach(ast => {
				let curAst = allAsteroids[ast];
				if(Math.sqrt((curOrb.center.x - curAst.center.x) ** 2 + (curOrb.center.y - curAst.center.y) ** 2) < curAst.radius / 2 + orb.size.width / 2){
					removeMeOrb.push(val);
					removeMeAst.push(ast);
					particles.systemManager.createAsteroidBreakup(curAst.center, curAst.size);
					if(curAst.size === 'lrg'){
						sounds.mainExplosion();
					} else {
						sounds.miniExplosion();
					}
				}
			});
			//check orb to ufo;
			if(Math.sqrt((curOrb.center.x - ufo.center.x) ** 2 + (curOrb.center.y - ufo.center.y) ** 2) < ufo.dims[ufo.type + 'Dim'] / 2 + orb.size.width / 2){
				sounds.ufoExplosion();
				particles.systemManager.createUFOExplosion(ufo.center.x, ufo.center.y);
				ufo.killUfo();
				removeMeOrb.push(val);
				currentScore += 600;
				scoreText.setText('score: ' + currentScore);

			}
		}); 

		for(let i = 0; i < removeMeOrb.length; ++i) {
			delete allOrbs[removeMeOrb[i]];
		}
		for(let j = 0; j < removeMeOrb.length; ++j) {
			let curAst = allAsteroids[removeMeAst[j]];
			if(curAst){
				increment = asteroids.brokenAsteroid(curAst.center, curAst.size);
				currentScore += increment;
				internalScore += increment;
				scoreText.setText('score: ' + currentScore);
				if(internalScore > extraLifeScore) {
					internalScore -= extraLifeScore;
					sounds.extraLife();
					livesManager.gainLife();
				}
			}
			delete allAsteroids[removeMeAst[j]];
		}
	}

	function shipHit() {

		sounds.spriteExplosion();
		particles.systemManager.createShipExplosion(sprite.center);
		livesManager.loseLife();
		sprite.spawnAgain();
		if(livesManager.lives > 0) {
			
		} else {
			quit();
		}
	}

	function checkSpriteToAsteroid() {
		let allAsteroids = asteroids.asteroids;
		let astKeys = Object.keys(allAsteroids);
		if(!sprite.dead){
			for(let i = 0; i < astKeys.length; ++i) {
				let curAst = allAsteroids[astKeys[i]];
				if(Math.sqrt((sprite.center.x - curAst.center.x) ** 2 + (sprite.center.y - curAst.center.y) ** 2) < curAst.radius) {
					shipHit();
					break;
				}
			}
		}
		let allBullets = ufoBullets.bullets;
		let bulKeys = Object.keys(allBullets);
		if(!sprite.dead) {
			for(let i = 0; i < bulKeys.length; ++i) {
				let curBul = allBullets[bulKeys[i]];
				if(Math.sqrt((sprite.center.x - curBul.center.x) ** 2 + (sprite.center.y - curBul.center.y) ** 2) < ufoBullets.drawSize.width) {
					shipHit();
					break;
				}
			}
		}
		if(!sprite.dead) {
			if(Math.sqrt((sprite.center.x - ufo.center.x) ** 2 + (sprite.center.y - ufo.center.y) ** 2) < ufo.dims[ufo.type+"Dim"] / 2) {
				shipHit();
			}
		}
	}

	function ufoHelper(){
		ufo.killUfo();
		if(curLevel > 4){
			ufo.setType('sml');
		}
	} 

	function levelUpHelper(elapsedTime) {
		sounds.levelup();
		asteroids.startLevel(levels[curLevel++], sprite.center);
		levelText.setText('level: ' + curLevel);
		orb.clearAll();
		ufoHelper();
	}

	function update(elapsedTime) {
		
		//checks to see if all asteroids are gone
		if(Object.keys(asteroids.asteroids).length === 0){
			levelUpHelper(elapsedTime);
		}
		keyboard.update(elapsedTime);
		sprite.update(elapsedTime);
		orb.update(elapsedTime);
		asteroids.update(elapsedTime);
		hyperBar.update(elapsedTime);
		checkOrbToAsteroid();
		checkSpriteToAsteroid();
		ufo.update(elapsedTime);
		ufoBullets.update(elapsedTime);
		particles.systemManager.update(elapsedTime);
	}

	function quit() {

		sounds.pauseSound('gamePlay');
		persistence.add(uuidv4(), currentScore);
		running = false;
		window.alert('You just got a score of ' + currentScore);
		game.showScreen('mainmenu');
	}

	function render(elapsedTime) {
		graphics.clear();
		renderer.spriteRenderer.drawSprite(sprite);
		renderer.spriteRenderer.drawOrb(orb);
		renderer.ufoRenderer.drawUfo(ufo);
		renderer.ufoBulletRenderer.drawUfoBullets(ufoBullets);
		renderer.asteroids.drawAsteroids(asteroids);
		renderer.text.renderText(hyperText);
		renderer.text.renderText(livesText);
		renderer.text.renderText(scoreText);
		renderer.text.renderOffset(levelText);
		renderer.hyperBar.renderBar(hyperBar);
		renderer.livesManager.renderLives(livesManager);
		particles.systemManager.render(elapsedTime);
		if(paused){
			renderer.text.renderText(pauseText);
		}
	}


	function gameloop(time) {
		let elapsedTime = time - lastTimeStamp;
		lastTimeStamp = time;

		processInput(elapsedTime);
		if(!paused){
			update(elapsedTime);
		}
		render(elapsedTime);

		if(running) {
			requestAnimationFrame(gameloop);
		}
	}


	function run() {
		sounds.pauseSound('menuScreen');
		initializeRun();
	}

	return {
		initialize: initialize,
		run: run
	}
}(MyGame.input, MyGame.game, MyGame.sounds, MyGame.objects, MyGame.graphics, MyGame.renderer, MyGame.persistence, MyGame.particles));