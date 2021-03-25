import { GLTFLoader } from '../lib/GLTFLoader.js'

class Boss
{
	constructor(scene)
	{
		this.path = '../resources/models/minecraft_wither/scene.gltf'
		this.scene = scene
		this.scale = 7
		this.player_position = {
			x: 0,  // will be changed when created
		}
		this.position = {
			x: 15,
			y: 5,
			z: 0
		}

		this.max_y = this.position.y + 2
		this.min_y = this.position.y - 2
	}

	make()
	{
		let gltf_loader = new GLTFLoader()
		let _this = this

		console.log("Loading boss")
		gltf_loader.load(this.path, (gltf) => {
			let model = gltf.scene;
			console.log("Loaded boss")

			// model.encoding = THREE.sRGBEncoding;
			model.scale.set(_this.scale, _this.scale, _this.scale)
			model.position.x = _this.position.x + _this.player_position.x
			model.position.y = _this.position.y
			model.position.z = _this.position.z

			console.log(model.position)

			_this.scene.add(model)

			_this.update()
			_this.runFloating()
		})
	}

	update()
	{
		
	}

	runFloating()
	{
		
	}
}

Boss.summoned = false
Boss.fighting = false
export default Boss