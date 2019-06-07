
MyGame.sounds = (function(assets) {

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

	function powerUp() {
		playSound('powerUp');
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

	function gameMusic(){
		playSound('gameMusic');
	}

	function blip(id) {
		playSound('blip');
	}

	function playSound(id) {
		if (assets.hasOwnProperty(id)) {
			let promise = assets[id].play();
			if(promise !== null){
				promise.catch(() => {assets[id].play();})
			}
		}
	}

	return {
		blip: blip,
		playSound: playSound,
		pauseSound: pauseSound,
		miniExplosion: miniExplosion,
		mainExplosion: mainExplosion,
		orbShot: orbShot,
		ufoShot: ufoShot,
		spriteExplosion: spriteExplosion,
		ufoExplosion: ufoExplosion,
		powerUp: powerUp,
		hyperSpace: hyperSpace,
		levelup: levelup,
		gameMusic: gameMusic
	}

}(MyGame.assets));


