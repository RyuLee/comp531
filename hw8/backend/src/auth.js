'use strict'
const md5 = require('md5')
const cookieParser = require('cookie-parser')
var session = require('express-session')
var request = require('request')
const password = 'abc123'
const model = require('./model.js')
const User = require('./model.js').User
const Article = require('./model.js').Article
const Profile = require('./model.js').Profile
const Comment = require('./model.js').Comment
const redis = require('redis').createClient('redis://h:p9df6463179afbca4e1ce4082ffb8675dd41d1e7fcdf57a6b2537a120e3b3a5d7@ec2-54-83-63-242.compute-1.amazonaws.com:16299')
const secret = "E=MC^2"
const cookieKey = 'sid'
var passport = require('passport')
var Strategy = require('passport-facebook').Strategy
const FACEBOOK_APP_ID = "1845569965686797"
const FACEBOOK_APP_SECRET = "ef1e481b8c22b941b0cdb1d9367cb0d5"
const FACEBOOK_CONFIG = {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    passReqToCallback: true
  }
var originHostUrl = ''

passport.serializeUser(function(user, done){
	done(null, user.id)
})

passport.deserializeUser(function(id,done){
	User.findOne({authId: id}).exec(function(err, user) {
		done(null, user)
	})
})

const merge = (req, res) => {
	const username = req.body.regUsername;
	const password = req.body.regPassword;
	if (!username || !password) {
		res.status(400).send("username or password is missing")
		return
	}
	User.find({username: username}).exec(function(err, users){
        if (!users || users.length === 0){
            res.sendStatus(400)
            return
        }
        const userObj = users[0]
		if(!userObj){
			res.status(400).send("Don't have this user in db")
		}
		const salt = userObj.salt;
		const hash = userObj.hash;

		if(md5(password + salt) === hash){
			//third party username
			Article.update({author:req.username}, { $set: { 'author': username}}, { new: true, multi: true}, function(){})
			Article.update({'comments.author' : req.username}, { $set: {'comments.$.author': username}}, { new: true, multi: true }, function(){})
			Comment.update({author:req.username}, { $set: { 'author': username}}, { new: true, multi: true }, function(){})
			Profile.findOne({username: req.username}).exec(function(err, profile){
				if(profile){
					const oldFollowingArr = profile.following
					Profile.findOne({username: username}).exec(function(err, newProfile) {
						if(newProfile){
							//concat
							const newFollowingArr = newProfile.following.concat(oldFollowingArr)
							Profile.update({username: username}, {$set: {'following': newFollowingArr}}, function(){})
						}
					})
					//delete the profile record
					Profile.update({username: req.username}, {$set: {'following':[]}}, function(){})
				}
			})
			User.findOne({username: username}).exec(function(err, user){
				if(user){
					const usrArr = req.username.split('@');
					const authObj = {}
					authObj[`${usrArr[1]}`] = usrArr[0]
					User.update({username: username}, {$addToSet: {'auth': authObj}}, {new: true}, function(){})
				}
			})
			res.status(200).send({ username: username, result: 'success'})
		} else{
			res.status(401).send("incorrect password!")
		}
	})
}
const addUser = (username,password,salt) => {
    new model.User({username:username,salt:salt,hash:password}).save(()=>{
        console.log('new user:'+username+" saved!")
    })
    console.log("save")
}
const getUser = (username,callback) => {
     model.User.findOne({username:username}).exec((err,item)=>{
        if(item!=null){
            //console.log('Finded'+username)
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
            //console.log("false")
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

const unlink = (req, res) => {
	const username = req.username
	const company = "facebook"
	User.findOne({username: username}).exec(function(err, user){
		if(user.auth.length !== 0){
			User.findOne({username: username}).exec(function(err,user){
				let authArr = user.auth
				authArr = authArr.filter(function (obj) {
					return Object.keys(obj)[0] !== company;
				})
				User.update({username: username}, {$set: {'auth': authArr}}, {new: true}, function(){})
				res.status(200).send({result: 'successfully unlink ' + company})
			})
		} else {
			res.status(400).send("no link account")
		}
	})
}

const login = (req,res) => {
    
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
    //console.log(userObj)
    var pwd = userObj.hash
    if(md5(req.body.password+userObj.salt)!==pwd){
        res.status(401).send('Unauthorized!')
        return
    }else{
        //console.log(userObj)
        const sessionKey = md5(secret+new Date().getTime() + userObj.username)
        redis.hmset(sessionKey, userObj)
        res.cookie(cookieKey, sessionKey, { maxAge: 3600*100})
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

function isLoggedIn(req, res, next){
	console.log(req.isAuthenticated())
	if (req.isAuthenticated()) {
		const usrArr = req.user.username.split('@');
		const authObj = {}
		authObj[`${usrArr[1]}`] = usrArr[0]
		User.findOne({auth: authObj}).exec(function(err,user) {
			if(!user){
				req.username = req.user.username
			} else {
				req.username = user.username
			}
			next()
		})
	} else{
		const sid = req.cookies[cookieKey]
		if (!sid){
            //console.log("Unauthorized")
	        return res.sendStatus(401)
	    }
	    redis.hgetall(sid, function(err, userObj) {
	    	if(err) throw err;
	    	if(userObj){
	    		console.log(sid + ' mapped to ' + userObj.username)
	    		req.username = userObj.username
				next()
			}
			else{
				res.sendStatus(401)
			}
	    })
	}
	
}

const success = (req,res) => {
    console.log("success")
    //console.log(originHostUrl)
	res.redirect(originHostUrl)
}

const error = (err,req,res,next) => {
    if(err) {
        res.status(400);
        res.send({err: err.message});
    }
}

const redirect = (req, res, next) => {
	if(originHostUrl === ''){
		originHostUrl = req.headers.referer
	}
	next()
}

passport.use(new Strategy(FACEBOOK_CONFIG,
 function(req, token, refreshToken, profile, done){
		const username = profile.displayName + "@" + profile.provider
		const sid = req.cookies[cookieKey]
		if(!sid){
			User.findOne({username: username}).exec(function(err, user) {
				if(!user || user.length === 0){
					const userObj = new User({username: username, authId: profile.id})
					new User(userObj).save(function (err, usr){
						if(err) return console.log(err)
					})
					const profileObj = new Profile({username: username, headline: "login by facebook", following:[], email: null, zipcode: null, dob: new Date(1994,09,09).getTime(), avatar: ""})
					new Profile(profileObj).save(function (err, usr){
						if(err) return console.log(err)
					})
				}
				
			})
            return done(null, profile)
		} else {
			redis.hgetall(sid, function(err, userObj) {
				const localUser = userObj.username
				Article.update({author:username}, { $set: { 'author': localUser}}, { new: true, multi: true }, function(){})
				Article.update({'comments.author' : username}, { $set: {'comments.$.author': localUser}}, { new: true, multi: true }, function(){})
				Comment.update({author:username}, { $set: { 'author': localUser}}, { new: true, multi: true }, function(){})
				Profile.findOne({username: username}).exec(function(err, profileData){
					if(profileData){
						const oldFollowingArr = profileData.following
						Profile.findOne({username: localUser}).exec(function(err, newProfile) {
							if(newProfile){
								//concat
								const newFollowingArr = newProfile.following.concat(oldFollowingArr)
								Profile.update({username: localUser}, {$set: {'following': newFollowingArr}}, function(){})
							}
						})
						Profile.update({username: username}, {$set: {'following':[]}}, function(){})
					}
				})
				User.findOne({username: localUser}).exec(function(err, user){
					if(user){
						let authObj = {}
						authObj[`${profile.provider}`] = profile.displayName
						User.update({username: localUser}, {$addToSet: {'auth': authObj}}, {new: true}, function(){})
					}
				})
			})
            console.log("profile2")
            console.log(profile)
			return done(null, profile)
		}
	}
));
module.exports.auth = app => {
    app.use(redirect)
    app.use(session({ secret: 'keyboard hahah', resave: false, saveUninitialized: false }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use('/login/facebook', passport.authenticate('facebook', {scope:'email'}))
    app.use('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect:'/login/facebook'}), success, error)
    app.post('/login',login)
    app.post('/unlink', unlink)
	app.post('/merge', merge)
    app.post('/register',register)
    app.put('/logout',isLoggedIn,logout)
    app.use('/link/facebook', passport.authorize('facebook', {scope:'email'}))
}

module.exports.isLoggedIn = isLoggedIn