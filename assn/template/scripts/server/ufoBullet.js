
random = require('./random');
present = require('present');

function createUfoBullet(ufo, enemies) {
	'use strict';

	let that = {};

	let mapSize = {
		width: 8,
		height: 4
	};

	let lifetime = 4000;

	let position = {
		x: ufo.position.x,
		y: ufo.position.y
	};

	let size = {
		width: .0161,
		height: .035
	}

	function getDirection(){
		if(ufo.type === 'lrg'){
			//dumbShot
			let dir = random.nextCircleVector(1);
			return {
				x: dir.x, 
				y: dir.y
			}
		} else {
			//smartShot
			//TODO: add logic for a 'smart' shot aimed at closest person
			//console.log('trying to use a smart bullet');
			if(Object.keys(enemies).length > 0){
				let closestShipId = 0;
				let closestDistance = 100;
				for(let shipId in enemies){
					let ship = enemies[shipId];
					let dist = Math.sqrt((ufo.position.x - ship.player.position.x)**2 + (ufo.position.y - ship.player.position.y)**2)
					if(dist < closestDistance){
						closestShipId = shipId;
						closestDistance = dist;
					}
				}

				let closestShip = enemies[closestShipId].player;
				let dx = closestShip.position.x - ufo.position.x;
				let dy = closestShip.position.y - ufo.position.y;
				let magnitude = Math.sqrt(dx ** 2 + dy ** 2);
				return {
					x: dx / magnitude, 
					y: dy / magnitude
				}
			} else {
				return {
					x: 0,
					y: 0
				}
			}
			
		}
	}

	let direction = getDirection();

	let speed = .0006;

	Object.defineProperty(that, 'speed', {
		get: () => speed
	});

	Object.defineProperty(that, 'lifetime', {
		get: () => lifetime,
		set: val => lifetime = val
	});

	Object.defineProperty(that, 'size', {
		get: () => size
	});

	Object.defineProperty(that, 'position', {
		get: () => position
	});

	Object.defineProperty(that, 'direction', {
		get: () => direction
	});

	that.update = function(elapsedTime) {
		position.x += direction.x * elapsedTime * speed;
		position.y += direction.y * elapsedTime * speed;
		lifetime -= elapsedTime;
		if(lifetime < 0){
			return true;
		}
	}

	return that;

}

module.exports.create = (ufo, enemies) => createUfoBullet(ufo, enemies);