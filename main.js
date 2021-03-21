import { OrbitControls } from './lib/OrbitControls.js'
import Enemy from './src/enemy.js'
import { getDistance } from './src/utils.js'
import Sound from './src/sound.js'
import Wall from './src/wall.js'
import Ground from './src/ground.js'

const scene = new THREE.Scene();

// scene.background = 0x54d1ff;


const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 1500);

const camera_y_pos = 6
camera.position.y = camera_y_pos;
camera.position.x = -10;
camera.position.z = 6;

camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = true;
renderer.setPixelRatio(window.devicePixelRatio)


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

let ground = new Ground()
ground.make(scene)

document.getElementById('jump_button').addEventListener('mousedown', () => {
	jump()
})

let sound = new Sound();

let jumping,
	a_y = 0.5,
	v_y;

let game_started = false
let game_over = false

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

	sound.playJump();
}

function motionJump()
{
	if(jumping)
	{
		let dif = (v_y - a_y) / 30
		if(player_object.position.y + dif <= 0)
		{
			player_object.position.y = 0;
			camera.position.y = camera_y_pos
			jumping = false
			return
		}
		player_object.position.y += dif;
		camera.position.y += dif / 2
		v_y -= a_y;
	}
}

function start_game()
{
	game_started = true
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
let bruh = 'bruh';

function motionEnemies()
{
	if(game_over)
	{
		return false
	}
	console.log('bruh', bruh)
	for (var i = 0; i < enemies.length; i++) {
		let enemy = enemies[i]


		enemy.check_status();

		if(enemy.isVisible())
		{
			enemy.moveLeft();

			if(enemy.hasCollided(player_object))
			{
				setOnGameOver();
			}

			if(enemy.getPosition().x < -10)
			{
				scene.remove(enemy.object)
			}
		}
	}
}

const player_movement_speed = 0.1;

document.addEventListener('keydown', (event) => {
	let key_code = event.keyCode

	if(!game_over)
	{
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
	}
})


let wall = new Wall()

wall.make(scene)


function animate()
{
	requestAnimationFrame(animate);

	if(game_started)
	{
		motionJump()
	}

	if(!game_over && game_started)
	{
		motionEnemies();
	}

	renderer.render(scene, camera);
}

animate();

function setOnGameOver()
{
	let game_over_modal = document.getElementById('game_over')
	game_over_modal.style.visibility = 'visible'

	game_over = true

	sound.stopBackground1Audio()
	sound.playGameOver()
	clock.stop()
}

document.getElementById('retry_button').addEventListener('click', function(e)
{
	console.log("ASD");

	for (var i = 0; i < enemies.length; i++) {
		let _enemy = enemies[i]
		scene.remove(_enemy.object)
	}

	enemies = []

	console.log(enemies)

	addEnemies();

	console.log(enemies)

	game_over = false

	bruh = 'oof'

	clock.start()

	document.getElementById('game_over').style.visibility = 'hidden'

	sound.playBackground1Audio()
})

document.getElementById('start_game_button').addEventListener('click', function(e)
{
	start_game()

	document.getElementById('start_menu').style.display = 'none'
	document.getElementById('background_overlay').style.display = 'none'
	document.getElementById('jump_button').style.display = 'block'

	sound.playBackground1Audio()
})