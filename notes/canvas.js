
MyGame.graphics = (function(){

	function Texture(spec) {
		let ready = false;
		let image = new Image();
		image.onload = function() {
			ready = true;
		};
		image.src = spec.imageSrc;

		function draw() {
			if(ready){
				context.save();

				context.translate();
				context.rotate();
				context.translate();
				context.drawImage(
					image,
					spec.center.x - spec.width/2,
					spec.center.y - spec.height/2,
					spec.width, spec.heigh);

				context.restore();
			}
		};

		function updateRotation(howMuch) {
			spec.rotation += howMuch;
		};


		return {
			draw: draw,
			updateRotation: updateRotation
		};
	}

	let api = {
		clear: clear,
		Texture: Texture
	}

}());












