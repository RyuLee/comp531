const Profile = require('./model.js').Profile
const User = require('./model.js').User
const isLoggedIn = require('./auth.js').isLoggedIn
const multer = require('multer')
const stream = require('stream')
const uploadImage = require('./uploadCloudinary')
if (!process.env.CLOUDINARY_URL) {
     process.env.CLOUDINARY_URL="cloudinary://594485725374254:9TQYCAM8wreFuPFlm7gSDD_ZDUU@hhykjdqj6"
}

const getHeadlines = (req, res) => {
    if (!req.username) req.username = 'pl26test'
    const users = req.params.users ? req.params.users.split(',') : [req.username]
    var headlines = []
        Profile.find({}).exec((err,item)=>{
            if(err==null&&item!=null){
                //console.log(item)
                item.forEach((e)=>{
                    if(users.indexOf(e.username)!=-1){
                        headlines.push({username:e.username,headline:e.headline})
                    }
                })
                res.send({"headlines":headlines})
            }else
                res.status(204).send({})
        })
}

const updateHeadline = (req,res) => {
    if(!req.username) req.username = "pl26"
    const user = req.username
    //console.log(user)
    Profile.findOne({username:user}).exec((err,item)=>{
        if(err==null&&item!=null){
            item.headline = req.body.headline
            item.save((err)=>{
                console.log("headline updated")
                res.send({username:user,headline:item.headline})
            })
        }else
            res.status(204).send({})
    })
}

const getEmail = (req,res) => {
if(!req.params.user){
        req.params.user = req.username
    }
    const user = req.params.user
    Profile.findOne({username:user}).exec((err,item)=>{
        if(err==null&&item!=null){
            res.send({username:user,email:item.email})
        }else{
            res.status(204).send({})
        }
    })
}

const updateEmail = (req,res) => {
    const user = req.username ? req.username : "pl26test1"
    Profile.findOne({username:user}).exec((err,item)=>{
        if(err==null&&item!=null){
            item.email = req.body.email
            item.save((err)=>{
                console.log("email updated")
                res.send({username:item.username,email:item.email})
            })
        }else
            res.status(204).send({})
    })
}

const getZipcode = (req,res) => {
    if(!req.params.user){
        req.params.user = req.username
    }
    const user = req.params.user
    Profile.findOne({username:user}).exec((err,item)=>{
        if(err==null&&item!=null){
            res.send({username:user,zipcode:item.zipcode})
        }else{
            res.status(204).send({})
        }
    })
}

const updateZipcode = (req,res) => {
    const user = req.username ? req.username : "pl26test1"
    Profile.findOne({username:user}).exec((err,item)=>{
        if(err==null&&item!=null){
            item.zipcode = req.body.zipcode
            item.save((err)=>{
                console.log("zipcode updated")
                res.send({username:user,zipcode:item.zipcode})
            })
        }else
            res.status(204).send({})
    })
}
 
const getDob = (req,res) => {
    const user = req.username ? req.username : "pl26test1"
    Profile.findOne({username:user}).exec((err,item)=>{
        if(err==null&&item!=null){
            res.send({username:user,dob:new Date(item.date).getTime()})
        }else
            res.status(204).send({})
    })
}

const updatePwd = (req,res) => {
    if(!req.username) req.username = "pl26"
    const user = req.username
    res.send({username:user,status:"will not change"})
}

const getAvatars = (req,res) => {
    const users = req.params.users ? req.params.users.split(',') : [req.username]
    for(var i = 0; i < users.length; i++){
        users[i] = {username:users[i]}
    }
    //console.log(users)
    var avatar = []
    Profile.find({"$or":users}).exec((err,item)=>{
    console.log(item)
    if(item!=null)
        item.forEach((e)=>{
            if(e.avatar != "")
            avatar.push({username:e.username,avatar:e.avatar})
            else avatar.push({username:e.username,avatar:"https://i.ytimg.com/vi/opKg3fyqWt4/hqdefault.jpg"})
        })
    res.send({avatars:avatar})
})
}

const updateAvatar = (req,res) => {
    Profile.findOne({username:req.username},(err,item)=>{
        item.avatar = req.fileurl
        item.save((err)=>{
            console.log("image uploaded!")
            res.send({username:req.username,avatar:item.avatar})
        })
    })
}
module.exports = app => {
     app.get('/headlines/:users*?',isLoggedIn ,getHeadlines)
     app.put('/headline', isLoggedIn,updateHeadline)
     app.get('/email/:user*?', isLoggedIn,getEmail)
     app.put('/email', isLoggedIn,updateEmail)
     app.get('/zipcode/:user*?', isLoggedIn,getZipcode)
     app.put('/zipcode', isLoggedIn,updateZipcode)
	 app.get('/dob',isLoggedIn,getDob)
     app.get('/avatars/:user*?', isLoggedIn,getAvatars)
     app.put('/avatar', isLoggedIn,uploadImage('avatar'),updateAvatar)
     app.put('/password',isLoggedIn,updatePwd)
}