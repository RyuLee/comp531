
const express = require('express')
const bodyParser = require('body-parser')

var article = {articles:[
	{
		id: 1,
		author: "Scott",
		text: "This is scott's article!"
	},
	{
		id:2,
		author: "Max",
		text: "This is max's article!"
	},
	{
		id:3,
		author: "Alex",
		text:"This is alex's article!"
	}
]}

const addArticle = (req, res) => {
     console.log('Payload received', req.body) 
     article["articles"].push({id:article["articles"].length + 1,author:"Pengyu Li",text:req.body["body"]});   
     res.send(req.body)
     return article["articles"].length;
}
const getArticle = (req,res) =>{
	console.log('Payload received')
	res.send(article)
}
const hello = (req, res) => res.send({ hello: 'world' })

const app = express()
app.use(bodyParser.json())
app.post('/article', addArticle)
app.get('/articles',getArticle)
app.get('/', hello)

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})