import LoadingScreen from './loadingScreen.js'

class Sound
{
	constructor()
	{
		this.path = '../resources/sounds/'
		this.gameover_audio = new Audio(this.path + 'game_over.mp3')
		this.background_1_audio = new Audio(this.path + 'background_music_1.mp3')
		
		this.jump_audio
		this.shooting_audio

		this.loadShootingSound()
		LoadingScreen.loadingCompleted("audio")

		document.addEventListener('gfx_changed', () => {
			LoadingScreen.loadingCompleted("audio")
		})
	}

	loadJump()
	{
		this.jump_audio = new Audio(this.path + 'jump.mp3')
	}

	playJump()
	{
		this.jump_audio.pause();
		this.jump_audio.currentTime = 0
		this.jump_audio.play()
	}

	loadShootingSound()
	{
		this.shooting_audio = new Audio(this.path + 'shooting.mp3')
	}

	playShootingSound()
	{
		this.shooting_audio.play()
	}

	playGameOver()
	{
		this.gameover_audio.play()
	}

	playBackground1Audio()
	{
		this.background_1_audio.play();
	}

	stopBackground1Audio()
	{
		this.background_1_audio.pause();
	}
}

Sound.instance
Sound.init = function()
{
	Sound.instance = new Sound()
}

export default Sound