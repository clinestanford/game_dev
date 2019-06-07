/*
text = {
	rotation: ,
	position: {x: , y: },
	text: "",
	font: ,
	fillStyle: ,
	strokeStyle: ,
}
*/
MyGame.objects.text = function(spec) {
	'use strict';

	let rotation = 0; 

	function setText(text) {
		spec.text = "" + text;
	}

	function setFuelText(fuel) {
		spec.text = "fuel : " + fuel + " s";
	}

	function setAngleText(angle) {
		spec.text = "angle : " + Math.abs(angle) + " deg.";
	}

	function setSpeedText(speed) {
		spec.text = "speed : " + speed + " m/s";
	}

	function setStrokeStyle(rgba) {
		spec.strokeStyle = rgba;
	}

	function centerText(){
		spec.position.x = spec.cwidth/2 - spec.context.measureText(spec.text).width/2;
	}
	
	return {
		centerText: centerText,
		setStrokeStyle: setStrokeStyle,
		setFuelText: setFuelText,
		setAngleText: setAngleText,
		setSpeedText: setSpeedText,
		setText: setText,
		get rotation() {return rotation;},
		get position() {return spec.position;},
		get text() {return spec.text;},
		get fillStyle() {return spec.fillStyle;},
		get strokeStyle() {return spec.strokeStyle;}
	}
}