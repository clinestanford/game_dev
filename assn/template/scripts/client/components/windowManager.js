

//needs to be created after the tile frames are loaded.
MyGame.components.windowManager = function(graphics) {
	'use strict';

	let width = graphics.canvas.width;
	let height = graphics.canvas.height;
	let worldWidth = MyGame.assets['tileDims'].x;
	let worldHeight = MyGame.assets['tileDims'].y;
	let sidePerc = .25;

	let viewportWidth = 1;
	let viewportHeight = 1;

	let tileWidth = MyGame.assets['tileSize'].sizeX;
	let tileHeight = MyGame.assets['tileSize'].sizeY;

	let viewport = {
		x: 0,
		y: 0
	};

	function verifyViewPort(){
		if(viewport.x < 0){viewport.x = 0}
		if(viewport.y < 0){viewport.y = 0}
		if(viewport.x > worldWidth - viewportWidth){viewport.x = worldWidth - viewportWidth}
		if(viewport.y > worldHeight - viewportHeight){viewport.y = worldHeight - viewportHeight}
	}

	function numToString(num){
		if(num < 10){
			return '0'+num;
		} else {
			return '' + num;
		}
	}

	function setTopLeft(center){

		viewport.x = center.x - viewportWidth * .5;
		viewport.y = center.y - viewportHeight * .5;

		verifyViewPort();//farthest thing from a pure function
	}

	function getLocalPosition(position) {
		return {
			x: position.x - viewport.x,
			y: position.y - viewport.y
		}
	}

//drawScreenPortion(img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight)
	function renderScreen(center, started) {

		let startx, starty;
		let offsetx, offsety;
		let localx = 0, localy = 0;
		let sheight, swidth;		

		starty = Math.floor(viewport.y);
		offsety = (viewport.y - starty);
//		let row = 0, col = 0;

		if(started){
			for(let row = 0; row < 2; row++){

				startx = Math.floor(viewport.x);
				offsetx = (viewport.x - startx);

				for(let col = 0; col < 2; col++){

					swidth = 1 - localx - offsetx;
					sheight = 1 - localy - offsety;

					//console.log('from image: ', offsetx, offsety, swidth, sheight);

					//console.log('to canvas: ', localx, localy, swidth, sheight);

					graphics.drawScreenPortion(
						MyGame.assets[numToString((startx + col) + (starty + row) * 8)],
						offsetx * tileWidth,
						offsety * tileHeight,
						swidth * tileWidth,
						sheight * tileHeight,
						localx * graphics.canvas.width,
						localy * graphics.canvas.height,
						swidth * graphics.canvas.width, // I can do this because swidth is equal to the 
						sheight * graphics.canvas.height); //portion we want to draw on the canvas.

					localx += swidth;
					offsetx = 0;
				}

				localx = 0;
				localy += sheight;
				offsety = 0;
			}
		}
	}

	function updateWindow(position){

		if(position.x - viewport.x < 1/4){
			viewport.x = position.x - (1/4);
		} else if(position.x - viewport.x > 3/4){
			viewport.x = position.x - (3/4);
		}

		if(position.y - viewport.y < 1/4){
			viewport.y = position.y - (1/4);
		} else if(position.y - viewport.y > 3/4){
			viewport.y = position.y - (3/4);
		}
		verifyViewPort();
	}

	return {
		renderScreen: renderScreen,
		setTopLeft: setTopLeft,
		get viewport() {return viewport;},
		getLocalPosition: getLocalPosition,
		updateWindow: updateWindow

	}

}

