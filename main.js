import { OrbitControls } from './lib/OrbitControls.js'

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, .1, 1500);

camera.position.y = 2;
camera.position.x = 2;
camera.position.z = 3;

camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = true;


document.getElementById('playground').appendChild(renderer.domElement);

const orbitControl = new OrbitControls(camera, renderer.domElement)

// player object
const player_geometry = new THREE.BoxGeometry(1, 1, 1);
const player_material = new THREE.MeshPhongMaterial({ color: 0xff0000});

const player_object = new THREE.Mesh(player_geometry, player_material)

player_object.position.y = 0.5;
player_object.castShadow = true;

scene.add(player_object)

const color = 0xFFFFFF;
const intensity = 1;

const light = new THREE.DirectionalLight(color, intensity);

light.position.set(150, 100, 5);
light.target.position.set(0, 0, 0);
light.shadow.mapSize.width = 1000
light.shadow.mapSize.height = 1000
light.castShadow = true;

scene.add(light);
scene.add(light.target);


const groundGeo = new THREE.PlaneGeometry( 10, 10, 5, 5);
const groundMat = new THREE.MeshPhongMaterial( { color: 0xf1f1f1} );

const ground = new THREE.Mesh( groundGeo, groundMat );

ground.position.y = 0;
ground.rotation.x = - Math.PI / 2;
ground.castShadow = false;
ground.receiveShadow = true;
scene.add( ground );



const player_movement_speed = 0.1;

document.addEventListener('keydown', (event) => {
	let key_code = event.keyCode
	switch(key_code)
	{
		case 38: // up arrow
			player_object.position.y += player_movement_speed;
			break;
		case 40: // down
			player_object.position.y -= player_movement_speed;
			break;
		case 39: // right
			player_object.position.x += player_movement_speed;
			console.log("going right")
			break;
		case 37: // left
			player_object.position.x -= player_movement_speed;
			break;
	}
})


function animate()
{
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}

animate();