export default class Camera
{
	constructor(fog_far, fog_near)
	{
		this.camera;
		this.camera_pos = new THREE.Vector3(1, 2, 4);
		this.aspect_ratio = window.innerWidth / window.innerHeight
		this.fog_far = fog_far
		this.fog_near = fog_near
		let _this = this

		this.camera = new THREE.PerspectiveCamera(75, this.aspect_ratio, .1, this.fog_far + this.fog_near);

		document.addEventListener('game_reset', function()
		{
			_this.init()
		})
	}

	init()
	{		
		this.camera.position.x = this.camera_pos.x;
		this.camera.position.y = this.camera_pos.y;
		this.camera.position.z = this.camera_pos.z;

		this.camera.lookAt(0, 0, 0);

		return this.camera
	}

	getCameraPosition()
	{
		return this.camera_pos
	}

	getCamera()
	{
		return this.camera
	}
}