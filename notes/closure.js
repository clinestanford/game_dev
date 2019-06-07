


function addTwo(one, two){
	//this function has a name
	return one + two
}

let addThree = function(one, two, three){
	//anonymous function assigned to variable
	return one + two + three
}

let cube = function(x) {return x * x * x}(3);
//defines another anonymous, that is invoked with 3


//this typically refers to the object calling the this
let car = {
	position: {x:0, y:0},
	direction: {x:.5, y:.5},
	speed: 1,
	color: 'rgb(255, 0, 0)',
	moveForward: function(){
		this.position.x += (this.direction.x * this.speed);
		this.position.y += (this.direction.y * this.speed);
	},
	moveBackward: function(){
		this.position.x -= (this.direction.x * this.speed);
		this.position.y -= (this.direction.y * this.speed);
	},
	report: function(){
		console.log(`x: ${this.position.x}, y: ${this.position.y}`);
	}
}

function Car(spec){
	function moveForward(){
		spec.position.x += (spec.direction.x * spec.speed);
		spec.position.y += (spec.direction.y * spec.speed);
	};
	function moveBackward(){
		spec.position.x -= (spec.direction.x * spec.speed);
		spec.position.y -= (spec.direction.y * spec.speed);
	};
	function report(){
		console.log(`x: ${spec.position.x}, y: ${spec.position.y}`);
	};

	return {
		moveForward: moveForward,
		moveBackward: moveBackward,
		report: report
	};
}

car.report();

//capital because it is an object creator
//we have created clojure
let myFerrari = Car({
	position: {x:1.0, y:1.0},
	direction: {x: 0.5, y:0.5},
	speed: 1.0
})

let civic = Car({
	position: {x:2.0, y:2.0},
	direction: {x: 0.5, y:0.5},
	speed: .001
})

myFerrari.report();
myFerrari = null; //how to release memory


function Fibonacci(){
	let memory = {
		0:1,
		1:1
	}
	return function inner(n){
		if(!(n in memory)) {
			//calculate and stores in the hash table
			//using closure for memoization
			memory[n] = inner(n-1) + inner(n-2);
		}

		return memory[n];
	}
}

let myFib = Fibonacci();

console.log(myFib(10));