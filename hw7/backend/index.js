const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: new Date().getTime(), 
    resave: false, 
    saveUninitialized: true, 
    cookie: { secure: true }
}))
const enableCORS = (req,res,next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin)
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Credentials',true)
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE')
    next()
}
app.use(enableCORS)
require('./src/auth').auth(app)
require('./src/profile')(app)
require('./src/articles')(app)
require('./src/following')(app)

const port = process.env.PORT||3000
if(process.env.NODE_ENV !== "production"){
    require('dotenv')
}
const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})