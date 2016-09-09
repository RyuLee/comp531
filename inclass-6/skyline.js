var createApp = function(canvas) { 
		var c = canvas.getContext("2d");

	// Create the ground
	var floor = canvas.height/2
	var grad = c.createLinearGradient(0,floor,0,canvas.height)
	grad.addColorStop(0, "green")
	grad.addColorStop(1, "black")
	c.fillStyle=grad
	c.fillRect(0, floor, canvas.width, canvas.height)

	// common size for windows
	var windowSpacing = 2, floorSpacing = 3
	var windowHeight = 5, windowWidth = 3

	// colors of buildings
	var blgColors = [ 'red', 'blue', 'gray', 'orange'] 
	// draw sun
	var ball = {
		x : 0,
		y : floor-40,
		radius : 20,
		v_x : 1,
		v_y : -1.3
	}
	c.fillStyle = "yellow";
	c.beginPath();
	c.arc(0,canvas.height/4,20,0,Math.PI*2)
	c.stroke();
	c.fill();

	//draw car 
	img = new Image();
	img.src = "car.png";
	var car = {
		img:img,
		x:0,
		y:floor-5,
		width:80,
		height:30,
		v_x : 2
	}
	c.drawImage(car.img,car.x,car.y,car.width,car.height);
	//buildings
	var blgs = [];



	//build a building
	var build = function() { 
		var x0 = Math.random()*canvas.width
		var blgWidth = (windowWidth+windowSpacing) * Math.floor(Math.random()*10)
		var blgHeight = Math.random()*canvas.height/2
		var blgColor = blgColors[ Math.floor(Math.random()*blgColors.length)]
		c.fillStyle= blgColor
		c.fillRect(x0, floor - blgHeight, blgWidth, blgHeight)
		c.fillStyle="yellow"
		for (var y = floor - floorSpacing; y > floor - blgHeight; y -= floorSpacing + windowHeight) {
			for (var x = windowSpacing; x < blgWidth - windowWidth; x += windowSpacing + windowWidth) {
				c.fillRect(x0 + x, y - windowHeight, windowWidth, windowHeight)
			}
		}
		blgs.push({ pts:x0,blgWidth:blgWidth,blgHeight:blgHeight,blgColor:blgColor});
	}
	var update = function(){

		c.clearRect(0,0,canvas.width,canvas.height);

		var floor = canvas.height/2
		var grad = c.createLinearGradient(0,floor,0,canvas.height)
		grad.addColorStop(0, "green")
		grad.addColorStop(1, "black")
		c.fillStyle=grad
		c.fillRect(0, floor, canvas.width, canvas.height)
		//draw sun's trajency
		
		if(ball.x-ball.radius>canvas.width){
			c.fillStyle = "yellow";
			c.beginPath();
			c.arc(ball.x,ball.y,20,0,Math.PI*2)
			ball.x = 0;
			ball.y - floor -40;
			ball.v_x = 1;
			ball.v_y = -1.3;
			c.stroke();
			c.fill();
		}else{
			c.fillStyle = "yellow";
			c.beginPath();
			c.arc(ball.x,ball.y,20,0,Math.PI*2)
			ball.x = ball.x + ball.v_x
			ball.y = ball.y + ball.v_y
			ball.v_x = ball.v_x*Math.cos(Math.PI/1000) - ball.v_y*Math.sin(Math.PI/1000)
			ball.v_y = ball.v_y*Math.cos(Math.PI/1000) + ball.v_x*Math.sin(Math.PI/1000)
			c.stroke();
			c.fill();
	}
		for(var i = 0; i< blgs.length; i++){
			var x = blgs[i];
			var x0 = x.pts;
			var blgWidth = x.blgWidth
			var blgHeight = x.blgHeight
			var blgColor = x.blgColor
			c.fillStyle= blgColor
			c.fillRect(x0, floor - blgHeight, blgWidth, blgHeight)
			for (var y = floor - floorSpacing; y > floor - blgHeight; y -= floorSpacing + windowHeight) {
			for (var x = windowSpacing; x < blgWidth - windowWidth; x += windowSpacing + windowWidth) {
				var color = blgColors[ Math.floor(Math.random()*blgColors.length)];
				while(color == blgColor) {
					color = blgColors[ Math.floor(Math.random()*blgColors.length)]
				}
				c.fillStyle = color
				c.fillRect(x0 + x, y - windowHeight, windowWidth, windowHeight)
			}
			}
		}
		if(car.x<=canvas.width){
		car.x = car.x + car.v_x;
		c.drawImage(car.img,car.x,car.y,car.width,car.height);
		}else{
			car.x = 0;
		}
	}
	function isIn(x,y,blg){
		if(x<=blg.pts + blg.blgWidth&&x>=blg.pts&&y>=floor - blg.blgHeight&&y<=canvas.height/2) return true;
		else return false;
	}
	var click = function(e){
		var x = e.clientX;
		var y = e.clientY;
		for(var i = blgs.length-1 ; i >= 0; i--){
			if(isIn(x,y,blgs[i])){
				var x = blgs[i];
				var x0 = x.pts;
				var blgWidth = x.blgWidth
				var blgHeight = x.blgHeight + 3;
				blgs[i].blgHeight = blgHeight;
				var blgColor = x.blgColor
				c.fillStyle= blgColor
				c.fillRect(x0, floor - blgHeight, blgWidth, blgHeight)
				for (var y = floor - floorSpacing; y > floor - blgHeight; y -= floorSpacing + windowHeight) {
					for (var x = windowSpacing; x < blgWidth - windowWidth; x += windowSpacing + windowWidth) {
						var color = blgColors[ Math.floor(Math.random()*blgColors.length)];
						while(color == blgColor) {
							color = blgColors[ Math.floor(Math.random()*blgColors.length)]
						}
						c.fillStyle = color
						c.fillRect(x0 + x, y - windowHeight, windowWidth, windowHeight)
					}
				}
			
			break;
		}
		}
	}

	return {
		build: build,
		update: update,
		click: click
	}
	//for animation
	
}

window.onload = function() {
	var app = createApp(document.querySelector("canvas"))
	document.getElementById("build").onclick = app.build
	window.setInterval(app.update,50,false);
	var canvas = document.querySelector("canvas");
	canvas.addEventListener("click",app.click,false);
}
