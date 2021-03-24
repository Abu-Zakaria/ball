export default class Settings
{
	constructor()
	{
		this.gfx_quality = 'mid';
		this.fps = 30;

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

	updateGfxQuality(el)
	{
		this.gfx_quality = document.getElementById('graphics_quality').value
	}

	closeSettingsScreen()
	{
		document.getElementById('settings_screen_wrapper').style.display = 'none'
	}
}