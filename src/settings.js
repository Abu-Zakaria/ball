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
}

Settings.gfx_quality = 'high';
Settings.fps = 30;

export default Settings