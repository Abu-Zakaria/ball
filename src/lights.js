export default class Lights
{
	constructor()
	{

	}

	makeSpotlight(scene)
	{
		const spot_color = 0xFFFFFF;
		const spot_intensity = 2;
		const spot_distance = 30
		const spot_angle = 60
		const spot_penumbra = 0

		const spot_light = new THREE.SpotLight(spot_color, spot_intensity, spot_distance, spot_angle, spot_penumbra);

		spot_light.position.set(2, 20, 0)
		spot_light.caseShadow = true;
		spot_light.shadow.mapSize.width = 200
		spot_light.shadow.mapSize.height = 300

		spot_light.shadow.camera.near = 1
		spot_light.shadow.camera.far = 1

		scene.add(spot_light);
	}

	makeLamppostLight(scene, x, y, z, name = '')
	{
		const spot_color = 0xfff30d;
		const spot_intensity = 2;
		const spot_distance = 30
		const spot_angle = Math.PI;
		const spot_penumbra = 0

		let spot_light = new THREE.SpotLight(spot_color, spot_intensity, spot_distance, spot_angle, spot_penumbra);

		let y_offset = 4.5;
		let z_offset = -0.4;

		spot_light.position.set(x, y + y_offset, z + z_offset)
		spot_light.caseShadow = true;

		spot_light.name = name

		let target = new THREE.Object3D()
		target.position.x = x
		target.position.y = 0
		target.position.z = z + z_offset;

		scene.add(target)

		spot_light.target = target
		
		spot_light.shadow.mapSize.width = 512
		spot_light.shadow.mapSize.height = 512

		spot_light.shadow.camera.near = 2
		spot_light.shadow.camera.far = 400
		spot_light.shadow.camera.focus = 2

		scene.add(spot_light);
		return spot_light
	}

	makeHemisphereLight(scene)
	{
		const hemi_light = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.9);

		scene.add(hemi_light)
	}

	makeAmbientLight(scene)
	{
		const hemi_light = new THREE.HemisphereLight(0xffffff, 3);

		scene.add(hemi_light)
	}
}