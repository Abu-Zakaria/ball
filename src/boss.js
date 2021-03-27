import { GLTFLoader } from '../lib/GLTFLoader.js'
import Player from './player.js'
import Sound from './sound.js'
import { get3DDistance, randomNumber } from './utils.js'

class Boss
{
	constructor(scene)
	{
		this.path = '../resources/models/minecraft_wither/scene.gltf'
		this.scene = scene
		this.scale = 8
		this.player;
		this.position = {
			x: 30,
			y: 5,
			z: 0
		}
		this.dead = false

		this.max_y = this.position.y + 2
		this.min_y = this.position.y - 2

		this.boss_model
		this.boss_texture_loader
		this.cooling_down = true

		this.bullets = []

		this.sound = Sound.instance

		let _this = this
		document.addEventListener('game_reset', function()
		{
			_this.destroy()
			Boss.summoned = false
			Boss.fighting = false
		})
	}

	make()
	{
		this.boss_texture_loader = new GLTFLoader()
		let _this = this

		console.log("Loading boss")
		this.boss_texture_loader.load(this.path, (gltf) => {
			_this.boss_model = gltf.scene;
			console.log("Loaded boss")

			// _this.boss_model.encoding = THREE.sRGBEncoding;
			_this.boss_model.scale.set(_this.scale, _this.scale, _this.scale)
			_this.boss_model.position.x = _this.position.x + _this.player.position.x
			_this.boss_model.position.y = _this.position.y
			_this.boss_model.position.z = _this.position.z

			console.log(_this.boss_model.position)

			_this.scene.add(_this.boss_model)

			_this.update()
			_this.runFloating()

			setTimeout(() => {
				Boss.fighting = true
			}, 1000)
		})
	}

	update()
	{
		let actions = ['shoot']

		if(!this.cooling_down)
		{
			let key = randomNumber(0, actions.length - 1)

			if(actions[key] == 'shoot')
			{
				this.shoot()
				this.cooling_down = true
			}
		}

		this.moveBullets()

		let rand = randomNumber(0, 20)
		if(rand == 4)
		{
			this.cooling_down = false
		}
	}

	shoot()
	{
		let geometry = new THREE.BoxGeometry(1, 0.1, 0.4)

		let material = new THREE.MeshBasicMaterial({color: 0xffffff})

		let object = new THREE.Mesh(geometry, material)

		object.position.x = this.boss_model.position.x
		object.position.y = this.boss_model.position.y
		object.position.z = this.boss_model.position.z

		this.scene.add(object)

		let velocities = this.getBulletVelocity(object);

		this.bullets.push({
			object: object,
			vx: velocities.vx,
			vy: velocities.vy,
			vz: velocities.vz
		})

		console.log("sound: ", this.sound)
		this.sound.playShootingSound()
	}

	moveBullets()
	{
		for (var i = 0; i < this.bullets.length; i++)
		{
			let bullet = this.bullets[i]

			let speed = 0.4
			let object = bullet.object
			let vx = bullet.vx * speed
			let vy = bullet.vy * speed
			let vz = bullet.vz * speed

			object.position.x -= vx
			object.position.y -= vy
			object.position.z -= vz

			let distance = get3DDistance(object.position.x, object.position.y, object.position.z,
							this.player.position.x,
							this.player.position.y,
							this.player.position.z
						)
			
			if(distance > 0 && distance < 1)
			{
				console.log("got hit")
				Player.dead = true
			}
			if(object.position.y < 0)
			{
				object.geometry.dispose()
				object.material.dispose()
				this.scene.remove(object)
			}
			// if(
			// 	(object.position.x <= (this.player.position.x + this.player.player_size) 
			// 		&& object.position.x >= (this.player.position.x - this.player.player_size) )
			// 	&& (object.position.y <= (this.player.position.y + this.player.player_size) 
			// 		&& object.position.y >= (this.player.position.y - this.player.player_size) )
			// 	&& (object.position.z <= (this.player.position.z + this.player.player_size) 
			// 		&& object.position.z >= (this.player.position.z - this.player.player_size) ))
			// {
			// 	console.log('got hit')
			// }
		}
	}

	getBulletVelocity(bullet)
	{
		let angle_x = Math.atan2(
				bullet.position.y - this.player.position.y,
				bullet.position.x - this.player.position.x
			)

		let angle_z = Math.atan2(
				bullet.position.z - this.player.position.z,
				bullet.position.x - this.player.position.x
			)

		let vx = Math.cos(angle_x) * 1
		let vy = Math.sin(angle_x) * 1
		let vz = Math.sin(angle_z) * 1

		return {
			vx: vx,
			vy: vy,
			vz: vz
		}
	}

	runFloating()
	{
		let status = 'up'
		let _this = this
		setInterval(() => {
			if(_this.boss_model.position.y > _this.max_y)
			{
				status = 'down'
			}
			else if (_this.boss_model.position.y < _this.min_y)
			{
				status = 'up'
			}
			if(status == 'up')
			{
				_this.boss_model.position.y += 0.1
			}
			else if(status == 'down')
			{
				_this.boss_model.position.y -= 0.1
			}
		}, 40)
	}

	destroy()
	{
		this.scene.remove(this.boss_model)
		for (var i = 0; i < this.bullets.length; i++) {
			let bullet = this.bullets[i].object
			console.log("BULLET: ", bullet)
			bullet.geometry.dispose()
			bullet.material.dispose()
			this.scene.remove(bullet)
		}
		this.bullets = []
	}
}

Boss.summoned = false
Boss.fighting = false
export default Boss