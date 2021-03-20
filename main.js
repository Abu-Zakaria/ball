import { OrbitControls } from './lib/OrbitControls.js'
import Enemy from './src/enemy.js'
import { getDistance } from './src/utils.js'

const scene = new THREE.Scene();

scene.background = 0xffffff;


const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, .1, 1500);

camera.position.y = 2;
camera.position.x = -2;
camera.position.z = 5;

camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = true;


document.getElementById('playground').appendChild(renderer.domElement);

const orbitControl = new OrbitControls(camera, renderer.domElement)

// player object
const player_geometry = new THREE.BoxGeometry(1, 1, 1, 4);
const player_material = new THREE.MeshPhongMaterial({ color: 0xff0000});

const player_object = new THREE.Mesh(player_geometry, player_material)

player_object.position.y = 0;
player_object.castShadow = true;

player_object.name = 'player'

scene.add(player_object)

const color = 0xFFFFFF;
const intensity = 1;

const dir_light = new THREE.DirectionalLight(color, intensity);

dir_light.position.set(150, 100, 105);
dir_light.target.position.set(0, 0, 0);
dir_light.shadow.mapSize.width = 1000
dir_light.shadow.mapSize.height = 1000
dir_light.castShadow = true;

scene.add(dir_light);
scene.add(dir_light.target);

const hemi_light = new THREE.AmbientLight(0xaaaaaa, 1);

scene.add(hemi_light)


const groundGeo = new THREE.PlaneGeometry( 1000, 10, 5, 5);
const groundMat = new THREE.MeshStandardMaterial( { color: 0xaaaaaa} );

const ground = new THREE.Mesh( groundGeo, groundMat );

ground.position.y = -0.5;
ground.rotation.x = - Math.PI / 2;
ground.castShadow = false;
ground.receiveShadow = true;

ground.name = 'ground';

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
		case 32: // spacebar
			jump(event)
			break;
	}
})

document.getElementById('jump_button').addEventListener('click', (event) => {
	jump(event)
})

let jumping,
	a_y = 0.5,
	v_y;

function jump(e)
{
	if(jumping)
	{
		e.preventDefault()
		return;
	}
	console.log("Jumping...");
	v_y = 10;
	jumping = true;
}

function motionJump()
{
	if(jumping)
	{
		let dif = (v_y - a_y) / 30
		if(player_object.position.y + dif <= 0)
		{
			player_object.position.y = 0;
			jumping = false
			return
		}
		player_object.position.y += dif;
		v_y -= a_y;
	}
}


let enemies = [];

for (var i = 0; i < 10; i++)
{
	let enemy_obj = new Enemy();
	enemy_obj.makeBox();

	scene.add(enemy_obj.object);

	enemies.push(enemy_obj)
}

let game_over = false

function motionEnemies()
{
	for (var i = 0; i < enemies.length; i++) {
		let enemy = enemies[i]

		enemy.moveLeft();

		if(enemy.hasCollided(player_object))
		{
			let game_over_modal = document.getElementById('game_over')
			game_over_modal.style.display = 'block'

			game_over = true
		}
	}
}

function animate()
{
	requestAnimationFrame(animate);

	motionJump()

	if(!game_over)
	{
		motionEnemies();
	}

	renderer.render(scene, camera);
}

animate();