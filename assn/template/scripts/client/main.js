
/*
This will be the main class that has
access to the rest of the project.
*/

MyGame.main = (function() {
	'use strict';

	function showScreen(id) {

		//find and remove everything witht the active class
		let active = document.getElementsByClassName('active');
		for(let i = 0; i < active.length; ++i) {
			active[i].classList.remove('active');
		}

		MyGame.screens[id].run();
		document.getElementById(id).classList.add('active')
	}

	function initialize() {

		//initialize all of the screens
		Object.keys(MyGame.screens).forEach(val => {
			MyGame.screens[val].initialize();
		});

		document.getElementById('mainmenu').classList.add('active');
	}


	return {
		initialize: initialize,
		showScreen: showScreen,
	}

}());