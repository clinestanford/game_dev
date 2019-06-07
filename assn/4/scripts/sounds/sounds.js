
MyGame.sounds = (function() {
	let mySounds = {};

	function loadSound(source) {
		let sound = new Audio();
		sound.canplay = false;


		sound.addEventListener('canplay', () => {
			sound.canplay = true;
		});

		sound.src = source;
		//sound.promise = sound.load();
		return sound;
	}

	function loadAudio() {
		mySounds['menuScreen'] = loadSound('audio/spaceSprinkles.mp3');
		mySounds['gamePlay'] = loadSound('audio/gameplay.mp3');
		mySounds['blip'] = loadSound('audio/3.wav');
		mySounds['mainExplosion'] = loadSound('audio/mainExplosion.wav');
		mySounds['orbShot'] = loadSound('audio/orbShotTest.wav');
		mySounds['ufoShot'] = loadSound('audio/ufoShot.mp3');
		mySounds['miniExplosion'] = loadSound('audio/miniExplosion.wav');
		mySounds['spriteExplosion'] = loadSound('audio/spriteExplosion.mp3');
		mySounds['ufoExplosion'] = loadSound('audio/ufoExplosion.wav');
		mySounds['extraLife'] = loadSound('audio/extraLife.wav');
		mySounds['levelup'] = loadSound('audio/levelup.wav');	
		mySounds['hyperSpace'] = loadSound('audio/hyperSpace.wav');	
	}

	function mainExplosion() {
		playSound('mainExplosion');
	}

	function levelup() {
		playSound('levelup');
	}

	function hyperSpace() {
		playSound('hyperSpace');
	}

	function miniExplosion() {
		playSound('miniExplosion');
	}

	function ufoShot() {
		playSound('ufoShot');
	}

	function orbShot() {
		playSound('orbShot');
	}

	function extraLife() {
		playSound('extraLife');
	}

	function spriteExplosion() {
		playSound('spriteExplosion');
	}

	function ufoExplosion() {
		playSound('ufoExplosion');
	}

	function pauseSound(id) {
		mySounds[id].pause();
	}



	function playSound(id) {
		if (id !== 'blip') {
			// mySounds[id].addEventListener('ended', () => {
			// 	playSound(id);
			// });
		} 

		if (mySounds[id].canplay === true) {
			//mySounds[id].volume = .30;
			mySounds[id].play();
			// if(mySounds[id].promise !== undefined) {
			// 	mySounds[id].promise.then(() => {
			// 		console.log('should be playing');

			// 	}).catch(error => {
			// 		console.log(error);
			// 	});
			// } 
		}
	}

	return {
		loadAudio: loadAudio,
		playSound: playSound,
		pauseSound: pauseSound,
		miniExplosion: miniExplosion,
		mainExplosion: mainExplosion,
		orbShot: orbShot,
		ufoShot: ufoShot,
		spriteExplosion: spriteExplosion,
		ufoExplosion: ufoExplosion,
		extraLife: extraLife,
		hyperSpace: hyperSpace,
		levelup: levelup
	}

}());


