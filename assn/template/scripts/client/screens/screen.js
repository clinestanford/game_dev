

MyGame.screens.mainmenu = (function(main, sounds) {
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
		let clickables = document.getElementsByClassName('clickable');

		for(let i = 0; i < clickables.length; ++i) {
			clickables[i].addEventListener('mouseover', () => {
				sounds.blip();
			});
		}
		// forEach(val => {
		// 	val.addEventListener('mouseover', sounds.blip);
		// });
	}

	function run() {

	}

	return {
		initialize: initialize,
		run: run
	}

}(MyGame.main, MyGame.sounds));

MyGame.screens.help = (function(main, persistence) {
	'use strict';

	let keyboard;
	let controls;

	let selected = {
		'thrust': false,
		'hyperspace': false,
		'rotateLeft': false,
		'rotateRight': false,
		'fire': false
	};

	function initialize() {
		document.getElementById('helpButton').addEventListener('click', () => {
			main.showScreen('mainmenu');
		});

		controls = persistence.getControls();
		document.getElementById('inputhyperspace').innerHTML = getText(controls['hyperspace']);
		document.getElementById('inputthrust').innerHTML = getText(controls['thrust']);
		document.getElementById('inputrotateRight').innerHTML = getText(controls['rotateRight']);
		document.getElementById('inputrotateLeft').innerHTML = getText(controls['rotateLeft']);
		document.getElementById('inputfire').innerHTML = getText(controls['fire']);
	}

	function getText(key){
		if(key === ' '){
			return 'space';
		} else {
			return key;
		}
	}

	function changeControl(action, key){
		if(controls.hasOwnProperty(action)){
			controls[action] = key;
			persistence.setControl(action, key);
			selected[action] = false;
			document.getElementById('input' + action).innerHTML = getText(key);
			resetBackgrounds();
		}
	}

	function resetBackgrounds(){
		let inputButtons = document.getElementsByClassName('getInput');
		for(let i = 0; i < inputButtons.length; ++i){
			inputButtons[i].style.backgroundColor = 'limegreen';
		}		
	}

	function run() {

		keyboard = MyGame.simpleInput(selected, changeControl);

		let inputButtons = document.getElementsByClassName('getInput');
		console.log(inputButtons);
		for(let i = 0; i < inputButtons.length; ++i){
			inputButtons[i].addEventListener('click', () => {
				inputButtons[i].style.backgroundColor = 'yellow';
				selected[inputButtons[i].innerHTML] = true;
			});
		}


	}

	return {
		initialize: initialize,
		run: run
	}

}(MyGame.main, MyGame.persistence));

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


