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

describe('Validate the function of profile.js',()=>{
    it('should get certain user\'s headline',done=>{
        const username = 'pl26'
        const headline = 'This is my headline!'
        resource('GET','headlines/'+username)
        .then(r=>{
            expect(r.headlines[0].headline).to.eql(headline)
        })
        .then(done).catch(done)
    })
    it('should update certain user\'s headline',done=>{
        const headline = 'This is new headline!'
        resource('PUT','headline',{headline})
        .then(r=>{
            expect(r.headline).to.eql(headline)
        })
        .then(done).catch(done)
    })
})