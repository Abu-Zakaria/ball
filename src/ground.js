export default class Ground
{
	constructor()
	{
		this.length = 1000;
		this.height = 20;
		this.object;
	}

	make(scene)
	{
		const texture_loader = new THREE.TextureLoader()

		texture_loader.load('resources/textures/road.jpg', (texture) => {
			texture.encoding = THREE.sRGBEncoding;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			texture.repeat.set(this.length / 10, 1)

			const geometry = new THREE.PlaneGeometry(this.length, this.height, 5, 5)

			const material = new THREE.MeshPhongMaterial({
				map: texture
			})


			this.object = new THREE.Mesh( geometry, material );

			this.object.position.y = -0.5;
			this.object.rotation.x = - Math.PI / 2;
			this.object.castShadow = false;
			this.object.receiveShadow = true;


			scene.add(this.object)
		})
	}
}