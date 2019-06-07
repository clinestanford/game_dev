



MyGame.renderer.particleSystemRenderer = function(system, graphics) {
	'use strict';


	//will be using graphis.drawObject(img, center, rotation, size);
	function render(getLocalPosition) {

		//drawImage(asset, center, rotation, size)

		let toRender1 = system.obj1;
		Object.getOwnPropertyNames(toRender1).forEach(val => {
			let curObj = toRender1[val];
			graphics.drawImage(system.img1, getLocalPosition(curObj.center), curObj.rotation, curObj.size);	
		});

		let toRender2 = system.obj2;
		Object.getOwnPropertyNames(toRender2).forEach(val => {
			let curObj = toRender2[val];
			graphics.drawImage(system.img2, getLocalPosition(curObj.center), curObj.rotation, curObj.size);	
		});
	}

	return {
		render: render
	}
}