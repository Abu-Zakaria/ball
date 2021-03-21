import { getDistance, randomNumber } from './utils.js'

export default class Enemy
{
	constructor(scene, clock)
	{
		this.object = null;
		this.speed = 0.12;
		this.geometry = null;
		this.radius = 1;
		this.spawn_point = 20
		this.spawn_time = randomNumber(1, 80);
		this.visible = false
		this.scene = scene
		this.clock = clock
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
		let material = new THREE.MeshPhongMaterial({color: 0x0000ff})


		this.object = new THREE.Mesh(this.geometry, material)

		this.object.name = "asd_" + this.clock.getElapsedTime();

		this.object.position.x = this.spawn_point

		return this.object
	}

	moveLeft()
	{
		this.object.position.x -= this.speed;
	}

	hasCollided(player)
	{
		if(
			(getDistance(this.object.position.x, this.object.position.y,
								player.position.x, player.position.y) - (this.radius + 0.2)) <= 0)
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
}