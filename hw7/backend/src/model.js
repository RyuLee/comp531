const mongoose = require('mongoose')
require('./db.js')
const userSchema = new mongoose.Schema(
    {
    username: String,
    salt: String,
    hash: String    
    }
)

const profileSchema = new mongoose.Schema(
    {
        username: String,
        headline: String,
        following: [ String ],
        email: String,
        zipcode: String,
        avatar: String,
        dob:Date
    }
)

const articleSchema = new mongoose.Schema(
    {
        author: String,
        text: String,
        date: Date,
        img: String,
        avatar: String, 
        comments: [{
            commentId:String,
            author: String,
            text: String,
            date: Date
        }]
    }
)

const commentSchema = new mongoose.Schema({
    commentId:String,
    author:String,
    date:Date,
    text:String
})

exports.User = mongoose.model('users',userSchema)
exports.Profile = mongoose.model('profiles',profileSchema)
exports.Article = mongoose.model('articles',articleSchema)
exports.Comment = mongoose.model('comments',commentSchema)