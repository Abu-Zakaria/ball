import { GLTFLoader } from '../lib/GLTFLoader.js'
import Lights from './lights.js'
import LoadingScreen from './loadingScreen.js'
import Settings from './settings.js'


export default class Lamppost
{
	constructor(scene)
	{
		this.scale = 0.004;
		this.file = './resources/models/lamppost/scene.gltf'
		this.far_position = 7
		this.front_position = 5
		this.scene = scene
		this.lights

		this.lampposts = []
		this.lamppost_model
		this.loadLamppost()

		this.total_render_limit = 4

		let _this = this
		document.addEventListener('gfx_changed', () => {
			LoadingScreen.loadingCompleted("texture_lamppost")
		})

		this.bruh = false
		document.addEventListener('game_reset', () => {
			_this.bruh = true
			_this.destroy()
		})
	}

	loadLamppost()
	{
		const gltf_loader = new GLTFLoader()

		gltf_loader.load('./resources/models/lamppost/scene.gltf', (gltf) => {
			LoadingScreen.loadingCompleted("texture_lamppost")

			this.lamppost_model = gltf.scene

			// let distance = 30

			// for (var i = 0; i < 30; i++)
			// {
			// 	next_item = THREE.SkeletonUtils.clone(gltf.scene)

			// 	working_item.scale.set(this.scale, this.scale, this.scale)

			// 	if(i % 2)
			// 	{
			// 		working_item.position.z = this.far_position
			// 	}
			// 	else
			// 	{
			// 		working_item.position.z = - this.far_position
			// 	}

			// 	working_item.position.x = (Math.floor(i) * distance) + this.front_position
			// 	working_item.position.y = 0.2

			// 	working_item = {
			// 		x: working_item.position.x,
			// 		scene: working_item,
			// 		status: 0
			// 	}

			// 	this.lampposts.push(working_item)

			// 	working_item = next_item
			// }
		})
	}

	update(player_pos_x)
	{
		if(!this.lamppost_model)
		{
			return;
		}
		let far = Settings.fog_far
		let near = Settings.fog_near

		let diff = far / 4

		if(this.lampposts.length == 0)
		{
			for (var i = 0; i < this.total_render_limit; i++)
			{
				let cloned = THREE.SkeletonUtils.clone(this.lamppost_model)
				cloned.position.x = player_pos_x + (diff * (i + 1))
				if(i % 2)
				{
					cloned.position.z = this.far_position
				}
				else
				{
					cloned.position.z = - this.far_position
				}
				cloned.scale.set(this.scale, this.scale, this.scale)

				this.scene.add(cloned)
				this.addLamppostLight(cloned)
				this.lampposts.push(cloned)
			}
		}
		else if(this.lampposts.length > 0)
		{
			let first_lamp = this.lampposts[0]

			let delete_offset = 20
			if(first_lamp.position.x < (player_pos_x - delete_offset))
			{
				this.removeLamppost(first_lamp)

				delete this.lampposts[0]

				let cloned = THREE.SkeletonUtils.clone(this.lamppost_model)

				let last_lamp = this.lampposts[this.lampposts.length - 1]

				cloned.position.x = last_lamp.position.x + diff

				if(last_lamp.position.z < 0)
				{
					cloned.position.z = this.far_position
				}
				else
				{
					cloned.position.z = - this.far_position
				}

				cloned.scale.set(this.scale, this.scale, this.scale)

				this.scene.add(cloned)
				this.addLamppostLight(cloned)
				this.lampposts.push(cloned)

				this.lampposts = this.lampposts.filter(value => value)
			}
		}



		// for (var i = 0; i < this.lampposts.length; i++)
		// {
		// 	let lamppost = this.lampposts[i]

		// 	if( lamppost.status == 0 && (lamppost.x - player_pos_x) < (far) )
		// 	{
		// 		lamppost.status = 1

		// 		this.addLamppost(lamppost)
		// 	}
		// 	else if(lamppost.status == 1 && player_pos_x - lamppost.x > 30)
		// 	{
		// 		lamppost.status = 2
		// 		this.removeLamppost(lamppost.scene)
		// 	}
		// }
	}

	async addLamppostLight(lamppost)
	{
		let vm = this

		let promise = await function()
		{
			return new Promise(resolve => {
				let lights = new Lights()

				lights.makeLamppostLight(vm.scene, 
										lamppost.position.x,
										lamppost.position.y,
										lamppost.position.z,
										'lamppost_' + lamppost.position.x
									)

				// vm.scene.add(lamppost)

				resolve()
			})
		}

		promise()
	}

	removeLamppost(lamppost)
	{
		let name = 'lamppost_' + lamppost.position.x;

		let light_object = this.scene.getObjectByProperty('name', name)

		this.scene.remove(light_object)
		this.scene.remove(lamppost)
	}

	destroy()
	{
		for (var i = 0; i < this.lampposts.length; i++) {
			let lamppost = this.lampposts[i]
			let light = this.scene.getObjectByProperty('name', 'lamppost_' + lamppost.position.x)

			this.scene.remove(light)
			this.scene.remove(lamppost)
		}
	}
}