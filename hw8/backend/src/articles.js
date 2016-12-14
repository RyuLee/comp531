const Article = require('./model.js').Article
const Profile = require('./model.js').Profile
const Comment = require('./model.js').Comment
const isLoggedIn = require('./auth.js').isLoggedIn
const md5 = require('md5')
const uploadImage = require('./uploadCloudinary')
if (!process.env.CLOUDINARY_URL) {
     process.env.CLOUDINARY_URL="cloudinary://594485725374254:9TQYCAM8wreFuPFlm7gSDD_ZDUU@hhykjdqj6"
}

const addArticle = (req,res) => {

    //console.log(req.body)
    var newArticle = {}
    newArticle.text = req.body.text || 'default'
    newArticle.author = req.body.author || req.username
    newArticle.img = req.fileurl
    console.log("fileURL:"+req.fileurl)
    newArticle.date = new Date()
    newArticle.comments = []
    new Article(newArticle).save(()=>{
        //console.log("new article " + req.body["text"] + " saved")
        res.send({
        articles:[newArticle]
    })
    })
}
const editArticle = (req,res) => {
    var commentId = req.body.commentId
    console.log(commentId)
    if(commentId){
        if(commentId === -1){//add new comment
            Article.findOne({_id:req.params.id}).exec((err,item)=>{
                if(err==null&&item!=null){
                    item.comments.push({commentId:md5(new Date().getTime()),author:req.username,date:new Date(),text:req.body.text})
                    item.save((err)=>{
                        //console.log(item)
                        res.send({articles:[item]})
                    })
                }
            })
        }else{
            console.log(req.params.id)
            Article.findOne({_id:req.params.id}).exec((err,item)=>{
                if(err==null&&item!=null){
                    item.comments.forEach((e)=>{
                        if(e.commentId === commentId){
                            e.text = req.body.text
                            e.date = new Date()
                            item.save((err)=>{
                                console.log("comment updated")
                                res.send({articles:[item]})
                            })
                        }
                    })
                }
            })
        }
    }else{
        Article.find({}).exec((err,item)=>{
            if(item!=null&&err==null){
                item.forEach((e)=>{
                    if(e._id === req.params.id){
                        if(e.author !== req.username){
                            res.sendStatus(403)
                        }else{
                            e.text = req.body.text
                            item.save(()=>{
                                console.log("item:"+item._id+" updated!")
                                res.send({articles:[e]})
                            })
                        }
                    }
                })
            }
        })
    }
}

const getArticle = (req,res) => {
    var feed = []
    if(req.params.id){
        Article.find({_id:req.params.id}).exec((err,item)=>{
            if(err==null&&item!=null){
                feed.push(item)
                res.send({articles:feed})
            }
        })
    }else{
        Profile.findOne({username:req.username},(err,item)=>{
            if(err == null && item!= null){
                var usersToQuery = [req.username,...item.following]
                //console.log(usersToQuery)
                const authors = []
                usersToQuery.forEach((e)=>{
                    authors.push({author:e})
                })
                Article.find({"$or":authors}).sort({date:-1}).limit(10).exec((err,item)=>{
                    if(item!=null)
                        item.forEach((e)=>{
                            feed.push(e)
                        })
                    console.log(feed)
                    res.send({articles:feed})
                })
                
            }else
                res.status(204).send({})
        })
    }
}
const getArticleByAuthors = (usersToQuery,limit) => {
    
    return feed
}
module.exports = (app) => {
    app.get('/articles/:id*?',isLoggedIn,getArticle)
    app.post('/article',isLoggedIn,uploadImage('image'),addArticle)
    app.put('/articles/:id',isLoggedIn,editArticle)
}