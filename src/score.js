export default class Score
{
	constructor()
	{
		this.points = 0
		this.rate = 1
		this.score_point_text = document.getElementById('score_points')
		this.final_score_point_text = document.getElementById('final_score')
	}

	getPoints()
	{
		return this.points
	}

	increasePoints()
	{
		this.points += this.rate
		this.score_point_text.textContent = this.points
		this.final_score_point_text.textContent = this.points
	}

	reset()
	{
		this.points = 0
	}
}