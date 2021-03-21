export default class Wall
{
	constructor()
	{
		this.color = 0x0000ff
		this.height = 10
		this.length = 1000
		this.object;
	}

	make(scene)
	{
		const texture_loader = new THREE.TextureLoader()

		texture_loader.load('resources/textures/wall.jpg', (texture) => {
			const geometry = new THREE.PlaneGeometry(this.length, this.height, 5, 5)

			texture.encoding = THREE.sRGBEncoding;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			texture.repeat.set(this.length / 10, 1)

			const material = new THREE.MeshPhongMaterial({
				map: texture
			})

			this.object = new THREE.Mesh(geometry, material);

			this.object.position.z = -8;
			this.object.position.y = this.height / 2;

			scene.add(this.object)
		})

	}
}