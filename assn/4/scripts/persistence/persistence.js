

MyGame.persistence = (function () {
	'use strict';

	let highscores = {};
	let previousHighScores = localStorage.getItem('MyGame.highscores');

	if(previousHighScores !== null) {
		highscores = JSON.parse(previousHighScores);
	} else {
		highscores = {'one': 0, 'two': 0, 'three': 0, 'four': 0, 'five': 0}
	}

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

	function add(key, val) {
		highscores[key] = val;
		localStorage['MyGame.highscores'] = JSON.stringify(highscores);
		let curScores = returnScores();

		for(let i = 0; i < curScores.length; ++i) {
			curScores[i] = parseInt(curScores[i]);
		}

		curScores.sort((a,b) => {
			return b-a;
		});

		setScores(curScores);
	}

	function remove(key, val) {
		delete highscores[key];
		localStorage[MyGame.highscores] = JSON.stringify(highscores);
	}

	function returnScores() {
		let scores = [];
		for(let key in highscores){
			scores.push(parseInt(highscores[key]));
		}
		return scores.sort();
	}

	function saveScores() {
		localStorage['MyGame.highscores'] = JSON.stringify(highscores);
	}

	return {
		saveScores: saveScores,
		add:add,
		remove:remove,
		returnScores:returnScores
	}

}());