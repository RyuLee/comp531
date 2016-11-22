const Profile = require('./model.js').Profile
const User = require('./model.js').User
const isLoggedIn = require('./auth.js').isLoggedIn

const getHeadlines = (req, res) => {
    if (!req.body.username) req.body.username = 'pl26test'
    const users = req.params.users ? req.params.users.split(',') : [req.body.username]
    var headlines = []
        Profile.find({}).exec((err,item)=>{
            if(err==null&&item!=null){
                console.log(item)
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
    if(!req.body.username) req.body.username = "pl26"
    const user = req.body.username
    console.log(user)
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
        req.params.user = req.body.username
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
    const user = req.body.username ? req.body.username : "pl26test1"
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
        req.params.user = req.body.username
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
    const user = req.body.username ? req.body.username : "pl26test1"
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
    const user = req.body.username ? req.body.username : "pl26test1"
    Profile.findOne({username:user}).exec((err,item)=>{
        if(err==null&&item!=null){
            res.send({username:user,dob:new Date(item.date).getTime()})
        }else
            res.status(204).send({})
    })
}

const updatePwd = (req,res) => {
    if(!req.body.username) req.body.username = "pl26"
    const user = req.body.username
    res.send({username:user,status:"will not change"})
}

const getAvatars = (req,res) => {
    if(!req.user) req.user = "pl26test"
    const users = req.params.users ? req.params.users.split(',') : [req.user]
    res.send({
        avatars: users.map((obj)=>{return {
            username: obj, avatar:"http://z9x9.com/wp-content/uploads/2016/04/6488895.jpg"
        }})
    })
}

const updateAvatar = (req,res) => {
    if(!req.user) req.user = "pl26test"
    profile[req.user].avatar = req.body.image
    res.send({username:req.user,avatar:"http://z9x9.com/wp-content/uploads/2016/04/6488895.jpg"})
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
     app.put('/avatar', isLoggedIn,updateAvatar)
     app.put('/password',isLoggedIn,updatePwd)
}