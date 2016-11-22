const md5 = require('md5')
const password = 'abc123'
const model = require('./model.js')
const redis = require('redis').createClient('redis://h:pdoifvie7t3fl4gia41tmgvslu@ec2-54-221-228-237.compute-1.amazonaws.com:11749')
const secret = "E=MC^2"
const cookieKey = 'sid'
const addUser = (username,password,salt) => {
    new model.User({username:username,salt:salt,hash:password}).save(()=>{
        console.log('new user:'+username+" saved!")
    })
    console.log("save")
}
const getUser = (username,callback) => {
     model.User.findOne({username:username}).exec((err,item)=>{
        if(item!=null){
            console.log('Finded'+username)
            callback(item)
        }else
            return null
    })
}
const register = (req,res) => {
    if(!req.body.username||!req.body.password){
        res.status(400).send('username or password should be supplied!')
        return
    }
    const query = model.User.findOne({username:req.body.username})
    query.exec((err,item)=>{
        if(item==null){
            console.log("false")
            var salt = new Date().getTime()
            var hash = md5(req.body.password+salt)
            addUser(req.body.username,hash,salt)
            const email = req.body.email ? req.body.email:"ryulee2014@gmail.com"
            const zipcode = req.body.zipcode? req.body.zipcode:"77030"
            const dob = req.body.bday ? req.body.bday:new Date().getTime()
            new model.Profile({username:req.body.username,headline:"test",email:email,zipcode:zipcode,dob:dob}).save((err)=>{
                if(err){
                    console.log(err)
                }
            })
            res.send({
                username:req.body.username,
                status:"success"
            })
        }else{
            res.status(400).send('user has already existed!')
            return
        }
    })
}

const login = (req,res) => {
    console.log("asdsad")
    if(!req.body.username||!req.body.password){
        res.status(401).send('Unauthorized!')
        return
    }
    getUser(req.body.username,(item)=>{
        const userObj = item
        if(userObj==null){
        res.status(401).send("Unauthorized!")
        return
    }
    console.log(userObj)
    var pwd = userObj.hash
    if(md5(req.body.password+userObj.salt)!==pwd){
        res.status(401).send('Unauthorized!')
        return
    }else{
        console.log(userObj)
        const sessionKey = md5(secret+new Date().getTime() + userObj.username)
        redis.hmset(sessionKey, userObj)
        res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true})
        res.send({
            username:req.body.username,
            status:'success'
        })
        return
    }
    })
}

const logout = (req,res) => {
    redis.del(req.cookies[cookieKey])
    res.clearCookie(cookieKey)
    req.session.destroy(()=>{res.redirect('/')})
}

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

module.exports.auth = app => {
    app.post('/login',login)
    app.post('/register',register)
    app.get('/logout',isLoggedIn,logout)
}

module.exports.isLoggedIn = isLoggedIn