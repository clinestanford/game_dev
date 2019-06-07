
/*
spec = {
	src:   ,
	size:   ,
	center: {x: , y: },
	size: 
}
*/

MyGame.objects.sprite = function(spec) {
	'use strict';

	let imageReady = false;
	let image = new Image();
	let visited = [];
	let score = 0;

	image.onload = function() {
		imageReady = true;
	}

	image.src = spec.src;

	function updateScore(dir, center) {
		if(spec.maze[center.y][center.x].edges[dir] === spec.maze[center.y][center.x].parent) {
			score += 1;
		} else {
			score -= 3;
		}
	}

	function moveLeft(){
		updateScore('w', spec.center);
		if(spec.maze[spec.center.y][spec.center.x].edges.w != null){
			spec.center.x -= 1;
			spec.maze[spec.center.y][spec.center.x].visited = true;
		}

	}
	function moveRight(){
		updateScore('e', spec.center);
		if(spec.maze[spec.center.y][spec.center.x].edges.e != null){
			spec.center.x += 1;
			spec.maze[spec.center.y][spec.center.x].visited = true;
		}
	}
	function moveUp(){
		updateScore('n', spec.center);
		if(spec.maze[spec.center.y][spec.center.x].edges.n != null){
			spec.center.y -= 1;
			spec.maze[spec.center.y][spec.center.x].visited = true;
		}
	}
	function moveDown(){
		updateScore('s', spec.center);
		if(spec.maze[spec.center.y][spec.center.x].edges.s != null){
			spec.center.y += 1;
			spec.maze[spec.center.y][spec.center.x].visited = true;
		}
	}

	let api = {
		moveLeft: moveLeft,
		moveRight: moveRight,
		moveUp: moveUp,
		moveDown: moveDown,
		get size() { return spec.size; },
		get center() { return spec.center; },
		get imageReady() { return imageReady; },
		get image() {return image;},
		get score() {return score;}
	}

	return api;
}