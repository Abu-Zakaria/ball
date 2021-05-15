import { get3DDistance, randomNumber } from './utils.js'
import LoadingScreen from './loadingScreen.js'

class Enemy
{
	constructor(scene, player)
	{
		this.object = null;
		this.speed = 0.12;
		this.geometry = null;
		this.radius = 1;
		this.spawn_point = 45
		this.spawn_line = 0
		this.spawn_time = randomNumber(1, 80);
		this.visible = false
		this.scene = scene
		this.player = player

		this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0x0f0f0f, 0xf0f0f0]

		this.texture

		let _this = this

		document.addEventListener('game_reset', function()
		{
			_this.destroy()
		})
	}

	isVisible()
	{
		return this.visible
	}

	setVisible(visiblity)
	{
		this.visible = visiblity
	}

	getSpawnTime()
	{
		return this.spawn_time
	}

	makeBox()
	{
		this.geometry = new THREE.BoxGeometry(this.radius, this.radius, this.radius);
		let rand = randomNumber(0, this.colors.length - 1)

		let material;

		if(Enemy.texture)
		{
			material = new THREE.MeshPhongMaterial({map: Enemy.texture})
		}
		else
		{
			let color = this.colors[rand]
			material = new THREE.MeshPhongMaterial({color: color})
		}

		this.object = new THREE.Mesh(this.geometry, material)

		rand = randomNumber(0, 3)
		this.object.position.x = this.player.position.x + this.spawn_point
		this.object.position.y = this.radius / 2
		if(rand == 0)
		{
			this.object.position.z = this.spawn_line - 2
		}
		else if(rand == 1)
		{
			this.object.position.z = this.spawn_line
		}
		else if(rand == 2)
		{
			this.object.position.z = this.spawn_line + 2
		}

		this.scene.add(this.object)

		return this.object
	}

	moveLeft()
	{
		this.object.position.x -= this.speed;
	}

	hasCollided(player, player_size)
	{
		if( (get3DDistance(this.object.position.x, this.object.position.y, this.object.position.z,
								player.position.x, player.position.y, player.position.z)
								- (this.radius + player_size)) <= 0)
		{
			console.log("Collision data: ", this.object.position.x, this.object.position.y,
								player.position.x, player.position.y)
			return true
		}
		return false
	}

	getPosition()
	{
		return {
			x: this.object.position.x,
			y: this.object.position.y,
			z: this.object.position.z
		}
	}

	check_status()
	{
		if(this.spawn_time < this.clock.getElapsedTime())
		{
			this.setVisible(true)
			this.scene.add(this.object)
		}
	}

	destroy()
	{
		this.object.geometry.dispose()
		this.object.material.dispose()
		this.scene.remove(this.object)
	}
}

Enemy.loadTexture = function() {
	console.log("LOADING TEXTURE: ENEMY")
	
	document.addEventListener('gfx_changed', () => {
		// faking loading the texture, because this texture doesnt depend on gfx settings
		LoadingScreen.loadingCompleted("texture_enemy")
	})

	new THREE.TextureLoader().load('../resources/textures/box.png', (texture) => {
			LoadingScreen.loadingCompleted("texture_enemy")
			Enemy.texture = texture
		})
}
Enemy.texture

export default Enemy