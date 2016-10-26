/*
 * Test suite for articles.js
 */
const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

var articles = {articles:[
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
describe('Validate Article functionality', () => {

	it('should give me three or more articles', (done) => {
		// IMPLEMENT ME
		fetch(url('/articles'))
		.then(res => {
			
			expect(res.status).to.eql(200)
			return res.text()
		})
		.then(body=>{
			expect(body["articles"]).to.deep.eql(articles["articles"])
		})
		.then(done())
		
 	}, 200)

	it('should add two articles with successive article ids, and return the article each time', (done) => {
		
		fetch(
			url('/article'),{
			method: "POST",
  			headers: {
    		"Content-Type": "application/json"
		}})// add a new article
		.then(res => {
			
			expect(res.status).to.eql(200)
			return res.text()
		})
		.then(body => {
			var x = JSON.parse(body)
			expect(x.id).to.eql(articles["articles"].length+1)
		})
		.then(()=>{articles["articles"].push({id:articles["articles"].length + 1,
			author:"Pengyu Li",text:"This is Pengyu Li's article!"})})
		.then(()=> {return fetch(url('/articles'))})
		.then(res => {
			
			expect(res.status).to.eql(200)
			return res.text()
		})
		.then(body=>{
			expect(body).to.eql(articles)
		})

		.then(()=> {return fetch(
			url('/article'),{
			method: "POST",
  			headers: {
    		"Content-Type": "application/json"
		}})})// add a new article
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()
		})
		.then(body => {
			var x = JSON.parse(body)
			expect(x.id).to.eql(articles["articles"].length+1)
		})

		.then(()=>{articles["articles"].push({id:articles["articles"].length + 1,
			author:"Pengyu Li",text:"This is Pengyu Li's article!"})})

		.then(()=> {return fetch(url('/articles'))})
		.then(res => {
			
			expect(res.status).to.eql(200)
			return res.text()
		})
		.then(body=>{
			expect(body).to.eql(articles)
		})
		.then(done())
 	}, 200)

	it('should return an article with a specified id', (done) => {
		// call GET /articles first to find an id, perhaps one at random
		// then call GET /articles/id with the chosen id
		// validate that only one article is returned
		fetch(url('/articles'))
		.then(res => {
			expect(res.status).to.eql(200)
			return res.text()
		})
		.then((body)=>{return JSON.parse(body)["articles"][0].id})
		.then((id)=>{
			return fetch(url('/articles/${id}'))
		})
		.then(res => {
			
			expect(res.status).to.eql(200)
			return res.text()
		})
		.then(body=>{
			expect(JSON.parse(body).length).to.eql(1)
		})
		.then(done())
	}, 200)

	it('should return nothing for an invalid id', (done) => {
		// call GET /articles/id where id is not a valid article id, perhaps 0
		// confirm that you get no results
		fetch(url('/articles/1000'))
		.then(res => {
			expect(res.status).to.eql(200)
			return res.text()
		})
		.then(body=>{
			expect(JSON.parse(body).length).to.eql(0)
		})
		.then(done())
	}, 200)
	
});