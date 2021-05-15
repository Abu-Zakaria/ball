import Player from './player.js'

export default class Score
{
	constructor()
	{
		this.points = 0
		this.rate = 1
		this.score_point_text = document.getElementById('score_points')
		this.final_score_point_text = document.getElementById('final_score')

		this.second_stage_points = 800
		this.third_stage_points = 1500
		this.last_stage_points = 2000
	}

	getPoints()
	{
		return this.points
	}

	increasePoints()
	{
		if(this.points > this.second_stage_points && Player.stage < 2)
		{
			document.dispatchEvent(new Event('second_stage_reached'))
		}
		else if(this.points > this.third_stage_points && Player.stage < 3)
		{
			document.dispatchEvent(new Event('third_stage_reached'))
		}
		else if(this.points > this.last_stage_points && Player.stage < 4)
		{
			console.log('dispatchEvent')
			document.dispatchEvent(new Event('last_stage_reached'))
		}
		this.points += this.rate
		this.score_point_text.textContent = this.points
		this.final_score_point_text.textContent = this.points
	}

	reset()
	{
		this.points = 0
	}
}
