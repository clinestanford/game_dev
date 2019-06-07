


MyGame.Keyboard = function(){

	let boardState = {
	}

	function onKeyDown(e){
		boardState[e.key] = e.timestamp;
	}

	function onKeyUp(e){
		delete boardState[e.key];
	}

	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);

	return boardState;
}