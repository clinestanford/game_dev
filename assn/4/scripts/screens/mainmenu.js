
MyGame.screens['mainmenu'] = (function(game) {
	'use strict';

	function initialize() {
		document.getElementById("play-main").addEventListener('click', 
			() => game.showScreen('maingame'));
		document.getElementById("highscores-main").addEventListener('click', 
			() => game.showScreen('highscore'));
		document.getElementById("about-main").addEventListener('click', 
			() => game.showScreen('about'));
		document.getElementById("help-main").addEventListener('click', 
			() => game.showScreen('help'));
	}

	function run() {

	}

	return {
		initialize: initialize,
		run: run
	}

}(MyGame.game));