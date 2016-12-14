const md5 = require('md5')
const password = 'abc123'
const model = require('./model.js')
const redis = require('./auth.js').redis
const secret = "E=MC^2"
const cookieKey = 'sid'

const isLoggedIn = (req,res,next) => {
    var sid = req.cookies[cookieKey]
    if (!sid){
        return res.sendStatus(401)
    }
    console.log(sid)
    redis.hgetall(sid, function(err, userObj){
        if (err) console.error(`There was an error ${err}`)
        console.log(`Result: `, userObj.username)
        if (userObj){
        req.body.username = userObj.username
        next()
        }
        else{
            return res.sendStatus(401)
        }
    })
    }
module.exports = isLoggedIn