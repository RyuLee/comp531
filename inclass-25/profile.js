const multer = require('multer')
const stream = require('stream')
const uploadImage = require('./uploadCloudinary')
if (!process.env.CLOUDINARY_URL) {
     process.env.CLOUDINARY_URL="cloudinary://735513443289778:YKxL3IfK_rYabViJaCU1cdA22S8@hzgjkddmk"
}
const profile = {
    "pl26":{
        headline: 'This is my headline!',
        email: 'foo@bar.com',
        zipcode: 12345,
        dob:new Date("11/11/1994").toDateString(),
        avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg'
    },
    "test1":{
        headline: 'This is test1\'s headline!',
        email: 'a@b.com',
        zipcode: 00000,
        dob:new Date("11/11/1995").toDateString(),
        avatar: 'foo'
    }
}

const headlines = {
    "pl26":"This is my headline!",
    "test1":"This is test1\'s headline!"
}

const getHeadlines = (req, res) => {

    if (!req.user) req.user = 'pl26'

    const users = req.params.users ? req.params.users.split(',') : [req.user]
    const payload = {headlines: users.map((obj)=>{return {username: obj, headline:headlines[obj]}})}
    res.send(JSON.stringify(payload))
}

const updateHeadline = (req,res) => {
    if(!req.body.username) req.body.username = "pl26"
    const user = req.body.username
    profile[user].headline = req.body.headline
    res.send({username:user,headline:profile[user].headline})
}

const getEmail = (req,res) => {
    if(!req.params.user) req.params.user = "pl26"
    const user = req.params.user
    res.send({username:user,email:profile[user].email})
}

const updateEmail = (req,res) => {
    if(!req.user) req.user = "pl26"
    profile[req.user].email = req.body.email
    res.send({username:req.user,email:profile[req.user].email})
}

const getZipcode = (req,res) => {
    if(!req.params.user) req.params.user = "pl26"
    const user = req.params.user
    res.send({username:user,zipcode:profile[user].zipcode})
}

const updateZipcode = (req,res) => {
    if(!req.user) req.user = "pl26"
    profile[req.user].zipcode = req.body.zipcode
    res.send({username:req.user,zipcode:profile[req.user].zipcode})
}
 
const getDob = (req,res) => {
    if(!req.user) req.user = "pl26"
    const user = req.user
    res.send({username:user,dob:profile[user].dob})
}

const updatePwd = (req,res) => {
    if(!req.user) req.user = "pl26"
    const user = req.user
    res.send({username:req.user,status:"will not change"})
}

const getAvatars = (req,res) => {
    if(!req.user) req.user = "pl26"
    const users = req.params.users ? req.params.users.split(',') : [req.user]
    res.send({
        avatars: users.map((obj)=>{return {
            username: obj, avatar:profile[obj].avatar
        }})
    })
}

const updateAvatar = (req,res) => {
    if(!req.user) req.user = "pl26"
    profile[req.user].avatar = req.fileurl
   res.send({username:req.user,avatar:profile[req.user].avatar})
}

module.exports = app => {
     app.get('/headlines/:users*?', getHeadlines)
     app.put('/headline', updateHeadline)
     app.get('/email/:user?', getEmail)
     app.put('/email', updateEmail)
     app.get('/zipcode/:user?', getZipcode)
     app.put('/zipcode', updateZipcode)
	 app.get('/dob',getDob)
     app.get('/avatars/:user*?', getAvatars)
     app.put('/avatar', uploadImage('avatar'), updateAvatar)
}