
MyGame.screens.gameplay = (function(graphics, main, input, loader, sounds, components, assets, renderer, updater, persistence) {
	'use strict';
	let socket;
	let player;
	let keyboard;
	let playerSelf;
	let playerOthers = {};
	let messageHistory = MyGame.utils.Queue();
	let messageId;
	let lastTimeStamp = performance.now();
	let running;
	let windowManager;
	let started;
	let bullets = {};
	let asteroids = {};
	let powerUps = {};
	let asteroidRow = 4; //this will change the asteroid image
	let asteroidDelete = [];
	let bulletDelete = [];
	let score;
	let scoreText;
	let systemManager;
	let ufo = false;
	let ufoBullets = {};
	let hyperBar;
	let hyperText; 
	let powerUpSize = {
		width: .0347,
		height: .075
	}
	let textParameters = {
		font: "20pt Arial",
		location: 'top'
	};

	function uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	function run() {
		MyGame.loader.loadGamePlay(() => {console.log('gameplay was loaded');});

		socket = io();
		socket.on('connect', function() {
			console.log("connection established with server...");
		});

		playerSelf = {
			model: components.Player(),
			texture: assets['ships_void']
		};

		initializeSocketIO();
	}

	function initializeSocketIO() {
		console.log('initializing socket IO functions');

		socket.on('connect-ack', data => {
	
			playerSelf.model.direction = data.direction;
			playerSelf.model.position.x = data.position.x;
			playerSelf.model.position.y = data.position.y;
			playerSelf.model.rotateRate = data.rotateRate;
			playerSelf.model.speed = data.speed;
			playerSelf.model.numFrame = 4;
			playerSelf.model.frameWidth = 48;
			playerSelf.model.frameHeight = 80;
			playerSelf.model.startX = 127;
			playerSelf.model.startY = 240; // starts a new one every 240 pixels
			playerSelf.model.curFrame = 0;
			playerSelf.model.millisPerFrame = 160;
			playerSelf.model.curMillis = 0;
			windowManager.setTopLeft(data.position);
			started = true;
		});

		socket.on('asteroid-new', data => {
			let newAsteroid = MyGame.components.asteroid();
			newAsteroid.position.x = data.position.x;
			newAsteroid.position.y = data.position.y;
			newAsteroid.direction.x = data.direction.x;
			newAsteroid.direction.y = data.direction.y;
			newAsteroid.speed = data.speed;
			newAsteroid.type = data.type;
			newAsteroid.rotateRate = data.rotateRate;
			newAsteroid.size.width = data.size.width;
			newAsteroid.size.height = data.size.height;
			newAsteroid.row = asteroidRow;
			asteroids[data.id] = newAsteroid;

		});

		socket.on('asteroid-blown', data => {
			if(data.owner){
				let astSize = asteroids[data.asteroidId].type;
				if(astSize === 'lrg'){
					score += 10;
				} else if(astSize === 'med'){
					score += 15;
				} else if(astSize === 'sml'){
					score += 25;
				}
				scoreText.setText("score: " + score);
				if(astSize === 'lrg'){
					sounds.mainExplosion();
				} else {
					sounds.miniExplosion();
				}
			}
			if(data.asteroidId){
				asteroidDelete.push(data.asteroidId);	
			}
			if(data.bulletId){
				bulletDelete.push(data.bulletId);
			}
			let curAst = asteroids[data.asteroidId];
			let dist = Math.sqrt((playerSelf.model.position.x - curAst.position.x) ** 2 + (playerSelf.model.position.y - curAst.position.y) ** 2)
			if(dist < 1.5){
				systemManager.createAsteroidBreakup(curAst.position, curAst.type);	
			}

		});

		//when the ufo is hit, we need to kill it
		socket.on('ufo', data => {
			if(ufo){
				ufo.position.x = data.position.x;
				ufo.position.y = data.position.y;
				ufo.direction.x = data.direction.x;
				ufo.direction.y = data.direction.y;
			} else {
				ufo = MyGame.components.ufo();
				ufo.position.x = data.position.x;
				ufo.position.y = data.position.y;
				ufo.direction.x = data.direction.x;
				ufo.direction.y = data.direction.y;
				ufo.speed = data.speed;
				ufo.type = data.type;
				ufo.rotateRate = data.rotateRate;
			}
		});

		socket.on('ufo-bullet', data => {
			let newUfoBullet = MyGame.components.ufoBullet();
			newUfoBullet.position.x = data.position.x;
			newUfoBullet.position.y = data.position.y;
			newUfoBullet.direction.x = data.direction.x;
			newUfoBullet.direction.y = data.direction.y;
			newUfoBullet.lifetime = data.lifetime;
			newUfoBullet.size.width = data.size.width;
			newUfoBullet.size.height = data.size.height;
			ufoBullets[data.id] = newUfoBullet;
			sounds.ufoShot(); //uncomment this when you are ready for the ufo shots
		});

		socket.on('ufo-bullet-delete', data => {
			delete ufoBullets[data.id];
		});

		socket.on('ufo-destroyed', data => {
			systemManager.createUFOExplosion(ufo.position.x, ufo.position.y);
			ufo = false;
			delete bullets[data.bulletId];
			sounds.ufoExplosion();
		});

		socket.on('asteroid-update', data => {
			asteroids[data.asteroidId].position.x = data.position.x;
			asteroids[data.asteroidId].position.y = data.position.y;

		});

		socket.on('powerup-new', data => {
			powerUps[data.id] = MyGame.components.powerup(data.position, data.type);
		});

		socket.on('powerup-received', data => {
			if(data.type === 'shield'){
				playerSelf.model.resetShield();
			} else if(data.type === 'orb'){
				playerSelf.model.doubleShot = true;
			}
			sounds.powerUp();
		});

		socket.on('powerup-taken', data => {
			delete powerUps[data.id];
		});

		socket.on('connect-other', data => {

			let model = components.PlayerRemote();

			//everything to manage state and goal
			model.state.direction = data.direction;
			model.state.position.x = data.position.x;
			model.state.position.y = data.position.y;
			model.state.lastUpdtae = performance.now();
			model.goal.direction = data.direction;
			model.goal.position.x = data.position.x;
			model.goal.position.y = data.position.y;
			model.goal.updateWindow = 0;

			//everything to render the animated ship
			model.imgs.numFrame = 4;
			model.imgs.curFrame = 0;
			model.imgs.frameWidth = 48;
			model.imgs.frameHeight = 80;
			model.imgs.startX = 127;
			model.imgs.startY = 0;
			model.imgs.millisPerFrame = 160;
			model.curMillis = 0;

			playerOthers[data.clientId] = {
				model: model,
				texture: assets['ships_void']
			}
		});

		socket.on('bullet-new', data => {
			//console.log(data);
			let curBullet = MyGame.components.bullet(data.position, data.direction);
			curBullet.lifetime = data.lifetime;
			curBullet.imgs.numFrames = 4;
			curBullet.imgs.curFrame = 0;
			curBullet.imgs.frameWidth = 64;
			curBullet.imgs.frameHeight = 64;
			curBullet.imgs.millisPerFrame = 80;
			curBullet.imgs.curMillis = 0;
			bullets[data.uuid] = curBullet;
		});

		socket.on('update-other', data => {
			if(playerOthers.hasOwnProperty(data.clientId)) {
				let model = playerOthers[data.clientId].model;
				model.goal.updateWindow = data.updateWindow;
				model.goal.direction = data.direction;
				model.goal.position.x = data.position.x;
				model.goal.position.y = data.position.y;
				//want the particle effect for other ships if they are 
				//changing their momentum
				if(model.state.momentum.x !== data.momentum.x ||
					model.state.momentum.y !== data.momentum.y){
					systemManager.leaveTrail(model.state.position);	
				}
				model.state.momentum.x = data.momentum.x;
				model.state.momentum.y = data.momentum.y;
				model.state.shield = data.shield;
				
			}
		});

		socket.on('death', data => {
			playerSelf.model.position.x = data.position.x;
			playerSelf.model.position.y = data.position.y;
			playerSelf.model.momentum.y = 0;
			playerSelf.model.momentum.x = 0;
			systemManager.hyperSpaceAppear(playerSelf.model.position);
			sounds.hyperSpace();
			score -= 100;
			scoreText.setText("score: " + score);
			playerSelf.model.doubleShot = false;
		});

		socket.on('disconnect-other', data => {
			delete playerOthers[data.clientId];
		});

		socket.on('safe-location', data => {
			playerSelf.model.position.x = data.position.x;
			playerSelf.model.position.y = data.position.y;
			playerSelf.model.momentum.x = data.momentum.x;
			playerSelf.model.momentum.y = data.momentum.y;
			systemManager.hyperSpaceAppear(playerSelf.model.position);
		});

		socket.on('gameover', data => {
			console.log('gameover called', score);
			persistence.addScore(score);
			score = 0;
			scoreText.setText("score: " + score);
		});

		//data will conatin clientId, lastMessageId, direction, position, updateWindow(elapsedTime) 
		socket.on('update-self', data => {
			playerSelf.model.direction = data.direction;
			playerSelf.model.position.x = data.position.x;
			playerSelf.model.position.y = data.position.y;
			playerSelf.model.momentum.x = data.momentum.x;
			playerSelf.model.momentum.y = data.momentum.y;

			let done = false;
			while(!done && !messageHistory.empty){
				if(data.messageId === messageHistory.front.id){
					done = true;
				}

				messageHistory.dequeue();
			}

			let memory = MyGame.utils.Queue();
			while(!messageHistory.empty){
				let message = messageHistory.dequeue();
				switch(message.type){
					case 'move':
						playerSelf.model.move(message.elapsedTime);
						break;
					case 'rotate-right':
						playerSelf.model.rotateRight(message.elapsedTime);
						break;
					case 'rotate-left':
						playerSelf.model.rotateLeft(message.elapsedTime);
						break;
					case 'update':
						console.log('calling the update self method');
						playerSelf.model.update(message.elapsedTime);
						break;
				}
				memory.enqueue(message);
			}
			messageHistory = memory;
		});

		initializeElements();
	}

	function initializeElements() {
		sounds.gameMusic(); //uncomment this out when you don't mind the music
		let controls = persistence.getControls();
		running = true;
		messageId = 1;
		windowManager = components.windowManager(graphics);
		score = 0;
		systemManager = MyGame.particles.systemManager;
		systemManager.setFunctionGetLocal(windowManager.getLocalPosition);

		graphics.setTextParameters(textParameters);

		scoreText = MyGame.components.text({
			rotation: 0,
			position: {x: 20, y: 20},
			text: "score: " + score,
			fillStyle: 'rgba(255,0,0,1)',
			strokeStyle: 'rgba(255,0,0,1)',
		});

		hyperBar = MyGame.components.hyperBar({
			position: {x: graphics.canvas.width - 120, y: 20},
			fillStyle: 'rgba(255,0,0,1)',
			strokeStyle: 'rgba(255,0,0,1)',
			percentPerSecond: .33,
			size: {
				width: 100,
				height: 30
			}
		});

		hyperText = MyGame.components.text({
			rotation: 0,
			position: {
				x: hyperBar.position.x - graphics.context.measureText("hyperspace").width - 10, 
				y: 20},
			text: "hyperspace",
			fillStyle: 'rgba(255,0,0,1)',
			strokeStyle: 'rgba(255,0,0,1)',
		});

		keyboard = input.keyboard();

		keyboard.registerHandler(quit,
			'q',
			false);

		keyboard.registerHandler(elapsedTime => {
			let message = {
				id: messageId++,
				elapsedTime: elapsedTime,
				type: 'move'
			};
			socket.emit('input', message);
			messageHistory.enqueue(message);
			playerSelf.model.move(elapsedTime);
			systemManager.leaveTrail(playerSelf.model.position);
		},
		controls['thrust'],
		true);

		keyboard.registerHandler(elapsedTime => {
			let message = {
				id: messageId++,
				elapsedTime: elapsedTime,
				type: 'rotate-right'
			};
			socket.emit('input', message);
			messageHistory.enqueue(message);
			playerSelf.model.rotateRight(elapsedTime);
		},
		controls['rotateRight'], 
		true);

		keyboard.registerHandler(elapsedTime => {
			let message = {
				id: messageId++,
				elapsedTime: elapsedTime,
				type: 'rotate-left'
			};
			socket.emit('input', message);
			messageHistory.enqueue(message);
			playerSelf.model.rotateLeft(elapsedTime);
		},
		controls['rotateLeft'], 
		true);

		keyboard.registerHandler(elapsedTime => {
			if(hyperBar.reset()){
				sounds.hyperSpace();
				let message = {
					id: messageId++,
					elapsedTime: elapsedTime,
					type: 'hyperspace'
				};
				socket.emit('input', message);
				messageHistory.enqueue(message);
			}
		},
		controls['hyperspace'], 
		true);

		keyboard.registerHandler(elapsedTime => {
			if(playerSelf.model.doubleShot){
				let uuid2 = uuidv4();
				let newBullet2 = playerSelf.model.newBullet();
				let originalDirection = playerSelf.model.direction;
				let leftDir = originalDirection + Math.PI / 12;
				let rightDir = originalDirection - Math.PI / 12;

				newBullet2.direction.x = Math.sin(leftDir);
				newBullet2.direction.y = Math.cos(leftDir);
				newBullet2.imgs.numFrames = 4;
				newBullet2.imgs.curFrame = 0;
				newBullet2.imgs.frameWidth = 64;
				newBullet2.imgs.frameHeight = 64;
				newBullet2.imgs.millisPerFrame = 80;
				newBullet2.imgs.curMillis = 0;
				bullets[uuid2] = newBullet2;

				let message2 = {
					id: messageId++,
					elapsedTime: elapsedTime,
					type: 'fire',
					bullet: {
						position: {
							x: newBullet2.position.x,
							y: newBullet2.position.y
						},
						direction: {
							x: newBullet2.direction.x,
							y: newBullet2.direction.y
						},
					},
					uuid: uuid2
				};
				socket.emit('input', message2);

				let uuid1 = uuidv4();
				let newBullet1 = playerSelf.model.newBullet();
				newBullet1.direction.x = Math.sin(rightDir);
				newBullet1.direction.y = Math.cos(rightDir);
				newBullet1.imgs.numFrames = 4;
				newBullet1.imgs.curFrame = 0;
				newBullet1.imgs.frameWidth = 64;
				newBullet1.imgs.frameHeight = 64;
				newBullet1.imgs.millisPerFrame = 80;
				newBullet1.imgs.curMillis = 0;
				bullets[uuid1] = newBullet1;

				let message1 = {
					id: messageId++,
					elapsedTime: elapsedTime,
					type: 'fire',
					bullet: {
						position: {
							x: newBullet1.position.x,
							y: newBullet1.position.y
						},
						direction: {
							x: newBullet1.direction.x,
							y: newBullet1.direction.y
						},
					},
					uuid: uuid1
				};
				socket.emit('input', message1);
				sounds.orbShot();

			} else {
				//I don't think this is the way to do it
				//because the bullet is being created locally
				//and from there passed to the server
				//but I'll keep running with it. 
				let uuid = uuidv4();
				let newBullet = playerSelf.model.newBullet();
				newBullet.imgs.numFrames = 4;
				newBullet.imgs.curFrame = 0;
				newBullet.imgs.frameWidth = 64;
				newBullet.imgs.frameHeight = 64;
				newBullet.imgs.millisPerFrame = 80;
				newBullet.imgs.curMillis = 0;
				bullets[uuid] = newBullet;

				let message = {
					id: messageId++,
					elapsedTime: elapsedTime,
					type: 'fire',
					bullet: {
						position: {
							x: newBullet.position.x,
							y: newBullet.position.y
						},
						direction: {
							x: newBullet.direction.x,
							y: newBullet.direction.y
						},
					},
					uuid: uuid
				};
				socket.emit('input', message);
				sounds.orbShot();
			}
		},
		controls['fire'], 
		false);

		requestAnimationFrame(gameloop);
	}

	function handleInput(elapsedTime){
		for(let i = 0; i < asteroidDelete.length; ++i){
			delete asteroids[asteroidDelete[i]];
		}
		asteroidDelete = [];
		for(let i = 0; i < bulletDelete.length; ++i){
			delete bullets[bulletDelete[i]];
		}
		bulletDelete = [];
	}

	function updateUfoBullets(elapsedTime){
		let toDelete = [];
		for(let ufoBulletId in ufoBullets){
			if(ufoBullets[ufoBulletId].update(elapsedTime)){
				toDelete.push(ufoBulletId);
			}
		}
		for(let id = 0; id < toDelete.length; ++id){
			delete ufoBullets[toDelete[id]];
		}
	}

	function update(elapsedTime) {
		hyperBar.update(elapsedTime);
		systemManager.update(elapsedTime);
		keyboard.update(elapsedTime);
		updater.updateShip(elapsedTime, playerSelf.model);
		playerSelf.model.update(elapsedTime);
		if(windowManager.updateWindow){
			windowManager.updateWindow(playerSelf.model.position);
		}
		for(let id in playerOthers){
			playerOthers[id].model.updateFunction(elapsedTime);
		}
		let removeBullets = [];
		for(let id in bullets){
			bullets[id].update(elapsedTime);
			if (bullets[id].lifetime < 0){
				removeBullets.push(id);
			}
		}
		for(let i = 0; i < removeBullets.length; ++i){
			delete bullets[removeBullets[i]];
		}
		for(let asteroidId in asteroids) {
			asteroids[asteroidId].update(elapsedTime);
		}
		if(ufo){
			ufo.update(elapsedTime);
		}
		updateUfoBullets(elapsedTime);
	}

	function render() {
		windowManager.renderScreen(playerSelf.model.position, started);
		renderer.renderObjects.drawSprite(playerSelf.model, playerSelf.texture, windowManager.getLocalPosition);
		if(playerSelf.model.shield){
			renderer.renderObjects.renderShield(playerSelf.model.position, powerUpSize, windowManager.getLocalPosition);
		}
		for(let id in playerOthers){
			renderer.renderObjects.drawRemoteSprite(playerOthers[id].model, playerOthers[id].texture, windowManager.getLocalPosition);
			if(playerOthers[id].model.state.shield){
				renderer.renderObjects.renderShield(playerOthers[id].model.state.position, powerUpSize, windowManager.getLocalPosition);		
			}
		}
		for(let id in bullets){
			renderer.renderObjects.drawBullet(bullets[id], windowManager.getLocalPosition);
		}
		for(let id in asteroids) {
			renderer.renderObjects.drawAsteroid(asteroids[id], windowManager.getLocalPosition);
		}
		if(ufo){
			renderer.renderObjects.drawUfo(ufo, windowManager.getLocalPosition);	
		}
		for(let id in ufoBullets){
			renderer.renderObjects.drawUfoBullet(ufoBullets[id], windowManager.getLocalPosition);
		}
		systemManager.render();
		renderer.renderObjects.powerUp(powerUps, windowManager.getLocalPosition);
		renderer.renderObjects.miniMap(windowManager, playerSelf, playerOthers, asteroids, powerUps, ufo);
		renderer.renderObjects.renderText(scoreText);
		renderer.renderObjects.renderText(hyperText);
		renderer.renderObjects.hyperBar(hyperBar);
	}

	function quit() {
		running = false;
	}

	function gameloop(time){
		let elapsedTime = time - lastTimeStamp;
		lastTimeStamp = time;

		handleInput(elapsedTime);
		update(elapsedTime);
		render();

		if(running){
			requestAnimationFrame(gameloop);	
		}
	}

	function initialize() {
		console.log('initialized gameplay');
		main.showScreen('mainmenu');
	}

	return {
		initialize: initialize,
		run: run
	}

}(MyGame.graphics, MyGame.main, MyGame.input, MyGame.loader, MyGame.sounds, MyGame.components, MyGame.assets, MyGame.renderer, MyGame.updater, MyGame.persistence));