export default class Footpath
{
	constructor()
	{
		this.far_position = 7;
		this.texture_path = 'resources/textures/footpath.jpg'
		this.length = 1000;
		this.width = 2
		this.object;
	}

	make(scene)
	{
		const texture_loader = new THREE.TextureLoader()

		texture_loader.load(this.texture_path, (texture) => {
			texture.encoding = THREE.sRGBEncoding;

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			texture.repeat.set(this.length / 2, 1)

			const geometry = new THREE.PlaneGeometry(this.length, this.width, 5, 5)

			const material = new THREE.MeshPhongMaterial({
				map: texture
			})


			this.object = new THREE.Mesh( geometry, material );

			this.object.position.y = -0.5;
			this.object.position.z = - this.far_position

			this.object.rotation.x = - Math.PI / 2;

			this.object.castShadow = false;
			this.object.receiveShadow = true;


			scene.add(this.object)
		})

		texture_loader.load(this.texture_path, (texture) => {
			texture.encoding = THREE.sRGBEncoding;

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			texture.repeat.set(this.length / 2, 1)

			const geometry = new THREE.PlaneGeometry(this.length, this.width, 5, 5)

			const material = new THREE.MeshPhongMaterial({
				map: texture
			})


			this.object = new THREE.Mesh( geometry, material );

			this.object.position.y = -0.5;
			this.object.position.z = this.far_position

			this.object.rotation.x = - Math.PI / 2;

			this.object.castShadow = false;
			this.object.receiveShadow = true;


			scene.add(this.object)
		})
	}
}