import Sound from './sound.js'
import Settings from './settings.js'
import Boss from './boss.js'
import Enemy from './enemy.js'
import { randomNumber } from './utils.js'
import Lamppost from './lamppost.js'

class Player
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

		this.sound = Sound.instance
		this.sound.loadJump()

		this.speed = 0.1;
		this.lookAhead = 0.1
		this.boss
		this.lamppost

		this.right_path_coord = 2
		this.left_path_coord = -2
		this.going_right_path = false
		this.going_left_path = false

		this.enemies = []

		let _this = this
		document.addEventListener('gfx_changed', function()
		{
			_this.destroy()
			_this.make()
		})

		document.addEventListener('game_reset', function()
		{
			_this.destroy()
			Player.dead = false
			Player.stage = 1
			_this.enemies = []
		})

		document.addEventListener('second_stage_reached', function()
		{
			Player.stage = 2
			console.log('second stage')
			for (var i = 0; i < 3000; i++)
			{
				_this.speed += 0.1 / 3000
			}
		})
		document.addEventListener('third_stage_reached', function()
		{
			Player.stage = 3
			console.log('third stage')
			for (var i = 0; i < 3000; i++)
			{
				_this.speed += 0.2 / 3000
			}
		})

		document.addEventListener('last_stage_reached', function()
		{
			Player.stage = 4
			console.log('last stage')
		})
		document.addEventListener('game_difficulty_changed', function()
		{
			console.log("listened", Settings.game_difficulty)
			if(Settings.game_difficulty === 0)
			{
				_this.speed = 0.1
			}
			else if (Settings.game_difficulty == 1)
			{
				_this.speed = 0.2
			}
			else if (Settings.game_difficulty == 2)
			{
				_this.speed = 0.3
			}
		})
	}

	make()
	{
		// player object
		const player_geometry = new THREE.SphereGeometry(this.player_size, 100, 100);
		const player_material = this.getMaterial(this.color);

		this.player = new THREE.Mesh(player_geometry, player_material)

		this.player.position.x = 0;
		this.player.position.y = (this.player_size);
		this.player.position.z = 0;

		if(Settings.gfx_quality == 'high')
		{
			this.player.castShadow = true;
		}

		this.player.name = 'player'

		this.scene.add(this.player)

		this.lamppost = new Lamppost(this.scene)
	}

	updateJump(camer_pos)
	{
		if(this.jumping)
		{
			let dif = (this.v_y - this.a_y) / 30
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

	goRight()
	{
		if(this.going_left_path)
		{
			return;
		}
		if(this.player.position.z <= this.right_path_coord)
		{
			this.going_right_path = true
		}
	}

	goLeft()
	{
		if(this.going_right_path)
		{
			return;
		}
		if(this.player.position.z >= this.left_path_coord)
		{
			this.going_left_path = true
		}
	}

	jumpRightPath()
	{
		if(this.player.position.z < 0)
		{
			this.player.position.z += this.speed
			if(this.player.position.z >= 0)
			{
				this.going_right_path = false
				this.player.position.z = 0
			}
		}
		else if(this.player.position.z >= 0 && this.player.position.z < (this.right_path_coord + this.speed))
		{
			this.player.position.z += this.speed
			if(this.player.position.z >= this.right_path_coord)
			{
				this.going_right_path = false
			}
		}
	}

	jumpLeftPath()
	{
		if(this.player.position.z > 0)
		{
			this.player.position.z -= this.speed
			if(this.player.position.z <= 0)
			{
				this.going_left_path = false
				this.player.position.z = 0
			}
		}
		else if(this.player.position.z <= 0 && this.player.position.z > (this.left_path_coord - this.speed))
		{
			this.player.position.z -= this.speed
			if(this.player.position.z <= this.left_path_coord)
			{
				this.going_left_path = false
			}
		}
	}

	run()
	{
		let dif = Settings.game_difficulty
	
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

		if(Player.stage == 4 && !Boss.summoned)
		{
			Boss.summoned = true
			this.boss = new Boss(this.scene)
			this.boss.player = this.player

			this.boss.make()

			for (var i = 0; i < this.enemies.length; i++)
			{
				let enemy = this.enemies[i]
				enemy.object.geometry.dispose()
				enemy.object.material.dispose()
				this.scene.remove(enemy.object)
				delete this.enemies[i]
			}
			this.enemies = []
		}

		this.fetchEnemies()

		this.renderLampposts()
	}

	facingBoss()
	{
		if(this.boss.boss_model)
		{
			this.boss.update()
		}
	}

	fetchEnemies()
	{
		let freq = 60 / (Player.stage * 1.4)
		let rand = randomNumber(0, freq)

		if(rand == Math.floor(rand / 2))
		{
			let enemy = new Enemy(this.scene, this.player)

			let box_enemy = enemy.makeBox()

			this.enemies.push({
				enemy: enemy,
				object: box_enemy
			})
		}

		for (var i = 0; i < this.enemies.length; i++)
		{
			let enemy = this.enemies[i]

			if(enemy.enemy.hasCollided(this.player, this.player_size))
			{
				Player.dead = true
			}

			if(enemy.object.position.x < this.player.position.x - 10)
			{
				enemy.object.geometry.dispose()
				enemy.object.material.dispose()
				this.scene.remove(enemy.object)
				delete this.enemies[i]
				this.enemies = this.enemies.filter(val => val)
			}
		}
	}

	renderLampposts()
	{
		this.lamppost.update(this.getPosition().x)
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
		this.boss_model = null
	}
}

Player.dead = false
Player.stage = 1

export default Player