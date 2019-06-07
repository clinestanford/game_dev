
let present  = require('present');
let player = require('./player');
let bullet = require('./bullet');
let asteroidMaker = require('./asteroid');
let powers = require('./powerup');
let ufoMaker = require('./ufo');
let ufoBulletMaker = require('./ufoBullet');

const UPDATE_RATE = 50;
let quit = false;
let activeClients = {};
let inputQueue = [];
let lastUpdateTime = 0;
let bullets = {};
let asteroids = {};
let lastUpdateFrame = 0;
let startingAsteroids = 8;
let startingPowerUps = 3;
let powerUps = {};
let timeSincePowerUp = 0;
let timeForPowerUpRespawn = 20000; //20s
let ufo;
let ufoBullets = {};

function processInput(currentTime) {

	let processMe = inputQueue;
	inputQueue = [];

	for(let inputIndex in processMe) {
		let input = processMe[inputIndex];
		let client = activeClients[input.clientId];
		if(client){
			client.lastMessageId = input.message.id;
			switch (input.message.type) {
				case 'move':
					client.player.move(input.message.elapsedTime, input.receiveTime - lastUpdateTime);
					lastUpdateTime = input.receiveTime;
					break;
				case 'rotate-left':
					client.player.rotateLeft(input.message.elapsedTime);
					break;
				case 'rotate-right':
					client.player.rotateRight(input.message.elapsedTime);
					break;
				case 'update':
					client.player.update(input.message.elapsedTime);
					break;
				case 'fire':
					let curBullet = input.message.bullet;
					let newBullet = bullet.create(curBullet.position, curBullet.direction);
					newBullet.ownderId = input.clientId;
					//this may need to be revised if the bullet shows up at the wrong location
					newBullet.update(currentTime - input.receiveTime);
					notifyBullet(newBullet, input.clientId, input.message.uuid);
					bullets[input.message.uuid] = newBullet;
					break;
				case 'hyperspace':
					client.player.getSafeLocation(asteroids);
					//client.player.position.x = 3;
					//client.player.position.y = 3;
					let update = {
						//position: client.player.position,
						position: {
							x: client.player.position.x,
							y: client.player.position.y,
						},
						momentum: {x: 0, y: 0},
					};
					client.socket.emit('safe-location', update);
			}
		}
	}
	lastUpdateTime = present();
	lastUpdateFrame = present();
}

function notifyBlownAsteroid(ownderId, asteroidId, bulletId){
	for(let clientId in activeClients){
		let message = {
			asteroidId: asteroidId,
			bulletId: bulletId,
			owner: false
		};
		if(clientId === ownderId){
			message.owner = true;
		}	
		activeClients[clientId].socket.emit('asteroid-blown', message);
	}
}

function asteroidBreakUp(position, type){
	let typeToMake = 'sml';
	let toMake = 0;
	let listIds = [];
	if(type === 'lrg'){
		typeToMake = 'med';
		toMake = 3;
	}else if(type === 'med'){
		typeToMake = 'sml';
		toMake = 4;
	}
	//making a new asteroid
	for(let i = 0; i < toMake; ++i){
		let curId = uuidv4();
		listIds.push(curId);
		asteroids[curId] = asteroidMaker.create(type, position);
	}
	//notifying clients of a new asteroid
	for(clientId in activeClients){
		let client = activeClients[clientId];
		for(let i = 0; i < listIds.length; ++i){
			let curAsteroid = asteroids[listIds[i]];
			let message = {
				id: listIds[i],
				position: {
					x: curAsteroid.position.x,
					y: curAsteroid.position.y
				},
				direction: {
					x: curAsteroid.direction.x,
					y: curAsteroid.direction.y
				},
				speed: curAsteroid.speed,
				type: curAsteroid.type,
				rotateRate: curAsteroid.rotateRate,
				size: {
					width: curAsteroid.size.width,
					height: curAsteroid.size.height
				}
			}
			client.socket.emit('asteroid-new', message);
		}
	}
}

function emitToAll(messageType, message){
	for(clientId in activeClients){
		activeClients[clientId].socket.emit(messageType, message);
	}
}

function powerUpHelper(elapsedTime){
	if(Object.keys(powerUps).length < 3 && timeSincePowerUp > timeForPowerUpRespawn){
		timeSincePowerUp = 0;
		let powerId = uuidv4();
		powerUps[powerId] = powers.create();
		let message = {
			id: powerId,
			position: powerUps[powerId].position,
			type: powerUps[powerId].type
		}
		for(let clientId in activeClients){
			activeClients[clientId].socket.emit('powerup-new', message);
		}
	} else {
		timeSincePowerUp += elapsedTime;
	}
}

function powerUpTaken(powerId){
	for(let clientId in activeClients){
		let message = {
			id: powerId
		};
		activeClients[clientId].socket.emit('powerup-taken', message);
	}
}

function collisionDetection(){
	removeAst = [];
	removeBul = [];
	removeUfoBul = [];

	//will check asteroids and bullets, asteroids and players
	for(asteroidId in asteroids){
		let curAsteroid = asteroids[asteroidId];
		for(bulletId in bullets){
			let curBullet = bullets[bulletId];
			//checking for blown asteroids
			let dist = Math.sqrt((curAsteroid.position.x - curBullet.position.x)**2 + (curAsteroid.position.y - curBullet.position.y)**2);
			if(dist < curAsteroid.size[curAsteroid.type].height/3 + curBullet.size.width/2){
				removeAst.push(asteroidId);
				removeBul.push(bulletId);
				notifyBlownAsteroid(curBullet.ownderId, asteroidId, bulletId);
				asteroidBreakUp(curAsteroid.position, curAsteroid.type);
			}
		}
		for(clientId in activeClients) {
			let curClient = activeClients[clientId];
			let dist = Math.sqrt((curAsteroid.position.x - curClient.player.position.x)**2 + (curAsteroid.position.y - curClient.player.position.y)**2);
			if(dist < curAsteroid.size[curAsteroid.type].height/3 + curClient.player.size.height/3){
				if(curClient.player.shield){
					removeAst.push(asteroidId);
					notifyBlownAsteroid(clientId, asteroidId, null);
					asteroidBreakUp(curAsteroid.position, curAsteroid.type);
				} else {
					curClient.player.getSafeLocation(asteroids);
					let message = {
						position: {
							x: curClient.player.position.x,
							y: curClient.player.position.y,
						}
					};
					curClient.socket.emit('death', message);
				}
			}
			//now check them against ufo bullet
			for(let ufoBulletId in ufoBullets){
				let curUfoBullet = ufoBullets[ufoBulletId];
				let dist = Math.sqrt((curUfoBullet.position.x - curClient.player.position.x)**2 + (curUfoBullet.position.y - curClient.player.position.y)**2);
				if(dist < curClient.player.size.height/3 + curUfoBullet.size.height/3){
					if(curClient.player.shield === false){
						curClient.player.getSafeLocation(asteroids);
						let message = {
							position: {
								x: curClient.player.position.x,
								y: curClient.player.position.y,
							}
						}

						emitToAll('ufo-bullet-delete', {id: ufoBulletId});
						curClient.socket.emit('death', message);
					}
					
				}
			}
		}
	}

	if(ufo.alive){
		for(let bulletId in bullets){
			let curBullet = bullets[bulletId];
			let dist = Math.sqrt((curBullet.position.x - ufo.position.x)**2 + (curBullet.position.y - ufo.position.y)**2);
			if(dist < ufo.size[ufo.type].height/3 + curBullet.size.height/3){
				ufo.alive = false;
				let message = {
					bulletId: bulletId
				}
				emitToAll('ufo-destroyed', message);
				ufo.resetUfo();  //this function will make game wait 10s before another spawns
				removeBul.push(bulletId);
			}
		}
	}
	

	for(let clientId in activeClients){
		for(let powerId in powerUps){
			let curClient = activeClients[clientId].player;
			let curPowerUp = powerUps[powerId];
			let dist = Math.sqrt((curClient.position.x - curPowerUp.position.x)**2 + (curClient.position.y - curPowerUp.position.y)**2);
			if(dist < curClient.size.height/2 + curPowerUp.size.height/3){
				let message = {
					type: curPowerUp.type,
				}
				//check to see which type of power up was gotten
				if(curPowerUp.type === 'shield'){
					curClient.shieldReset();
				}
				activeClients[clientId].socket.emit('powerup-received', message);
				powerUpTaken(powerId);
				delete powerUps[powerId];
			}
		}
	}

	for(let i = 0; i < removeAst.length; ++i){
		delete asteroids[removeAst[i]];
	}
	for(let i = 0; i < removeBul.length; ++i){
		delete bullets[removeBul[i]];
	}
	for(let i = 0; i < removeUfoBul.length; ++i){
		delete ufoBullets[removeUfoBul[i]];
	}
}

function asteroidUpdate() {
	if(Object.keys(asteroids).length === 0){
		emitToAll('gameover', {});
		for(let i = 0; i < startingAsteroids; ++i){
			let curId = uuidv4();
			asteroids[curId] = asteroidMaker.create();
			let curAsteroid = asteroids[curId];
			let message = {
				id: curId,
				position: {
					x: curAsteroid.position.x,
					y: curAsteroid.position.y
				},
				direction: {
					x: curAsteroid.direction.x,
					y: curAsteroid.direction.y
				},
				speed: curAsteroid.speed,
				type: curAsteroid.type,
				rotateRate: curAsteroid.rotateRate,
				size: {
					width: curAsteroid.size.width,
					height: curAsteroid.size.height
				}
			}

			emitToAll('asteroid-new', message);
		}
	}
	for(let clientId in activeClients){
		for(let asteroidId in asteroids){
			let ast = asteroids[asteroidId];
			let message = {
				asteroidId: asteroidId,
				position: {
					x: ast.position.x,
					y: ast.position.y
				}
			};
			activeClients[clientId].socket.emit('asteroid-update', message);
		}
	}
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

function update(elapsedTime, currentTime) {
	for (let clientId in activeClients) {
		activeClients[clientId].player.update(elapsedTime, currentTime);
	}
	for (let bulletId in bullets){
		if(bullets[bulletId].update(elapsedTime)){
			delete bullets[bulletId];
		}
	}
	for (let asteroidId in asteroids){
		asteroids[asteroidId].update(elapsedTime);
	}
	asteroidUpdate();
	//TODO: Collision detection for asteroid -> {ship, orb}
	collisionDetection();
	powerUpHelper(elapsedTime); // should spawn new power-ups
	ufo.update(elapsedTime);
	updateUfoBullets(elapsedTime);
}

function notifyBullet(newBullet, senderId, uuid){
	let bulletInfo = {
		uuid: uuid,
		lifetime: newBullet.lifetime,
		position: {
			x: newBullet.position.x,
			y: newBullet.position.y
		},
		direction: {
			x: newBullet.direction.x,
			y: newBullet.direction.y
		}
	};

	for(let clientId in activeClients){
		if(clientId !== senderId){
			let client = activeClients[clientId];
			client.socket.emit('bullet-new', bulletInfo);
		}
	}
}

function updateClients(elapsedTime) {
	for(let clientId in activeClients) {
		let client = activeClients[clientId];
		let update = {
			clientId: clientId,
			lastMessageId: client.lastMessageId,
			direction: client.player.direction,
			position: client.player.position,
			updateWindow: elapsedTime,
			momentum: client.player.momentum,
			shield: client.player.shield,
		};
		if(client.player.reportUpdate) {
			client.socket.emit('update-self', update);
		}

		for(let otherClientId in activeClients) {
			if(otherClientId !== clientId) {
				activeClients[otherClientId].socket.emit('update-other', update);
			}
		}
		if(ufo.alive){
			let message = {
				position: {
					x: ufo.position.x,
					y: ufo.position.y
				},
				direction: {
					x: ufo.direction.x,
					y: ufo.direction.y
				},
				speed: ufo.speed,
				type: ufo.type,
				rotateRate: ufo.rotateRate
			}
			client.socket.emit('ufo', message);
		}
	}

	for(let clientId in activeClients) {
		activeClients[clientId].player.reportUpdate = false;
	}
}

function gameloop(currentTime, elapsedTime) {
	//console.log('gameloop: ' + currentTime);

	processInput(currentTime);
	update(elapsedTime);
	updateClients(elapsedTime);
	if(!quit) {
		setTimeout(() => {
			let now = present();
			gameloop(now, now - currentTime);
		}, UPDATE_RATE);
	}
}

function initializeSocketIOConnnection(httpServer) {
	let io = require('socket.io')(httpServer);

	function notifyConnect(socket, newPlayer) {

		for(let clientId in activeClients) {
			let client = activeClients[clientId];
			if(newPlayer.clientId !== clientId) {
				client.socket.emit('connect-other', {
					clientId: newPlayer.clientId,
                    direction: newPlayer.direction,
                    position: newPlayer.position,
                    rotateRate: newPlayer.rotateRate,
                    speed: newPlayer.speed,
                    size: newPlayer.size,
                    momentum: newPlayer.momentum
				});
			
				socket.emit('connect-other', {
					clientId: client.player.clientId,
                    direction: client.player.direction,
                    position: client.player.position,
                    rotateRate: client.player.rotateRate,
                    speed: client.player.speed,
                    size: client.player.size,
                    momentum: client.player.momentum
				});
			}
		}
	}

	function notifyDisconnect(playerId) {
		for(let clientId in activeClients) {
			let client = activeClients[clientId];
			if(playerId != clientId){
				client.socket.emit('disconnect-other', {
					clientId: playerId
				});
			}
		}
	}

	io.on('connection', function(socket) {
		console.log('connection was established, id: ' + socket.id);

		let newPlayer = player.create();
		newPlayer.getSafeLocation(asteroids);
		newPlayer.clientId = socket.id;
		activeClients[socket.id] = {
			socket: socket,
			player: newPlayer
		};

		socket.emit('connect-ack', {
			direction: newPlayer.direction,
			position: newPlayer.position,
			size: newPlayer.size,
			rotateRate: newPlayer.rotateRate,
			speed: newPlayer.speed
		});

		for(let asteroidId in asteroids){
			let curAsteroid = asteroids[asteroidId];
			//console.log('transparent? ',curAsteroid.rotateRate);
			let message = {
				id: asteroidId,
				position: {
					x: curAsteroid.position.x,
					y: curAsteroid.position.y
				},
				direction: {
					x: curAsteroid.direction.x,
					y: curAsteroid.direction.y
				},
				speed: curAsteroid.speed,
				type: curAsteroid.type,
				rotateRate: curAsteroid.rotateRate,
				size: {
					width: curAsteroid.size.width,
					height: curAsteroid.size.height
				}
			}

			socket.emit('asteroid-new', message);
		}

		//let them know the location of all power-ups at start
		for(let powerUpId in powerUps){

			let curPowerUp = powerUps[powerUpId];
			//console.log('sending out power up at: ', curPowerUp.position);
			let message = {
				id: powerUpId,
				type: curPowerUp.type,
				position: {
					x: curPowerUp.position.x,
					y: curPowerUp.position.y
				}
			}
			socket.emit('powerup-new', message);
		}	

		//also need to feed the new player asteroid 
		//details and bullet info
		//powerups and ufo as well.

		socket.on('input', data => {
			inputQueue.push({
				clientId: socket.id,
				message: data,
				receiveTime: present()
			});
		});

		socket.on('disconnect', () => {
			console.log('client just disconnected');
			delete activeClients[socket.id];
			notifyDisconnect(socket.id);
		});

		notifyConnect(socket, newPlayer);
	});
}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function ufoFire() {
	let newUfoBullet = ufoBulletMaker.create(ufo, activeClients);
	let id = uuidv4();
	ufoBullets[id] = newUfoBullet;
	if(newUfoBullet){
		let message = {
			position: {
				x: newUfoBullet.position.x,
				y: newUfoBullet.position.y
			},
			direction: {
				x: newUfoBullet.direction.x,
				y: newUfoBullet.direction.y
			},
			lifetime: newUfoBullet.lifetime,
			size: {
				width: newUfoBullet.size.width,
				height: newUfoBullet.size.height
			},
			id: id
		};
		emitToAll('ufo-bullet', message);
	}
}

function initialize(httpServer) {
	for(let i = 0; i < startingAsteroids; ++i){
		asteroids[uuidv4()] = asteroidMaker.create();
	}

	for(let i = 0; i < startingPowerUps; ++i){
		powerUps[uuidv4()] = powers.create();
	}

	ufo = ufoMaker.create(ufoFire);

	initializeSocketIOConnnection(httpServer);
	gameloop(present(), 0);
}

function terminate(){
	this.quit = true;
}

module.exports.initialize = initialize;