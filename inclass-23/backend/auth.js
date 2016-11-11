var express = require('express')
var bodyParser = require('body-parser')
var passport = require('passport')
var Strategy = require('passport-facebook').Strategy
var request = require('request')
var qs = require('querystring')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var app = express()
const FACEBOOK_APP_ID = "1826763780900818"
const FACEBOOK_APP_SECRET = "9824688d84eae7431c45ae4bd166f336"


passport.use(new Strategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


app.use(bodyParser.json())
const getHeadlines = (req,res) => {
	res.send({headline:"test headline"})
}


const middleware = (req,res,callback) => {
    res.header('Access-Control-Allow-Origin',req.headers.origin)
    res.header('Access-Control-Allow-Credentials',true)
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers','Authorization, Content-Type')
    callback()
}
app.use(middleware)
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))
app.get('/headlines',getHeadlines)
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
  })
app.get('/success',(req,res)=>{res.send({text:"login success"})})
const port = process.env.PORT || 3000

const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})