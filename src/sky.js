export default class Sky
{
	constructor()
	{
		this.file = '../resources/textures/sky.jpg'
	}

	make(scene)
	{
		// let loader = new THREE.CubeTextureLoader()

		// let texture = loader.load([
		// 	this.file,
		// 	this.file,
		// 	this.file,
		// 	this.file,
		// 	this.file,
		// 	this.file
		// ]);

		// scene.background = texture
		// var geometry = new THREE.SphereGeometry(300, 60, 40);  

		// new THREE.TextureLoader().load(this.file, (texture) => {
		// 	texture.wrapS = texture.wrapT = THREE.RepeatWrapping
		// 	texture.repeat.set(300 / 30, 1)

		// 	var material = new THREE.MeshPhongMaterial( {  
		// 	  map: texture,
		// 	});

		// 	material.side = THREE.BackSide

		// 	let skyBox = new THREE.Mesh(geometry, material);  
		// 	skyBox.scale.set(1, 1, 1);  

		// 	scene.add(skyBox);
		// });

	}
}