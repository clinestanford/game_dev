

MyGame.game = (function(screens, sounds, input) {

	let mainKeyboard;


	function showScreen(id) {

		if(id === 'mainmenu') {
			addEscapeListener();
		}

		let active = document.getElementsByClassName("active");
		for (let screen = 0; screen < active.length; ++screen) {
			active[screen].classList.remove('active');
		}

		screens[id].run();
		document.getElementById(id).classList.add('active');
	}

	function showMain() {
		showScreen('mainmenu');
	}

	function nothing() {

	}

	function removeEscapeListener() {
		mainKeyboard.register('Escape', () => {});
	}

	function addEscapeListener() {
		mainKeyboard.register('Escape', showMain);
	}

	function initialize() {

		// let w = window.innerWidth;
		// let h = window.innerHeight;

		// let game = document.getElementById('game');
		// game.style.cssText = 'width: '+ w + 'px';
		// game.style.cssText = 'height: '+ h + 'px';



		// var canvas = document.getElementById('gameCanvas');
		// canvas.style.cssText = 'width: '+ w + 'px';
		// canvas.style.cssText = 'height: '+ h + 'px';

		sounds.loadAudio();

		//this needs to be better, implement 
		//handleEscape();
		mainKeyboard = input.keyboard({}, 'notGame');
		addEscapeListener();

		for(screen in screens) {
			if(screens.hasOwnProperty(screen)) {
				screens[screen].initialize();
			}
		}

		clickables = document.getElementsByClassName('clickable');

		for(var i = 0; i < clickables.length; ++i) {
			clickables[i].addEventListener('mouseover', () => {
				sounds.playSound('blip');
			});
		}

		document.getElementById("mainmenu").addEventListener('mouseover', () => {
			sounds.playSound("menuScreen");
		})

		document.getElementById("maingame").addEventListener('mouseover', () => {
			sounds.pauseSound("menuScreen");
			sounds.playSound("gamePlay");
		})

		showScreen('mainmenu');
	}



	return {
		initialize: initialize,
		showScreen: showScreen,
		removeEscapeListener: removeEscapeListener
	}

}(MyGame.screens, MyGame.sounds, MyGame.input));