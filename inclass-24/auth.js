const md5 = require('md5')

const password = '123456'

const salt = md5('11/03/2016')

var redis = require('redis').createClient('redis://h:p92s0ro3qk55o140vsaqpa1ev87@ec2-54-83-60-31.compute-1.amazonaws.com:15309')

const cookieParser = require('cookie-parser') 
const Users = {
    'pl26':{
        username: 'pl26',
        hash: (md5(password + salt)),
        salt: salt
    }
}

const sessionUser = {}
const key = "cookie"

const addUser = (username, password) => {
    const newSalt = md5((new Date()).getTime())
    Users[username] = {username, hash: md5(password + newSalt), salt: newSalt}
}

const register = (req, res) => {
    if (!req.body.username || !req.body.password){
        res.status(400).send('username and password should be supplied')
        return
    }

    if (Users[req.body.username]){
        res.status(400).send('user already exists')
        return
    }

    addUser(req.body.username, req.body.password)

    res.send({
        username: Users[req.body.username].username,
        status: 'success'
    })
}

const isLoggedIn = (req,res) => {
    var sid = req.cookies[key]
    if (!sid){
        return res.sendStatus(401)
    }

    redis.hgetall(key, function(err, userObj){
        if (err) console.error(`There was an error ${err}`)
        console.log(`Result: `, userObj.username)
        if (userObj){
        req.username = userObj.username
        next()
        }
        else{
            return res.sendStatus(401)
        }
    })
}

const login = (req, res) => {
    if (!req.body.username || !req.body.password){
        res.status(401).send('Unauthorized')
        return
    }

    const userObj = Users[req.body.username]
    const sessionKey = md5(secret + new Date().getTime() + userObj.username)
    redis.hmset(cookieKey, userObj)

    if (userObj && md5(req.body.password + userObj.salt) == userObj.hash){
        res.send({username:userObj.username, status:'success'})
    }
    else{
        res.status(401).send('Unauthorized')
        return
    }
}

const logout = (req,res) => {
    res.send("OK")
}

module.exports = app => {
    app.put('./logout',isLoggedIn,logout)
    app.post('/login', login)
    app.post('/register', register)
}