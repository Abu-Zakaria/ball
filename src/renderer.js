export default class Renderer
{
	constructor()
	{
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = true;
		// console.log()
		// this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		// this.renderer.outputEncoding = THREE.sRGBEncoding

		document.getElementById('playground').appendChild(this.renderer.domElement);
	}

	getRenderer()
	{
		return this.renderer
	}

	low_gfx()
	{
		this.renderer.setPixelRatio(0.7)
	}
	mid_gfx()
	{
	}
	high_gfx()
	{
	}
}

