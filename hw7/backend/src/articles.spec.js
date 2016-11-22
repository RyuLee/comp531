const fetch = require('isomorphic-fetch')
const expect =require('chai').expect

const resource = (method, endpoint, payload) => {
    const url = `http://localhost:3000/${endpoint}`
	const options = { method, headers: { 'Content-Type': 'application/json' }}
	if (payload) options.body = JSON.stringify(payload)
	return fetch(url, options).then(r => {
			if (r.status == 200) {
				return r.json()
			} else {	
				const msg = `ERROR ${method} ${endpoint} returned ${r.status}`
				console.error(msg)
				throw new Error(msg)
			}
		})
}
describe('test for get article',()=>{
    var len = 0
    it('should get at least 3 articles',done=>{
        resource('GET','articles')
        .then(r=>{
            expect(r.articles.length).to.be.at.least(3)
            len = r.articles.length
        })
        .then(done)
        .catch(done)
    })
    it('should add articles',done=>{
        const text = 'test text'
        resource('POST','article',{text})
        .then(r=>{
            expect(r.articles[0].text).to.eql(text)
        })
        .then(done).catch(done)
    })

    it('should get articles with len + 1',done=>{
        resource('GET', 'articles')
        .then(r=>{
            expect(r.articles.length).to.eql(len+1)
        })
        .then(done).catch(done)
    })
})