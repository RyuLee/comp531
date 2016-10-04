const Tank = function(type = "p1tankU", location, velocity = 5) {
    this.velocity = { x: velocity, y: velocity }
    this.location = location
    this.img = new Image()
    this.img.src = "images/" + type + ".gif"
    this.size = { x: 40, y: 40 }

}

const Bullet = function(location, velocity = 1, type = "U", host = 0) {
    this.velocity = { x: velocity, y: velocity }
    this.location = location
    this.img = new Image()
    this.img.src = "images/bullet.gif"
    this.size = { x: 5, y: 5 }
    this.type = type //bullet's direction
    this.host = host
}



Bullet.prototype.update = function(e=null, canvas, dispatcher) {
    switch (this.type) {
        case "U":
            this.location.y = this.location.y - this.velocity.y
            break
        case "D":
            this.location.y = this.location.y + this.velocity.y
            break
        case "L":
            this.location.x = this.location.x - this.velocity.x
            break
        case "R":
            this.location.x = this.location.x + this.velocity.x
            break
    }
}
Tank.prototype.update = function(e = null, canvas, dispatcher) {
    if (e != null) {
        code = e.keyCode
        switch (code) {
            case 38: //up arrow
                if (this.location.y - this.velocity.y > 0) {
                    this.location.y = this.location.y - this.velocity.y
                }
                //this.img = new Image()
                this.img.src = "images/" + "p1tankU" + ".gif"
                break
            case 40: //down arrow
                if (this.location.y + this.velocity.y < 460) {
                    this.location.y = this.location.y + this.velocity.y
                }
                //this.img = new Image()
                this.img.src = "images/" + "p1tankD" + ".gif"
                break
            case 37: //left arrow
                if (this.location.x - this.velocity.x > 0) {
                    this.location = { x: this.location.x - this.velocity.x, y: this.location.y }
                }
                //this.img = new Image()
                this.img.src = "images/" + "p1tankL" + ".gif"
                break
            case 39: //right arrow
                if (this.location.x + this.velocity.x < 460) {
                    //console.log("changed")
                    this.location = { x: this.location.x + this.velocity.x, y: this.location.y }
                }
                //console.log(this.location)
                //this.img = new Image()
                this.img.src = "images/" + "p1tankR" + ".gif"
                break
            case 32:

                var type = this.img.src.substring(this.img.src.length - 5, this.img.src.length - 4)
                var bullet
                switch (type) {
                    case "D":
                        bullet = new Bullet({ x: this.location.x + 19, y: this.location.y + 26 }, 3, type, 0)
                        break
                    case "U":
                        bullet = new Bullet({ x: this.location.x + 18, y: this.location.y + 8 }, 3, type, 0)
                        break
                    case "L":
                        bullet = new Bullet({ x: this.location.x + 5, y: this.location.y + 20 }, 3, type, 0)
                        break
                    case "R":
                        bullet = new Bullet({ x: this.location.x + 30, y: this.location.y + 20 }, 3, type, 0)
                        break
                }

                dispatcher.push(bullet)
                break
            default:
                break
        }
    }

}

function createApp(canvas, dispatcher) {
    var tank = new Tank("p1tankU", { x: 10, y: 10 }, 3)
    const ctx = canvas.getContext("2d")
    dispatcher.push(tank)
    var updateX = function(e) {
        for (var i = 0; i < dispatcher.length; i++) {
            dispatcher[i].update(e, canvas, dispatcher)
        }
        //window.requestAnimationFrame(draw)
    }
    var draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (var i = 0; i < dispatcher.length; i++) {
            dispatcher[i].update(null, canvas, dispatcher)
        }
        for (var i = 0; i < dispatcher.length; i++) {
            ctx.drawImage(dispatcher[i].img, dispatcher[i].location.x, dispatcher[i].location.y, dispatcher[i].size.x, dispatcher[i].size.y)
        }
        window.requestAnimationFrame(draw)
    }
    return { draw: draw, updateX: updateX }
}



window.onload = () => {
    const canvas = document.querySelector("canvas")
    const dispatcher = []
    var app = createApp(canvas, dispatcher)
    window.addEventListener("keydown", app.updateX, true)
    var bgm = document.createElement("audio")
    bgm.id = "bgm"
    bgm.style.display = "none"
    bgm.preload = true
    bgm.src = "audios/start.wav"
        //bgm.play()
    var fire = document.createElement("audio")
    fire.id = "fire"
    fire.style.display = "none"
    fire.preload = true
    fire.src = "audios/fire.wav"

    var hit = document.createElement("audio")
    hit.id = "hit"
    hit.style.display = "none"
    hit.preload = true
    hit.src = "audios/hit.wav"
    window.requestAnimationFrame(app.draw)

}
