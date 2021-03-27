import LoadingScreen from './loadingScreen.js'

class Settings
{
	constructor()
	{
		this.setUpEvents()
	}

	setUpEvents()
	{
		document.getElementById('settings_button').addEventListener('click', this.showSettingsScreen)
		document.getElementById('graphics_quality').addEventListener('change', this.updateGfxQuality)
		document.getElementById('setting_done_button').addEventListener('click', this.closeSettingsScreen)
		document.getElementById('game_difficulty').addEventListener('change', this.updateGameDifficulty)
	}

	showSettingsScreen()
	{
		document.getElementById('settings_screen_wrapper').style.display = 'block'
	}

	updateGfxQuality()
	{
		LoadingScreen.init()
		Settings.gfx_quality = document.getElementById('graphics_quality').value
		let event = new Event('gfx_changed')
		document.dispatchEvent(event)
	}

	closeSettingsScreen()
	{
		document.getElementById('settings_screen_wrapper').style.display = 'none'
	}

	updateGameDifficulty()
	{
		Settings.game_difficulty = document.getElementById('game_difficulty').value
		let event = new Event('game_difficulty_changed')
		document.dispatchEvent(event)
		console.log("dispatchEvent")
	}
}

Settings.gfx_quality = 'high';
Settings.fps = 30;

Settings.fog_far = 100
Settings.fog_near = 30

Settings.game_difficulty = 0

export default Settings