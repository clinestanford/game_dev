
let MyGame = {
	screens: {},
	assets: {},
	sounds: {},
	input: {},
	components: {},
	utils: {}, 
	renderer: {},
	particles: {}
};

MyGame.loader = (function initialize() {
	'use strict';

	let scriptOrder = [
		{
			scripts: ['sounds/sounds'],
			message: 'successfully loaded sounds.js',
			onComplete: null,
		},
		{
			scripts: ['persistence/persistence'],
			message: 'successfully loaded persistence.js',
			onComplete: null,
		},
		{
			scripts: ['screens/keyboard'],
			message: 'successfully loaded keyboard.js',
			onComplete: null,
		},
		{
			scripts: ['graphics/graphics'],
			message: 'successfully loaded graphics.js',
			onComplete: null,
		},
		{
			scripts: ['updater/localUpdater'],
			message: 'successfully loaded localUpdater.js',
			onComplete: null,
		},
		{
			scripts: ['main'],
			message: 'successfully loaded main.js',
			onComplete: null,
		},
		{
			scripts: ['screens/screen'],
			message: 'successfully loaded screens.js',
			onComplete: null,
		},
		{
			scripts: ['components/player'],
			message: 'successfully loaded player.js',
			onComplete: null,
		},
		{
			scripts: ['components/other_player'],
			message: 'successfully loaded other_player.js',
			onComplete: null,
		},
		{
			scripts: ['utils/queue'],
			message: 'successfully loaded queue.js',
			onComplete: null,
		},
		{
			scripts: ['screens/gameplay'],
			message: 'successfully loaded gameplay.js',
			onComplete: null,
		}
	];

	let gameOrder = [
		{
			scripts: ['input/keyboard'],
			message: 'successfully loaded keyboard.js',
			onComplete: null,
		},
		{
			scripts: ['utils/random'],
			message: 'successfully loaded Random.js',
			onComplete: null,
		},
		{
			scripts: ['components/windowManager'],
			message: 'successfully loaded windowManager.js',
			onComplete: null,
		},
		{
			scripts: ['components/ufoBullet'],
			message: 'successfully loaded ufoBullet.js',
			onComplete: null,
		},
		{
			scripts: ['components/bullet'],
			message: 'successfully loaded bullet.js',
			onComplete: null,
		},
		{
			scripts: ['components/hyperBar'],
			message: 'successfully loaded hyperBar.js',
			onComplete: null,
		},
		{
			scripts: ['components/system'],
			message: 'successfully loaded system.js',
			onComplete: null,
		},
		{
			scripts: ['components/ufo'],
			message: 'successfully loaded ufo.js',
			onComplete: null,
		},
		{
			scripts: ['components/text'],
			message: 'successfully loaded text.js',
			onComplete: null,
		},
		{
			scripts: ['components/powerup'],
			message: 'successfully loaded powerup.js',
			onComplete: null,
		},
		{
			scripts: ['components/asteroid'],
			message: 'successfully loaded asteroid.js',
			onComplete: null,
		},
		{
			scripts: ['renderer/particles'],
			message: 'successfully loaded particles.js',
			onComplete: null,
		},
		{
			scripts: ['renderer/renderObjects'],
			message: 'successfully loaded renderObjects.js',
			onComplete: null,
		},
		{
			scripts: ['renderer/particlesSystemRenderer'],
			message: 'successfully loaded particlesSystemRenderer.js',
			onComplete: null,
		},

	];

	//simply add items here to add pictures and mp3
	let assetOrder = [
		{
			key: 'blip',
			source: 'assets/blip.wav'
		}
	];

	let assetGameOrder = [
		{
			key: 'powerUp',
			source: 'assets/powerUp.wav'
		},
		{
			key: 'ufoShot',
			source: 'assets/ufoShot.mp3'
		},
		{
			key: 'hyperSpace',
			source: 'assets/hyperSpace.wav'
		},
		{
			key: 'ufoExplosion',
			source: 'assets/ufoExplosion.wav'
		},
		{
			key: 'hyperSpace',
			source: 'assets/hyperSpace.wav'
		},
		{
			key: 'orbCures',
			source: 'assets/orbCurse.png'
		},
		{
			key: 'bless',
			source: 'assets/bless.png'
		},
		{
			key: 'alien',
			source: 'assets/singlealien.png'
		},
		{
			key: 'shock',
			source: 'assets/singleshock.png'
		},
		{
			key: 'ice',
			source: 'assets/ice.png'
		},
		{
			key: 'plasmaBall',
			source: 'assets/plasmaball.png'
		},
		{
			key: 'ships_void',
			source: 'assets/ships_void.png', 
		},
		{
			key: 'shield',
			source: 'assets/shield.png', 
		},
		{
			key: 'animatedSelf',
			source: 'assets/animatedShip.png', 
		},
		{
			key: 'saucers',
			source: 'assets/ships_saucer.png', 
		},
		{
			key: 'ufoBullet',
			source: 'assets/ufoBullet.png', 
		},
		{
			key: 'asteroids',
			source: 'assets/asteroids.png', 
		},
		{
			key: 'orb',
			source: 'assets/orb.png', 
		},
		{
			key: 'firewall',
			source: 'assets/firewall.png', 
		},
		{
			key: 'firecircle',
			source: 'assets/firecircle.png', 
		},
		{
			key: 'animatedOther',
			source: 'assets/animatedShip.png', 
		},
		{
			key: 'gameMusic',
			source: 'assets/gameplay.mp3', 
		},
		{
			key: 'mainExplosion',
			source: 'assets/mainExplosion.wav', 
		},
		{
			key: 'miniExplosion',
			source: 'assets/miniExplosion.wav', 
		},
		{
			key: 'orbShot',
			source: 'assets/orbShot.wav', 
		}
	];

	function loadAsset(source, onSuccess, onError) {

		let xhr = new XMLHttpRequest();
		let fileExtension = source.substr(source.lastIndexOf('.') + 1);

		if(fileExtension) {
			xhr.open('GET', source, true);
			xhr.responseType = 'blob';

			xhr.onload = function () {
				let asset = null;
				if (xhr.status === 200) {
					if (fileExtension === 'png' || fileExtension === 'jpg') {
						asset = new Image();
					} else if (fileExtension === 'mp3' || fileExtension === 'wav') {
						asset = new Audio();
					} else {
						if (onError) { onError('Unknown file extension: ' + fileExtension); }
					}
					asset.onload = function () {
						window.URL.revokeObjectURL(xhr.response);
					};
					asset.src = window.URL.createObjectURL(xhr.response);
					if(onSuccess) { onSuccess(asset); }
				} else {
					if(onError) {
						onError('failed to retrieve ' + source);
					}
				}
			};
		} else {
			if(onError) {
				onError('Unkown file extension: ' + fileExtension);
			}
		}

		xhr.send();
	}

	function loadScripts(scripts, onComplete){

		if(scripts.length > 0) {
			let entry = scripts[0];
			require(entry.scripts, 
				() => { //on success
					//console.log(entry.message);
					if(entry.onComplete){
						entry.onComplete();
					}
					scripts.shift();
					loadScripts(scripts, onComplete);
				}
			);

		} else {
			onComplete();
		}

	}

	function loadAssets(assets, onSuccess, onError, onComplete) {
		if(assets.length > 0) {
			let entry = assets[0];
			loadAsset(entry.source, 
				function (asset) { //on success function
					onSuccess(entry, asset);
					assets.shift();
					loadAssets(assets, onSuccess, onError, onComplete);
				},
				function (error) { //on error function
					onError(error);
					assets.shift();
					loadAssets(assets, onSuccess, onError, onComplete);
				}
				)

		} else {
			onComplete();
		}
	}

	function finished() {
		console.log('finished loading everything');
		MyGame.main.initialize();
		//want to start loading all the other assets 
		//now that we can load the current page
		loadGamePlay();
	}


	//this is the entry point
	function loadTiles() {
		let base = 'assets/tiles/tiles';
		for(let i = 0; i < 32; ++i) {
			let str = i.toString() + ".jpg";
			if(str.length < 6) {
				str = '0' + str;
			}

			loadAsset(base + str, 
				function (asset) { //on success function
					MyGame.assets[str.substring(0,2)] = asset;
				},
				function (error) { //on error function
					console.log(error);
				});
		}
		//console.log('loaded all tiles succesfully');
		MyGame.assets['tileSize'] = {
			sizeX: 500,
			sizeY: 500
		}
		MyGame.assets['tileDims'] = {
			x: 8,
			y: 4,
			xPix: 8 * MyGame.assets['tileSize'].sizeX,
			yPix: 4 * MyGame.assets['tileSize'].sizeY,
		}
	}

	loadAssets(assetOrder, 
		function (entry, asset) {
			//console.log('loaded ' + entry.source);
			MyGame.assets[entry.key] = asset;
		}, 
		function (error) {
			console.log(error);
		}, 
		function () {
			console.log('loaded all assets');
			//console.log('starting to load scripts');
			loadScripts(scriptOrder, finished);
		}
	);

	function loadGamePlayAssets() {
		loadAssets(assetGameOrder,
			(entry, asset) => {
				//console.log('succesfully loaded asset: '+ entry.key);
				MyGame.assets[entry.key] = asset;
			},
			(error) => {
				console.log("error loading gameplay asset " + error);
			},
			() => {
				console.log("finished loading gameplay assets");
			});
	}

	function loadGamePlayScripts() {
		loadScripts(gameOrder, () => {console.log('finished loading game scipts');});
	}

	function loadGamePlay() {
		loadTiles();
		loadGamePlayAssets();
		loadGamePlayScripts();
	}

	return {
		loadGamePlay: loadGamePlay,
		loadAssets: loadAssets,
		loadScripts: loadScripts
	}

}());