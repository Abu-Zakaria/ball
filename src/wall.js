export default class Wall
{
	constructor()
	{
		this.color = 0x0000ff
		this.height = 10
		this.length = 1000
		this.object;
		this.far_position = 8
	}

	make(scene)
	{
		const texture_loader = new THREE.TextureLoader()

		texture_loader.load('resources/textures/wall.jpg', (texture) => {
			let geometry = new THREE.PlaneGeometry(this.length, this.height, 5, 5)

			texture.encoding = THREE.sRGBEncoding;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			texture.repeat.set(this.length / 10, 1)

			let material = new THREE.MeshPhongMaterial({
				map: texture
			})

			this.object = new THREE.Mesh(geometry, material);

			this.object.position.z = - this.far_position;
			this.object.position.y = (this.height / 2) - 0.5;

			scene.add(this.object)
		})

		texture_loader.load('resources/textures/wall.jpg', (texture) => {
			let geometry = new THREE.PlaneGeometry(this.length, this.height, 5, 5)

			texture.encoding = THREE.sRGBEncoding;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			texture.repeat.set(this.length / 10, 1)

			let material = new THREE.MeshPhongMaterial({
				map: texture
			})

			this.object = new THREE.Mesh(geometry, material);

			this.object.position.z = this.far_position;
			this.object.position.y = (this.height / 2) - 0.5;

			this.object.rotation.x = Math.PI

			scene.add(this.object)
		})

	}
}