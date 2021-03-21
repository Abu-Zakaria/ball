import { GLTFLoader } from '../lib/GLTFLoader.js'
import Lights from './lights.js'


export default class Lamppost
{
	constructor()
	{
		this.scale = 0.004;
		this.file = './resources/models/lamppost/scene.gltf'
		this.far_position = 7
		this.front_position = 5
	}

	make(scene)
	{
		const gltf_loader = new GLTFLoader()

		gltf_loader.load('./resources/models/lamppost/scene.gltf', (gltf) => {
			console.log(">>>", gltf)

			gltf.scene.scale.set(this.scale, this.scale, this.scale)
			gltf.scene.position.x = this.front_position
			gltf.scene.position.y = - 0.3
			gltf.scene.position.z = - this.far_position

			let lights = new Lights()

			lights.makeLamppostLight(scene, 
									gltf.scene.position.x,
									gltf.scene.position.y,
									gltf.scene.position.z
								)


			scene.add(gltf.scene)
		})

		gltf_loader.load('./resources/models/lamppost/scene.gltf', (gltf) => {

			gltf.scene.scale.set(this.scale, this.scale, this.scale)
			gltf.scene.position.x = this.front_position
			gltf.scene.position.y = - 0.3
			gltf.scene.position.z = this.far_position

			let lights = new Lights()

			lights.makeLamppostLight(scene, 
									gltf.scene.position.x,
									gltf.scene.position.y,
									gltf.scene.position.z
								)


			scene.add(gltf.scene)
		})
	}
}