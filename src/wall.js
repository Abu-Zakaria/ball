import LoadingScreen from './loadingScreen.js'
import Settings from './settings.js'

export default class Wall
{
	constructor(scene)
	{
		this.color = 0x0000ff
		this.height = 10
		this.length = 1000
		this.object;
		this.far_position = 8
		this.scene = scene
		this.texture

		let _this = this
		document.addEventListener('gfx_changed', function()
		{
			_this.destroy()
			_this.make()
		})
	}

	make()
	{
		const texture_loader = new THREE.TextureLoader()

		const _this = this
		this.texture = texture_loader.load('resources/textures/wall.jpg', (texture) => {
			LoadingScreen.loadingCompleted("texture_wall")
			let geometry = new THREE.PlaneGeometry(_this.length, _this.height, 5, 5)

			texture.encoding = THREE.sRGBEncoding;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			texture.repeat.set(_this.length / 10, 1)

			let material = _this.getMaterial(texture)

			_this.object = new THREE.Mesh(geometry, material);

			_this.object.position.z = - _this.far_position;
			_this.object.position.y = (_this.height / 2);

			_this.cloned = _this.object.clone();

			_this.scene.add(_this.object)

			_this.cloned.rotation.x = Math.PI
			_this.cloned.position.z = _this.far_position;

			_this.scene.add(_this.cloned)
		})
	}

	getMaterial(texture)
	{
		let settings = Settings.gfx_quality
		let material
		if(settings == 'low' || settings == 'mid')
		{
			material = new THREE.MeshBasicMaterial({
				map: texture
			})
		}
		else if(settings == 'high')
		{
			material = new THREE.MeshPhongMaterial({
				map: texture
			})
		}
		return material
	}

	destroy()
	{
		this.texture.dispose()
		this.object.geometry.dispose()
		this.object.material.dispose()
		this.scene.remove(this.object)
		this.cloned.geometry.dispose()
		this.cloned.material.dispose()
		this.scene.remove(this.cloned)
	}
}