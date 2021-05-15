import Settings from './settings.js'

export default class Renderer
{
	constructor()
	{
		let options = {}

		if (Settings.gfx_quality == "mid" || Settings.gfx_quality == 'high')
		{
			options['antialias']  = true 
		}

		this.renderer = new THREE.WebGLRenderer(options);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = true;
		// console.log()
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.outputEncoding = THREE.sRGBEncoding 

		this.default_pixel_ratio = this.renderer.getPixelRatio()

		document.getElementById('playground').appendChild(this.renderer.domElement);

		let _this = this
		document.addEventListener('gfx_changed', () => {
			let gfx = Settings.gfx_quality

			if(gfx == 'low')
			{
				_this.low_gfx()
			}
			else if(gfx == 'mid')
			{
				_this.mid_gfx()
			}
			else if(gfx == 'high')
			{
				_this.high_gfx()
			}
		})
	}

	getRenderer()
	{
		return this.renderer
	}

	low_gfx()
	{
		console.log("LOW", window.devicePixelRatio, window.devicePixelRatio / 2)
		this.renderer.setPixelRatio(window.devicePixelRatio / 2)
	}
	mid_gfx()
	{
		this.renderer.setPixelRatio(this.default_pixel_ratio)
	}
	high_gfx()
	{
		this.renderer.setPixelRatio(this.default_pixel_ratio)
	}
}

