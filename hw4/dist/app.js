var keys = {}      //keyboard code map, handle the multi-press issues
var enemyLimit = 5 // maximum number of enemy on one screen
var enemyList = [] // current enemy on screen
var blastImg = {}  // preload blast imgs 
var start = Date.now() // start timer
var score = 0 //score point 
var score_board //score board
var request_id //current request frameid
var isEnd = false // flag indicates whether the game is end
var isPause = false // flag indicates whether the game is pause
var app // main app
var fire // fire audio
var hit // hit audio
var bomb // blast audio
const Tank = function(type = "p1tankU", location, velocity = 5) { // tank class
    this.velocity = { x: velocity, y: velocity } 
    this.location = location
    this.img = new Image()
    this.img.src = "images/" + type + ".gif"
    this.size = { x: 40, y: 40 } //image size
    this.bullet //tank's bullet
    this.life = 5 //tank's life
    this.type = type.substring(type.length - 1) // tank's type, indicating its direction
    this.tickFrame = 1 

}

const Bullet = function(location, velocity = 5, type = "U", host) {
    this.velocity = { x: velocity, y: velocity }
    this.location = location
    this.img = new Image()
    this.img.src = "images/bullet.gif"
    this.size = { x: 5, y: 5 }
    this.type = type //bullet's direction
    this.host = host //bullet's host, could be a tank or an enemy
}

const Enemy = function(type = "D", location, velocity = 2, level = 1) {
    this.velocity = { x: velocity, y: velocity }
    this.location = location
    this.img = new Image()
    this.img.src = "images/enemy" + level + type + ".gif"
    this.size = { x: 40, y: 40 }
    this.bullet = new Bullet({ x: this.location.x + 5, y: this.location.y + 20 }, 3, type, this)
    this.life = level
    this.level = level //enemy's level
    this.type = type // enemy's type, indicating its direction
    this.tickFrame = 1


}
Enemy.prototype.changeDirection = function() { // randomly change enemy's direction
    setInterval(() => {
        const directions = ["U", "D", "L", "R"]
        index = Math.floor(Math.random() * directions.length)
        this.type = directions[index]
    }, 1000)
}

Enemy.prototype.update = function(canvas, dispatcher) { // update location of enemy
    if (this.life > 0) {
        if (this.type == "U") { //up arrow
            if (this.location.y - this.velocity.y > 0) { // figure out if the object is out of border
                this.location.y = this.location.y - this.velocity.y
            }
            this.img.src = "images/enemy" + this.level + this.type + ".gif" // change its image
        } else if (this.type == "D") { //down arrow
            if (this.location.y + this.velocity.y < 460) { 
                this.location.y = this.location.y + this.velocity.y
            }
            this.img.src = "images/enemy" + this.level + this.type + ".gif"
        } else if (this.type == "L") { //left arrow
            if (this.location.x - this.velocity.x > 0) {
                this.location = { x: this.location.x - this.velocity.x, y: this.location.y }
            }
            this.img.src = "images/enemy" + this.level + this.type + ".gif"
        } else if (this.type == "R") { //right arrow
            if (this.location.x + this.velocity.x < 460) {
                this.location = { x: this.location.x + this.velocity.x, y: this.location.y }
            }
            this.img.src = "images/enemy" + this.level + this.type + ".gif"
        }
        var bullet = this.bullet
        if (bullet == null) { // if currently there is no bullet of the enemy, it will automatically fire
            switch (this.type) {
                case "D":
                    bullet = new Bullet({ x: this.location.x + 19, y: this.location.y + 26 }, 6, this.type, this)
                    break
                case "U":
                    bullet = new Bullet({ x: this.location.x + 18, y: this.location.y + 8 }, 6, this.type, this)
                    break
                case "L":
                    bullet = new Bullet({ x: this.location.x + 5, y: this.location.y + 20 }, 6, this.type, this)
                    break
                case "R":
                    bullet = new Bullet({ x: this.location.x + 30, y: this.location.y + 20 }, 6, this.type, this)
                    break
            }
            this.bullet = bullet
            dispatcher.push(bullet) // push the bullet object into the dispatcher
        }
        collide(this, canvas, dispatcher)
    }
    if (this.life <= 0) { // handle the blast effect
        if (this.tickFrame < 16 && this.tickFrame % 2 == 0) {
            console.log(this.tickFrame)
            var i = (this.tickFrame / 2)
            this.img = blastImg[i]
        }
        if (this.tickFrame >= 16) {
            dispatcher.splice(dispatcher.indexOf(this), 1)
            enemyList.splice(0, 1)
        }
        this.tickFrame++
    }
}



Bullet.prototype.update = function(canvas, dispatcher) { // update bullet's location

    switch (this.type) {
        case "U": 
            if (this.location.y - this.velocity.y > 0) { // figure out if the object is out of border
                this.location.y = this.location.y - this.velocity.y
            } else {
                hit.play()
                dispatcher.splice(dispatcher.indexOf(this), 1)
                this.host.bullet = null

            }
            break
        case "D":
            if (this.location.y + this.velocity.y < 500) {
                this.location.y = this.location.y + this.velocity.y
            } else {
                hit.play()
                dispatcher.splice(dispatcher.indexOf(this), 1)
                this.host.bullet = null
            }
            break
        case "L":
            if (this.location.x - this.velocity.x > 0) {
                this.location = { x: this.location.x - this.velocity.x, y: this.location.y }
            } else {
                hit.play()
                dispatcher.splice(dispatcher.indexOf(this), 1)
                this.host.bullet = null
            }
            break
        case "R":
            if (this.location.x + this.velocity.x < 500) {
                this.location = { x: this.location.x + this.velocity.x, y: this.location.y }
            } else {
                hit.play()
                dispatcher.splice(dispatcher.indexOf(this), 1)
                this.host.bullet = null
            }
            break
    }
    collide(this, canvas, dispatcher)
}
Tank.prototype.update = function(canvas, dispatcher) { // update tank's location by player's command

    if (38 in keys && keys[38] == true) { //up arrow
        if (this.location.y - this.velocity.y > 0) {
            this.location.y = this.location.y - this.velocity.y
        }
        this.img.src = "images/" + "p1tankU" + ".gif"
        this.type = "U"
    } else if (40 in keys && keys[40] == true) { //down arrow
        if (this.location.y + this.velocity.y < 460) {
            this.location.y = this.location.y + this.velocity.y
        }

        this.img.src = "images/" + "p1tankD" + ".gif"
        this.type = "D"
    } else if (37 in keys && keys[37] == true) { //left arrow
        if (this.location.x - this.velocity.x > 0) {
            this.location = { x: this.location.x - this.velocity.x, y: this.location.y }
        }
        this.img.src = "images/" + "p1tankL" + ".gif"
        this.type = "L"
    } else if (39 in keys && keys[39] == true) { //right arrow
        if (this.location.x + this.velocity.x < 460) {
            this.location = { x: this.location.x + this.velocity.x, y: this.location.y }
        }
        this.img.src = "images/" + "p1tankR" + ".gif"
        this.type = "R"
    }
    if (32 in keys && keys[32] == true) { // if press spacebar, fire a bullet

        var type = this.img.src.substring(this.img.src.length - 5, this.img.src.length - 4)
        var bullet = this.bullet
        if (bullet == null) {
            switch (type) {
                case "D":
                    bullet = new Bullet({ x: this.location.x + 19, y: this.location.y + 26 }, 6, type, this)
                    break
                case "U":
                    bullet = new Bullet({ x: this.location.x + 18, y: this.location.y + 8 }, 6, type, this)
                    break
                case "L":
                    bullet = new Bullet({ x: this.location.x + 5, y: this.location.y + 20 }, 6, type, this)
                    break
                case "R":
                    bullet = new Bullet({ x: this.location.x + 30, y: this.location.y + 20 }, 6, type, this)
                    break
            }
            fire.play()
            this.bullet = bullet
            dispatcher.push(bullet)
        }
    }

    collide(this, canvas, dispatcher)
    window.document.getElementById("player-life").innerHTML = this.life

}

var gameover = function() { // gameover 
    $('#myModal').modal("show")
    isEnd = true
}

var reset = function() { //reset the game
    window.location.reload()
}
var pause = function(){ //pause the game
    if(isPause == true){
        isPause = false
        
        window.document.getElementById("pause-btn").innerHTML = "<span id=\"pause-btn-icon\" class=\"glyphicon glyphicon-pause\""+ 
        "aria-hidden=\"true\"></span> Pause"
        request_id = window.requestAnimationFrame(app.draw)

    }else{
        isPause = true
        var icon = window.document.getElementById("pause-btn-icon")
        icon.className = "glyphicon glyphicon-play"
        window.document.getElementById("pause-btn").innerHTML = "<span id=\"pause-btn-icon\" class=\"glyphicon glyphicon-play\" "+
        "aria-hidden=\"true\"></span> Play"
    }
}

var collide = function(object, canvas, dispatcher) { // figure out if there is a collision between any objects in the dispatcher
    for (var i = 0; i < dispatcher.length; i++) {
        if (dispatcher[i] != object && !(dispatcher[i] instanceof Bullet) && !(object instanceof Bullet)) { // handle the collision between 
            if (object.type == "L" && object.location.x > dispatcher[i].location.x &&                       //tank and enemy objects
                Math.abs(object.location.y - dispatcher[i].location.y) < dispatcher[i].size.y && 
                object.location.x - dispatcher[i].location.x < dispatcher[i].size.x) {
                object.location.x = dispatcher[i].location.x + dispatcher[i].size.x
                return true
            } else if (object.type == "R" && object.location.x < dispatcher[i].location.x 
                && Math.abs(object.location.y - dispatcher[i].location.y) < dispatcher[i].size.y 
                && dispatcher[i].location.x - object.location.x < object.size.x) {
                object.location.x = dispatcher[i].location.x - object.size.x
                return true
            } else if (object.type == "U" && object.location.y > dispatcher[i].location.y 
                && Math.abs(object.location.x - dispatcher[i].location.x) < dispatcher[i].size.x 
                && object.location.y - dispatcher[i].location.y < dispatcher[i].size.y) {
                object.location.y = dispatcher[i].location.y + dispatcher[i].size.y
                return true
            } else if (object.type == "D" && object.location.y < dispatcher[i].location.y 
                && Math.abs(object.location.x - dispatcher[i].location.x) < dispatcher[i].size.x 
                && dispatcher[i].location.y - object.location.y < object.size.y) {
                object.location.y = dispatcher[i].location.y - object.size.y
                return true
            }
        } else if (dispatcher[i] != object && object instanceof Bullet && !(dispatcher[i] instanceof Bullet)) { // handle the collision between
            if (object.host != dispatcher[i] && Math.abs(object.location.x - dispatcher[i].location.x) < dispatcher[i].size.x //bullets and tank
                && Math.abs(object.location.y - dispatcher[i].location.y) < dispatcher[i].size.y) {
                if (dispatcher[i] instanceof Tank && object.host instanceof Enemy) { //if enemy's bullet has hit the tank
                    dispatcher[i].life -= 1
                    if (dispatcher[i].life == 0) { // if tank's life become 0, pop up the defeated modal
                        bomb.play()
                        gameover()
                    }
                } else if (dispatcher[i] instanceof Enemy && object.host instanceof Tank) { // if tank's bullet has hit the enemy
                    dispatcher[i].life -= 1
                    hit.play()
                    if (dispatcher[i].life == 0) { // if enemy's life become 0, increment the score
                        bomb.play()
                        score += 100*dispatcher[i].level
                        score_board.innerHTML = score + " pts"
                    }
                }
                object.host.bullet = null
                dispatcher.splice(dispatcher.indexOf(object), 1)
            }

        }
    }
    return false
}

function createApp(canvas, dispatcher) { //initial the canvas 
    var start = Date.now()
    var tank = new Tank("p1tankU", { x: 230, y: 460 }, 2)
    const ctx = canvas.getContext("2d")
    dispatcher.push(tank)
    var srcs = {}
    for (var i = 0; i < 8; i++) {
        srcs[i] = "images/blast" + (i + 1) + ".gif"
    }
    for (var i = 0; i < 8; i++) {
        blastImg[i] = new Image()
        blastImg[i].src = srcs[i]
        blastImg[i].onload = function() {
            console.log("blast" + i + " loaded")
        }
    }

    var addEnemy = function() { // add enemy by time and current number of enemies
        var end = Date.now()
        var level = 1
        if (end - start > 20000 && end - start <= 40000) { // let enemy become more and more powerful while time goes
            level = 2
        } else if (end - start > 40000) {
            level = 3
        }
        if (enemyList.length <= enemyLimit) {
            var x = Math.floor(Math.random() * 460)
            var y = Math.floor(Math.random() * 460)
            var location = { x: x, y: y }
            var node = new Enemy("D", location, 2, level)
            node.changeDirection()
            console.log(node.img)
            enemyList.push(node)
            dispatcher.push(node)
            dispatcher.push(node.bullet)
        }
    }
    setInterval(addEnemy, 3000)
    var draw = function() { // draw frame
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (var i = 0; i < dispatcher.length; i++) {
            dispatcher[i].update(canvas, dispatcher)
        }
        for (var i = 0; i < dispatcher.length; i++) {
            ctx.drawImage(dispatcher[i].img, dispatcher[i].location.x, dispatcher[i].location.y, dispatcher[i].size.x, 
                dispatcher[i].size.y)
        }
        request_id = window.requestAnimationFrame(draw)
        if(isEnd == true){
            window.cancelAnimationFrame(request_id)
            isEnd = false
        }else if(isPause == true){
            window.cancelAnimationFrame(request_id)
        }
    }
    return { draw: draw }
}



window.onload = () => { // load the page 
    const canvas = document.querySelector("canvas")
    const dispatcher = []
    score_board = document.getElementById('score-board')
    app = createApp(canvas, dispatcher)
    var doKeyDown = function(e) {
        keys[e.keyCode] = true
    }
    var doKeyUp = function(e) {
        keys[e.keyCode] = false
    }
    window.addEventListener("keydown", doKeyDown, true)
    window.addEventListener("keyup", doKeyUp, true)
    var bgm = document.createElement("audio")
    bgm.id = "bgm"
    bgm.style.display = "none"
    bgm.preload = true
    bgm.src = "audios/start.wav"
    bgm.play()
    fire = document.createElement("audio")
    fire.id = "fire"
    fire.style.display = "none"
    fire.preload = true
    fire.src = "audios/fire.wav"
    hit = document.createElement("audio")
    hit.id = "hit"
    hit.style.display = "none"
    hit.preload = true
    hit.src = "audios/hit.wav"
    bomb = document.createElement("audio")
    bomb.id = "hit"
    bomb.style.display = "none"
    bomb.preload = true
    bomb.src = "audios/blast.wav"
    request_id = window.requestAnimationFrame(app.draw)

}
