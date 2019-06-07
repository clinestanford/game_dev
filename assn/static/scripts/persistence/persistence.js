

MyGame.persistence = (function () {
	'use strict';

	let lookupKey = "MyGame.highscores";

	let highscores = [];
	let previousHighScores = localStorage.getItem(lookupKey);


	if(previousHighScores) {
		highscores = JSON.parse(previousHighScores);
	} else {
		highscores = [0,0,0,0,0]
		localStorage[lookupKey] = JSON.stringify(highscores);
	}

	function setScores() {
		let scores = JSON.parse(localStorage[lookupKey]);
		document.getElementById('hs_one').innerHTML = scores[0];
		document.getElementById('hs_two').innerHTML = scores[1];
		document.getElementById('hs_three').innerHTML = scores[2];
		document.getElementById('hs_four').innerHTML = scores[3];
		document.getElementById('hs_five').innerHTML = scores[4];
	}

	function add(val) {
		highscores.push(val)
		highscores.sort((a,b) => {
			return b - a
		});
		highscores.slice(0,5); //should be a sorted array with only 5 elements

		localStorage[lookupKey] = JSON.stringify(highscores);

		setScores();
	}

	return {
		add: add,
		setScores: setScores
	}

}());