import { GLTFLoader } from '../lib/GLTFLoader.js'
import Lights from './lights.js'
import LoadingScreen from './loadingScreen.js'


export default class Lamppost
{
	constructor()
	{
		this.scale = 0.004;
		this.file = './resources/models/lamppost/scene.gltf'
		this.far_position = 7
		this.front_position = 5
		this.scene
		this.lights

		this.lampposts = []
	}

	init(scene)
	{
		this.scene = scene
		const gltf_loader = new GLTFLoader()

		gltf_loader.load('./resources/models/lamppost/scene.gltf', (gltf) => {
			LoadingScreen.loadingCompleted("texture_lamppost")

			let working_item = gltf.scene
			let next_item

			let distance = 30

			for (var i = 0; i < 30; i++)
			{
				next_item = THREE.SkeletonUtils.clone(gltf.scene)

				working_item.scale.set(this.scale, this.scale, this.scale)

				if(i % 2)
				{
					working_item.position.z = this.far_position
				}
				else
				{
					working_item.position.z = - this.far_position
				}

				working_item.position.x = (Math.floor(i) * distance) + this.front_position
				working_item.position.y = 0.2

				working_item = {
					x: working_item.position.x,
					scene: working_item,
					status: 0
				}

				this.lampposts.push(working_item)

				working_item = next_item
			}

		})

		// gltf_loader.load('./resources/models/lamppost/scene.gltf', (gltf) => {

		// 	gltf.scene.scale.set(this.scale, this.scale, this.scale)
		// 	gltf.scene.position.x = this.front_position
		// 	gltf.scene.position.y = - 0.3
		// 	gltf.scene.position.z = this.far_position

		// 	let lights = new Lights()

		// 	lights.makeLamppostLight(scene, 
		// 							gltf.scene.position.x,
		// 							gltf.scene.position.y,
		// 							gltf.scene.position.z
		// 						)


		// 	scene.add(gltf.scene)
		// })
	}

	update(player_pos_x, near, far)
	{
		for (var i = 0; i < this.lampposts.length; i++)
		{
			let lamppost = this.lampposts[i]

			if( lamppost.status == 0 && (lamppost.x - player_pos_x) < (far) )
			{
				lamppost.status = 1

				console.log("Adding lamppost");
				this.addLamppost(lamppost)
				console.log("Test")
			}
			else if(lamppost.status == 1 && player_pos_x - lamppost.x > 30)
			{
				lamppost.status = 2
				console.log("removing")
				this.removeLamppost(lamppost.scene)
			}
		}
	}

	async addLamppost(lamppost)
	{
		let vm = this

		let promise = await function()
		{
			return new Promise(resolve => {
				let lights = new Lights()

				lights.makeLamppostLight(vm.scene, 
										lamppost.scene.position.x,
										lamppost.scene.position.y,
										lamppost.scene.position.z,
										'lamppost_' + lamppost.scene.position.x
									)

				vm.scene.add(lamppost.scene)

				console.log("Added lamppost")
				resolve()
			})
		}

		promise()
	}

	async removeLamppost(lamppost)
	{
		let vm = this

		let promise = await function()
		{
			return new Promise(resolve => {
				let name = 'lamppost_' + lamppost.position.x;

				let light_object = vm.scene.getObjectByProperty('name', name)

				vm.scene.remove(light_object)
				vm.scene.remove(lamppost)

				console.log("removed")
				resolve()
			})
		}

		promise()
	}
}