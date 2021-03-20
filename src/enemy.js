import { getDistance, randomNumber } from './utils.js'

export default class Enemy
{
	constructor()
	{
		this.object = null;
		this.speed = 0.1;
		this.geometry = null;
		this.radius = 1;
		this.spawn_point

		this.spawn_point = randomNumber(10, 1000)
	}

	makeBox()
	{
		this.geometry = new THREE.BoxGeometry(this.radius, this.radius, this.radius);
		let material = new THREE.MeshPhongMaterial({color: 0x0000ff})


		this.object = new THREE.Mesh(this.geometry, material)

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
								player.position.x, player.position.y) - this.radius) <= 0)
		{
			return true
		}
		return false
	}
}