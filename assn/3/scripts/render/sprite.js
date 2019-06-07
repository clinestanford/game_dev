


MyGame.render.sprite = (function(graphics) {

	function render(spec){
		if(spec.imageReady){

			graphics.sprite(spec.image, spec.center, spec.size);
		}
	}

	function showCrumbs(spec) {
		for (let center in spec.visited) {
			graphics.sprite(spec.image, center, spec.size);
		}
	}

	return {
		render: render,
		showCrumbs: showCrumbs
	}

}(MyGame.graphics));