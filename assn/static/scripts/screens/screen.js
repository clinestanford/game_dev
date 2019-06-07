

MyGame.screens.mainmenu = (function(main) {
	'use strict';

	function initialize() {
		document.getElementById("buttonPlay").addEventListener('click', 
			() => main.showScreen('gameplay'));
		document.getElementById("buttonHighs").addEventListener('click', 
			() => main.showScreen('highscores'));
		document.getElementById("buttonAbout").addEventListener('click', 
			() => main.showScreen('about'));
		document.getElementById("buttonHelp").addEventListener('click', 
			() => main.showScreen('help'));
	}

	function run() {

	}

	return {
		initialize: initialize,
		run: run
	}

}(MyGame.main));

MyGame.screens.help = (function(main) {
	'use strict';

	function initialize() {
		document.getElementById('helpButton').addEventListener('click', () => {
			main.showScreen('mainmenu');
		});
	}

	function run() {

	}

	return {
		initialize: initialize,
		run: run
	}

}(MyGame.main));

MyGame.screens.about = (function(main) {
	'use strict';

	function initialize() {
		document.getElementById('aboutButton').addEventListener('click', () => {
			main.showScreen('mainmenu');
		});
	}

	function run() {

	}

	return {
		initialize: initialize,
		run: run
	}

}(MyGame.main));

MyGame.screens.highscores = (function(main) {
	'use strict';

	function initialize() {
		document.getElementById('highscoresButton').addEventListener('click', () => {
			main.showScreen('mainmenu');
		});
	}

	function run() {

	}

	return {
		initialize: initialize,
		run: run
	}

}(MyGame.main));


