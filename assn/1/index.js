
var lastTime;
var currTime;
var timeDelta;
var timeLast;
var events = [];
var printToScreen = [];

function createEvent(name, interval, times) {
	let obj = {
		name: name,
		interval: interval,
		times: times,
		timeToNext: interval,
	};
	return obj;
}

function addEvent() {
	name = document.getElementById("inputName").value;
	interval = parseFloat(document.getElementById("inputInterval").value);
	times = parseInt(document.getElementById("inputTimes").value);
	if(!name || !interval || !times){
		alert("please fill out the boxes before creating");
	}
	events.push(createEvent(name, interval, times));
}

function render(timeDelta) {
	var printTo = document.getElementById("printTo");
	for(var i = printToScreen.length-1; i >= 0; --i){
		var newElement = document.createElement("div");
		newElement.innerHTML += "Event: " + printToScreen[i].name.toString() + '(' + printToScreen[i].times.toString() + ') remaining';
		printTo.appendChild(newElement);
		printTo.scrollTop = printTo.scrollHeight;
	}
}


function update(timeDelta) {
	printToScreen = [];
	for (var i = events.length-1; i >= 0; i--){
		events[i].timeToNext = events[i].timeToNext + timeDelta;
		if(events[i].timeToNext < 0) {
			events[i].timeToNext = events[i].interval - events[i].timeToNext;
			events[i].times--;
			printToScreen.push(events[i]);
			if(events[i].times == 0){
				events.splice(i, 1);
			}
		}
	}
}


function gameLoop() {
	currTime = performance.now();
	timeDelta = lastTime - currTime;
	lastTime = currTime;

	update(timeDelta);
	render();

	requestAnimationFrame(gameLoop);
}

function initialize() {
	lastTime = performance.now();
	gameLoop();
}

