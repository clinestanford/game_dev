
/*
spec = {
	size: n // n*n	
}
*/


MyGame.objects.maze = function (spec) {

	let imageReady = false;
	let image = new Image();
	let showCrumb = false;

	image.onload = function() {
		imageReady = true;
	}

	image.src = spec.src;

	function toggleCrumb() {
		if (showCrumb === false) {
			showCrumb = true;
		} else {
			showCrumb = false;
		}
	}

	function rand(size){
		return Math.floor(Math.random() * size)
	}

	//square, square.y, square.x
	function helper(squares, row, col) {
		try{
			return squares[row][col];
		} catch(error) {
			return null;
		}
	}

	function connectTwo(maze, connected, square) {
		let top = helper(maze, square.y-1, square.x);//maze[square.y - 1][square.x];
		let rig = helper(maze, square.y, square.x+1);//maze[square.y][square.x + 1];
		let bot = helper(maze, square.y+1, square.x);
		let lef = helper(maze, square.y, square.x-1);
		let possible = [0,1,2,3];
		let index = rand(possible.length);
		let found = false;

		while(!found) {
			if(top && connected.includes(top) && possible[index] === 0) {
				top.edges.s = square;
				square.edges.n = top;
				connected.push(square);
				found = true;
			}else if(rig && connected.includes(rig) && possible[index] === 1) {
				rig.edges.w = square;
				square.edges.e = rig;
				connected.push(square);
				found = true;
			}else if(bot && connected.includes(bot) && possible[index] === 2) {
				bot.edges.n = square;
				square.edges.s = bot;
				connected.push(square);
				found = true;
			}else if(lef && connected.includes(lef) && possible[index] === 3) {
				lef.edges.e = square;
				square.edges.w = lef;
				connected.push(square);
				found = true;
			}
			possible.splice(index, 1);
			index = rand(possible.length);
		}
	}

	function pushToFrontier(maze, connected, frontier, square) {
		let top = helper(maze, square.y-1, square.x);
		let rig = helper(maze, square.y, square.x+1);
		let bot = helper(maze, square.y+1, square.x);
		let lef = helper(maze, square.y, square.x-1);

		if(top && !connected.includes(top) && !frontier.includes(top)) {
			frontier.push(top);
		}
		if(rig && !connected.includes(rig) && !frontier.includes(rig)) {
			frontier.push(rig);
		}
		if(bot && !connected.includes(bot) && !frontier.includes(bot)) {
			frontier.push(bot);
		}
		if(lef && !connected.includes(lef) && !frontier.includes(lef)) {
			frontier.push(lef);
		}
	}

	function createMaze(maze) {
		connected = [];
		frontier = [];
		let startRow = rand(spec.size);
		let startCol = rand(spec.size);
		connected.push(maze[startRow][startCol]);
		pushToFrontier(maze, connected, frontier, maze[startRow][startCol]);

		while(frontier.length > 0) {

			let index = rand(frontier.length);
			connectTwo(maze, connected, frontier[index]);
			pushToFrontier(maze, connected, frontier, frontier[index]);
			frontier.splice(index, 1);

		}

		return connected;
	}

	function generateSquares() {

		let maze = [];
		for (let row = 0; row < spec.size; row++) {
		    maze.push([]);
		    for (let col = 0; col < spec.size; col++) {
		        maze[row].push({
		            x: col, 
		            y: row, 
		            edges: {
		                n: null,
		                s: null,
		                w: null,
		                e: null
		            },
		            visited: false
		        });
		    }
		}

		connected = createMaze(maze);

		return maze;
	}

	function getChildren(square) {
		let children = [];

		if(square.edges.n != null){
			children.push(square.edges.n);
		}
		if(square.edges.e != null){
			children.push(square.edges.e);
		}
		if(square.edges.s != null){
			children.push(square.edges.s);
		}
		if(square.edges.w != null){
			children.push(square.edges.w);
		}

		return children;
	}

	function fillParents(squares) {
		let start = squares[spec.size - 1][spec.size - 1];
		let finish = squares[0][0];

		let q = []; //initialize the queue
		q.push(start);

		let visited = new Set(); //keep track of all squares visited

		start.parent = null;

		while(q.length !== 0) {

			let currSquare = q.shift();
			visited.add(currSquare);

			let children = getChildren(currSquare);

			for (let i = 0; i < children.length; ++i) {

				if(!visited.has(children[i])) {
					children[i].parent = currSquare;
					q.push(children[i]);
				}
			}
		}
	}

	spec.squares = generateSquares();
	fillParents(spec.squares);

	let api = {
		get size() {return spec.size;},
		get squares() {return spec.squares},
		get showCrumb() {return showCrumb},
		toggleCrumb: toggleCrumb,
		get image() {return image}
	}

	return api;
}


//test for push frontier

// let frontier = [];
// let connected = [];

// //maze[2][1] is row 2, col 1

// let square = maze[1][1];
// connected.push(square);
// connected.push(maze[1][2]);
// connected.push(maze[0][1]);
// connected.push(maze[2][1]);
// pushToFrontier(maze, connected, frontier, square);

// console.log("connected: ", connected);
// console.log("frontier: ", frontier);


//test for connect two

// maze[1][1].edges.e = maze[1][2];
// maze[1][2].edges.w = maze[1][1];

// connected = [maze[1][1], maze[1][2]];

// square = maze[0][1];

// connectTwo(maze, connected, square);

//test for connection at all

// maze[0][0].edges.e = 1;
// maze[0][1].edges.w = 1;

// maze[0][1].edges.s = 1;
// maze[1][1].edges.n = 1;

// maze[1][1].edges.s = 1;
// maze[2][1].edges.n = 1;

// maze[2][1].edges.e = 1;
// maze[2][2].edges.w = 1;
