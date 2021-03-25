import Sound from './sound.js'
import Settings from './settings.js'
import Boss from './boss.js'

export default class Player
{
	constructor(scene, camera)
	{
		this.player;
		this.scene = scene;
		this.player_size = 0.7;
		this.camera = camera
		this.jumping = false
		this.color = 0x00ffff;

		this.a_y = 0.5; // gravity
		this.v_y = 0; // speed

		this.sound = new Sound()
		this.sound.loadJump()

		this.speed = 0.1;
		this.lookAhead = 0.1

		let _this = this
		document.addEventListener('gfx_changed', function()
		{
			_this.destroy()
			_this.make()
		})
	}

	make()
	{
		// player object
		const player_geometry = new THREE.SphereGeometry(this.player_size, 100, 100);
		const player_material = this.getMaterial(this.color);

		this.player = new THREE.Mesh(player_geometry, player_material)

		this.player.position.y = (this.player_size);

		if(Settings.gfx_quality == 'high')
		{
			this.player.castShadow = true;
		}

		this.player.name = 'player'

		this.scene.add(this.player)
	}

	updateJump(camer_pos)
	{
		if(this.jumping)
		{
			let dif = (this.v_y - this.a_y) / 30
			console.log('asd', this.player.position.y, dif, this.player.position.y + dif)
			if(this.player.position.y + dif <= 0.5)
			{
				this.player.position.y = this.player_size;
				// this.camera.position.y = camer_pos.y
				this.jumping = false
				return
			}
			this.player.position.y += dif;

			this.camera.position.y += dif / 2

			this.v_y -= this.a_y;
		}
	}

	jump()
	{
		if(this.jumping)
		{
			return;
		}

		this.v_y = 10;
		this.jumping = true;

		this.sound.playJump();
	}

	run()
	{
		this.player.position.x += this.speed

		if(this.camera.position.y < 9)
		{
			this.camera.position.y += this.speed / 2
		}

		if(this.camera.position.z > 0)
		{
			this.camera.position.z -= this.speed / 3
		}
		else
		{
			this.camera.position.x += this.speed;
		}

		if(this.lookAhead < 24)
			{
				this.lookAhead += this.speed
			}
		
		this.camera.lookAt(
				this.player.position.x + this.lookAhead,
				this.player.position.y,
				this.player.position.z
			)

		if(this.player.position.x > 60 && !Boss.summoned)
		{
			Boss.summoned = true
			let boss = new Boss(this.scene)
			boss.player_position.x = this.player.position.x

			boss.make()
		}
	}

	getPosition()
	{
		return this.player.position
	}

	getMaterial(color)
	{
		let settings = Settings.gfx_quality
		let material;

		if(settings == "low" || settings == "mid")
		{
			material = new THREE.MeshBasicMaterial({ color: color})
		}
		else if(settings == "high")
		{
			material = new THREE.MeshPhongMaterial({ color: color})
		}
		return material
	}

	destroy()
	{
		this.player.geometry.dispose()
		this.player.material.dispose()
		this.scene.remove(this.player)
	}
}