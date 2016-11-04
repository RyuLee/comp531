var mongoose = require('mongoose')
require('./db.js')

var commentSchema = new mongoose.Schema({
	commentId: Number, author: String, date: Date, text: String
})
var articleSchema = new mongoose.Schema({
	id: Number, author: String, img: String, date: Date, text: String,
	comments: [ commentSchema ]
})

var userSchema = new mongoose.Schema({
	username: String, hash:String, salt:String
})

exports.Article = mongoose.model('article', articleSchema)
