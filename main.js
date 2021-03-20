import { OrbitControls } from './lib/OrbitControls.js'
import Enemy from './src/enemy.js'
import { getDistance } from './src/utils.js'

const scene = new THREE.Scene();

scene.background = 0xffffff;


const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 1500);

camera.position.y = 6;
camera.position.x = -4;
camera.position.z = 6;

camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = true;


document.getElementById('playground').appendChild(renderer.domElement);

const orbitControl = new OrbitControls(camera, renderer.domElement)

// player object
const player_geometry = new THREE.SphereGeometry(0.7, 100, 100);
const player_material = new THREE.MeshPhongMaterial({ color: 0x00ffff});

const player_object = new THREE.Mesh(player_geometry, player_material)

player_object.position.y = 0.2;
player_object.castShadow = true;

player_object.name = 'player'

scene.add(player_object)

const dir_color = 0xFFFFFF;
const dir_intensity = 0;

const dir_light = new THREE.DirectionalLight(dir_color, dir_intensity);

dir_light.position.set(150, 100, 105);
dir_light.target.position.set(0, 0, 0);
dir_light.shadow.mapSize.width = 1000
dir_light.shadow.mapSize.height = 1000
dir_light.castShadow = true;

scene.add(dir_light);
scene.add(dir_light.target);

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

const hemi_light = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.9);

scene.add(hemi_light)


const groundGeo = new THREE.PlaneGeometry( 1000, 20, 5, 5);
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
		// case 38: // up arrow
		// 	player_object.position.y += player_movement_speed;
		// 	break;
		// case 40: // down
		// 	player_object.position.y -= player_movement_speed;
		// 	break;
		// case 39: // right
		// 	player_object.position.x += player_movement_speed;
		// 	console.log("going right")
		// 	break;
		// case 37: // left
		// 	player_object.position.x -= player_movement_speed;
		// 	break;
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


let clock = new THREE.Clock()
clock.start();

let enemies = [];
let enemies_number = 20;

function addEnemies()
{
	console.log("Adding....")
	for (var i = 0; i < enemies_number; i++)
	{
		let enemy_obj = new Enemy(scene, clock);
		enemy_obj.makeBox();

		enemies.push(enemy_obj)
	}
}

addEnemies()

let game_over = false

function motionEnemies()
{
	for (var i = 0; i < enemies.length; i++) {
		let enemy = enemies[i]

		enemy.check_status();

		if(enemy.isVisible())
		{
			enemy.moveLeft();

			if(enemy.hasCollided(player_object))
			{
				let game_over_modal = document.getElementById('game_over')
				game_over_modal.style.display = 'block'

				game_over = true
			}

			if(enemy.getPosition().x < -10)
			{
				scene.remove(enemy.object)
			}
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

document.getElementById('retry_button').addEventListener('click', function(e)
{
	console.log("ASD");

	for (var i = 0; i < enemies.length; i++) {
		let _enemy = enemies[i]
		scene.remove(_enemy.object)
	}

	enemies = []

	addEnemies();
	game_over = false

	document.getElementById('game_over').style.display = 'none'
})