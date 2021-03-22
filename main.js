import { OrbitControls } from './lib/OrbitControls.js'

import Enemy from './src/enemy.js'
import { getDistance } from './src/utils.js'
import Sound from './src/sound.js'
import Wall from './src/wall.js'
import Ground from './src/ground.js'
import Score from './src/score.js'
import Lights from './src/lights.js'
import Lamppost from './src/lamppost.js'
import Footpath from './src/footpath.js'

const scene = new THREE.Scene();

// scene.background = 0x54d1ff;

const fogColor = 0x000000;

scene.fog = new THREE.Fog(fogColor, 30, 170)


const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 1500);

const camera_y_pos = 6
camera.position.y = camera_y_pos;
camera.position.x = -10;
camera.position.z = 6;

camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = true;
// console.log()
// renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding

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

let lights = new Lights()

// lights.makeSpotlight(scene)

// lights.makeHemisphereLight(scene)
lights.makeAmbientLight(scene)

let lamppost = new Lamppost()

lamppost.make(scene)

let footpath = new Footpath()

footpath.make(scene)

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
let enemies_number = 100;

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

let score = new Score();

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
		score.increasePoints()
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

	score.reset()
})

document.getElementById('start_game_button').addEventListener('click', function(e)
{
	start_game()

	document.getElementById('start_menu').style.display = 'none'
	document.getElementById('background_overlay').style.display = 'none'
	document.getElementById('jump_button').style.display = 'block'
	document.getElementById('score_wrapper').style.visibility = 'visible'

	sound.playBackground1Audio()
})
