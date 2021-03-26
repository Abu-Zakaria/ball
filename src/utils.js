export function getDistance(x1, y1, x2, y2)
{
	let distance_x = x1 - x2
	let distance_y = y1 - y2

	return Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2))
}

export function get3DDistance(x1, y1, z1, x2, y2, z2)
{
	let distance_x = x1 - x2
	let distance_y = y1 - y2
	let distance_z = z1 - z2

	let c1 = Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2))
	let c2 = Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_z, 2))
	return Number(c1) + Number(c2)
}

export function randomNumber(min, max){
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}