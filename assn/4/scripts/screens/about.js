
MyGame.screens['about'] = (function(game) {
	'use strict';

	function initialize() {
		document.getElementById('about-back-clickable').addEventListener('click', 
			() => game.showScreen('mainmenu'));

	}

	function run() {
		
	}


	return {
		initialize: initialize,
		run: run
	}

}(MyGame.game));