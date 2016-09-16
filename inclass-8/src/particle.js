const random = (min=0, max=800) =>
    Math.random() * (max - min) + min

// default values
const particle = (
	{
    mass=random(5, 30),
    position=[random(), random()],
    velocity=[random(-0.1, 0.1), random(-0.1, 0.1)],
    acceleration=[0, 0]}
) => {
    return {acceleration, velocity, position, mass}
}

const update = ({acceleration, velocity, position, mass}, delta, canvas) => {
	var [x,y] = position
	var [v_x,v_y] = velocity

	if(x+v_x*delta+mass >= canvas.width){
		x = canvas.width - mass
		v_x = - v_x
	}else{
		x = x+v_x*delta
	}
	if(x+v_x*delta-mass <= 0){
		x = mass;
		v_x = - v_x
	}else{
		x = x+v_x*delta
	}
	if(y+v_y*delta+mass >= canvas.height){
		y = canvas.height - mass;
		v_y = - v_y;
	}else{
		y = y+v_y*delta
	}
	if(y+v_y*delta-mass <= 0){
		y = mass;
		v_y = - v_y
	}else{
		y = y+v_y*delta
	}
	velocity = [v_x,v_y]
	position = [x,y]
    return { mass, acceleration, velocity, position }
}

export default particle

export { update }
