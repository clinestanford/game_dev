



MyGame.renderer.particleSystemRenderer = function(system, graphics, img1, img2) {
	'use strict';


	//will be using graphis.drawObject(img, center, rotation, size);
	function render(elapseTime) {

		let toRender1 = system.obj1;
		Object.getOwnPropertyNames(toRender1).forEach(val => {
			let curObj = toRender1[val];
			if(img1){
				graphics.drawObject(system.img1, curObj.center, curObj.rotation, curObj.size);	
			}			
		});

		let toRender2 = system.obj2;
		Object.getOwnPropertyNames(toRender2).forEach(val => {
			let curObj = toRender2[val];
			if(img2){
				graphics.drawObject(system.img2, curObj.center, curObj.rotation, curObj.size);	
			}
		});
	}

	return {
		render: render
	}
}