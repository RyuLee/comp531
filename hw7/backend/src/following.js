const Profile = require('./model.js').Profile
const User = require('./model.js').User
const isLoggedIn = require('./auth.js').isLoggedIn
const getFollowing = (req, res) =>{
    if(req.params.user){
        Profile.findOne({username:req.params.user}).exec((err,profile)=>{
            if(err==null&&profile!=null){
                res.send({username:profile.username,following:profile.following})
            }
        })
    }else{
        Profile.findOne({username:req.body.username}).exec((err,item)=>{
        if(err==null&&item!=null){
            res.send({username:item.username,following:item.following})
        }else{
            res.status(204).send({})
        }
    })
    }

}

const putFollowing = (req, res) =>{
    if(req.params.user){
        Profile.findOne({username:req.body.username}).exec((err,profile)=>{
            if(err==null&&profile!=null){
                profile.following.push(req.params.user)
                profile.save(()=>{
                    res.send({username:profile.username,following:profile.following})
                })         
            }else{
                res.status(204).send({})        
            }
        })
    }else{
        res.status(400).send("please specify the user")
    }
}

const deleteFollowing = (req, res)=>{
    if(!req.params.user){
        res.status(400).send("please specify a username")
        return
    }
    Profile.findOne({username:req.body.username}).exec((err,item)=>{
        if(err==null&&item!=null){
            var idx = item.following.indexOf(req.params.user)
            if(idx===-1){
                res.send({username:item.username,following:item.following})
            }else{
                item.following.splice(idx,idx+1)
                item.save((err)=>{
                    if(!err){
                        console.log("follower deleted!")
                        res.send({username:item.username,following:item.following})
                    }
                })
            }
        }
    })
}

module.exports = app => {

    app.get('/following/:user?', isLoggedIn,getFollowing)
    app.put('/following/:user', isLoggedIn,putFollowing)
    app.delete('/following/:user', isLoggedIn,deleteFollowing)
}