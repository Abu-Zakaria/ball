import LoadingScreen from './loadingScreen.js'
import Settings from './settings.js'

export default class Ground
{
	constructor(scene)
	{
		this.geometry
		this.length = 30000;
		this.width = 12;
		this.object;
		this.texture_path = 'resources/textures/road.jpg'

		let _this = this
		document.addEventListener('gfx_changed', () => {
			_this.destroy()
			_this.make()
		})
		this.scene = scene
	}

	make()
	{
		const texture_loader = new THREE.TextureLoader()
		let _this = this
		texture_loader.load(this.texture_path, (texture) => {
			LoadingScreen.loadingCompleted("texture_ground")
			texture.encoding = THREE.sRGBEncoding;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			texture.repeat.set(_this.length / 10, 1)

			_this.geometry = new THREE.PlaneGeometry(_this.length, _this.width, 5, 5)

			const material = _this.getMaterial(texture)

			_this.object = new THREE.Mesh( _this.geometry, material );

			_this.object.position.y = 0;
			_this.object.rotation.x = - Math.PI / 2;
			_this.object.castShadow = false;
			if(Settings.gfx_quality == 'high')
			{
				_this.object.receiveShadow = true;
			}

			_this.scene.add(_this.object)
		})
	}

	destroy()
	{
		this.object.geometry.dispose()
		this.object.material.dispose()
		this.scene.remove(this.object)
	}

	getMaterial(texture)
	{
		let material;
		if(Settings.gfx_quality == 'high')
		{
			material = new THREE.MeshPhongMaterial({
				map: texture
			})
		}
		else if(Settings.gfx_quality == 'mid' || Settings.gfx_quality == 'low')
		{
			material = new THREE.MeshBasicMaterial({
				map: texture
			})
		}
		return material
	}
}