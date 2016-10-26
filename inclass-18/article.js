
const express = require('express')
const bodyParser = require('body-parser')
const stringfy = require('json-stringify')

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
     article["articles"].push({id:article["articles"].length + 1,author:"Pengyu Li",text:"This is Pengyu Li's article!"});   
     const id = {id:(article["articles"].length + 1).toString()}
     res.send(id)
     return article["articles"].length;
}
const getArticle = (req,res) =>{
	if(req.params.id === undefined)
		res.send(article)
	else if(req.params.id !== undefined){
		res.send(article["articles"].filter((obj)=>{
			if(obj.id == parseInt(req.params.id)) return true;
			else return false;
		}))
	}
}

const hello = (req, res) => res.send({ hello: 'world' })

const app = express()
app.use(bodyParser.json())
app.post('/article', addArticle)
app.get('/articles',getArticle)
app.get('/articles/:id',getArticle)
app.get('/', hello)

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})