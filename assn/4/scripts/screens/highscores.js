
MyGame.screens['highscore'] = (function(game, persistence) {
	'use strict';

	function setScores(scores) {
		let sc1 = document.getElementById('hs_one');
		let sc2 = document.getElementById('hs_two');
		let sc3 = document.getElementById('hs_three');
		let sc4 = document.getElementById('hs_four');
		let sc5 = document.getElementById('hs_five');
		sc1.innerHTML = scores[0];
		sc2.innerHTML = scores[1];
		sc3.innerHTML = scores[2];
		sc4.innerHTML = scores[3];
		sc5.innerHTML = scores[4];
	}

	function initialize() {
		document.getElementById('highscores-back-clickable').addEventListener('click',
			() => game.showScreen('mainmenu'));

		let scores = persistence.returnScores();
		scores.sort((a,b) => {
			return b-a;
		});

		setScores(scores);
		persistence.saveScores();
	}

	function run() {

	}


	return {
		initialize: initialize,
		run: run
	}

}(MyGame.game, MyGame.persistence));