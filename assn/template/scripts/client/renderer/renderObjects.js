



MyGame.renderer.renderObjects = (function(graphics) {
	'use strict';

	//(rotation, image, sx, sy, sWidth, sHeight, center, size)
	function drawSprite(spec, texture, getLocalPosition) {
		if(getLocalPosition){
			graphics.drawAnimated(
				spec.direction,
				texture,
				spec.frameWidth * spec.curFrame + spec.startX,
				spec.startY,
				spec.frameWidth,
				spec.frameHeight,
				getLocalPosition(spec.position),
				spec.size
				);
		}
	}

	function drawRemoteSprite(spec, texture, getLocalPosition) {
		if(getLocalPosition){
			graphics.drawAnimated(
				spec.state.direction,
				texture,
				spec.imgs.frameWidth * spec.imgs.curFrame + spec.imgs.startX,
				spec.imgs.startY,
				spec.imgs.frameWidth,
				spec.imgs.frameHeight,
				getLocalPosition(spec.state.position),
				spec.size
				);
		}
	}

	function drawBullet(spec, getLocalPosition) {
		let sx = spec.imgs.curFrame * spec.imgs.frameWidth;
		if(getLocalPosition){
			graphics.drawNonRotate(
				MyGame.assets['plasmaBall'], 
				getLocalPosition(spec.position), 
				spec.size, 
				sx, 0, 
				spec.imgs.frameWidth, spec.imgs.frameHeight);	
		}
	}

	function drawAsteroid(asteroid, getLocalPosition){
		graphics.drawAnimated(
			asteroid.rotation,
			MyGame.assets['asteroids'],
			asteroid.imgVals[asteroid.type].left,
			asteroid.row * asteroid.imgVals.rowHeight,
			asteroid.imgVals[asteroid.type].dimension,
			asteroid.imgVals[asteroid.type].dimension,
			getLocalPosition(asteroid.position),
			asteroid.size[asteroid.type]);

	}

	function miniMap(windowManager, playerSelf, playerOthers, asteroids, powerUps, ufo){
		graphics.drawMiniMap(windowManager, playerSelf, playerOthers, asteroids, powerUps, ufo);
	}

	function powerUp(powerUps, getLocalPosition){
		let typeToAsset = {
			shield: MyGame.assets['shield'],
			orb: MyGame.assets['orb'],
		}
		for(let powerUpId in powerUps){
			let curPower = powerUps[powerUpId];
			graphics.drawSimple(typeToAsset[curPower.type], getLocalPosition(curPower.position), curPower.size);	
		}
	}

	function renderText(text) {
		graphics.drawText(text);
	}

	function renderShield(center, size, getLocalPosition){
		graphics.drawSimple(MyGame.assets['shield'], getLocalPosition(center), size);
	}

	function particleRender(particles1, particles2, asset1, asset2) {

		Object.getOwnPropertyNames(particles1).forEach(val => {
			let curObj = particles1[val];
			if(img1){
				graphics.drawObject(system.img1, curObj.center, curObj.rotation, curObj.size);	
			}			
		});

		Object.getOwnPropertyNames(particles2).forEach(val => {
			let curObj = particles2[val];
			if(img2){
				graphics.drawObject(system.img2, curObj.center, curObj.rotation, curObj.size);	
			}
		});
	}

	function drawUfo(ufo, getLocalPosition){
		let mydims = {
			lrg: 144,
			sml: 193,
			lrgDim: 48,
			smlDim: 32
		}
		//console.log(ufo.size[ufo.type].width, ufo.size[ufo.type].height);
		let dims = mydims[ufo.type + 'Dim'];
		graphics.drawAnimated(
				ufo.rotation,
				MyGame.assets['saucers'],
				0,
				mydims[ufo.type],
				dims,
				dims,
				getLocalPosition(ufo.position),
				{width: ufo.size[ufo.type].width, height: ufo.size[ufo.type].height}
		)
	}

	function drawUfoBullet(bullet, getLocalPosition){
		graphics.drawSimple(MyGame.assets['ufoBullet'], getLocalPosition(bullet.position), bullet.size);
	}

	//drawHyperRect(spec, offset_x, offset_y, width, height) {
	function hyperBar(hyperBar){
		graphics.drawHyperRect(hyperBar, hyperBar.position.x, hyperBar.position.y, hyperBar.size.width, hyperBar.size.height);
	}

	return {
		hyperBar: hyperBar,
		drawUfoBullet: drawUfoBullet,
		drawUfo: drawUfo,
		particleRender: particleRender,
		renderShield: renderShield,
		renderText: renderText,
		powerUp: powerUp,
		drawAsteroid: drawAsteroid,
		miniMap: miniMap,
		drawBullet: drawBullet,
		drawSprite: drawSprite,
		drawRemoteSprite: drawRemoteSprite
	}
}(MyGame.graphics));