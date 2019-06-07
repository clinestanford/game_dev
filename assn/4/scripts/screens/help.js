
MyGame.screens['help'] = (function(game) {
	'use strict';

	function initialize() {
		document.getElementById('help-back-clickable').addEventListener('click',
			() => game.showScreen('mainmenu'));

	}

	function run() {
		
	}


	return {
		initialize: initialize,
		run: run
	}

}(MyGame.game));