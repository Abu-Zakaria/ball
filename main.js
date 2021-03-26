import { OrbitControls } from './lib/OrbitControls.js'

import Player from './src/player.js'
import Enemy from './src/enemy.js'
import Sound from './src/sound.js'
import Wall from './src/wall.js'
import Ground from './src/ground.js'
import Sky from './src/sky.js'
import Score from './src/score.js'
import Lights from './src/lights.js'
import Lamppost from './src/lamppost.js'
import Footpath from './src/footpath.js'
import LoadingScreen from './src/loadingScreen.js'
import Renderer from './src/renderer.js'
import Settings from './src/settings.js'
import Camera from './src/camera.js'
import Boss from './src/boss.js'

const scene = new THREE.Scene();

// scene.background = 0x54d1ff;

const fogColor = 0x000000;

let fog_far = 100;
let fog_near = 30;

scene.fog = new THREE.Fog(fogColor, fog_near, fog_far)

let camera_obj = new Camera(fog_far, fog_near)
let camera = camera_obj.init()
let camera_pos = camera_obj.getCameraPosition()

let renderer = new Renderer()

LoadingScreen.init()

let settings = new Settings()

// const orbitControl = new OrbitControls(camera, renderer.getRenderer().domElement)

let player = new Player(scene, camera)
player.make()

let lights = new Lights()

// lights.makeSpotlight(scene)

// lights.makeHemisphereLight(scene)
lights.makeAmbientLight(scene)

let lamppost = new Lamppost()

lamppost.init(scene)

let footpath = new Footpath()

footpath.make(scene)

let ground = new Ground(scene)
ground.make()

// let sky = new Sky()
// sky.make(scene)

let sound = new Sound();

let jumping,
	a_y = 0.5,
	v_y;

let game_started = false
let game_over = false

function start_game()
{
	game_started = true
}

let clock = new THREE.Clock()
clock.start();

// let enemies = [];
// let enemies_number = 100;

// function addEnemies()
// {
// 	console.log("Adding....")
// 	for (var i = 0; i < enemies_number; i++)
// 	{
// 		let enemy_obj = new Enemy(scene, clock);
// 		enemy_obj.makeBox();

// 		enemies.push(enemy_obj)
// 	}
// }

// addEnemies()
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

// const player_movement_speed = 0.1;

let wall = new Wall(scene)

wall.make()

let score = new Score();

function animate()
{
	requestAnimationFrame(animate);

	if(game_started)
	{
		player.updateJump(camera, camera_pos)
	}
	if(game_started && !Boss.summoned)
	{
		player.run()
	}

	if(Boss.summoned && Boss.fighting)
	{
		player.facingBoss()
		if(Player.dead)
		{
			Boss.fighting = false
			console.log("GAME OVER")
			setOnGameOver()
		}
	}

	lamppost.update(player.getPosition().x, fog_near, fog_far)

	if(!game_over && game_started)
	{
		// motionEnemies();
		score.increasePoints()
	}

	if(LoadingScreen.progress < 100)
	{
		LoadingScreen.update()
	}

	if(player.going_right_path && !game_over)
	{
		player.jumpRightPath()
	}

	if(player.going_left_path && !game_over)
	{
		player.jumpLeftPath()
	}

	renderer.getRenderer().render(scene, camera);
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
	let event = new Event('game_reset')
	document.dispatchEvent(event)

	player = new Player(scene, camera)
	player.make()
	
	game_over = false

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
	document.getElementById('left_button').style.display = 'block'
	document.getElementById('right_button').style.display = 'block'
	document.getElementById('score_wrapper').style.visibility = 'visible'

	sound.playBackground1Audio()
})

window.addEventListener('resize', function()
{
	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.getRenderer().setSize( window.innerWidth, window.innerHeight );
})

document.getElementById('jump_button').addEventListener('mousedown', () => {
	player.jump()
})
document.getElementById('right_button').addEventListener('mousedown', () => {
	player.goRight()
})
document.getElementById('left_button').addEventListener('mousedown', () => {
	player.goLeft()
})
document.addEventListener('keydown', (event) => {
	let key_code = event.keyCode

	if(!game_over)
	{
		switch(key_code)
		{
			case 38: // up arrow
				player.jump()
				break;
			// case 40: // down
			// 	player_object.position.y -= player_movement_speed;
			// 	break;
			case 39: // right
				player.goRight()
				break;
			case 37: // left
				player.goLeft()
				break;
			case 32: // spacebar
				player.jump()
				break;
		}
	}
})
