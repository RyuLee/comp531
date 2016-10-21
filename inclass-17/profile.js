
const index = (req, res) => {
     res.send({ hello: 'world' })
}
const putHeadline = (req, res) => {
	res.send({headlines:[{
		username:'Pengyu Li',
		headline:req.body["headline"]||'you did not suply it'
	}]})
}

const putEmail = (req,res) => {
	res.send({emails:[{
		username:'Pengyu Li',
		email:req.body["email"]||'you did not suply it'

	}]})
}
const putZipcode = (req,res) => {
	res.send({zipcodes:[{
		username:'Pengyu Li',
		zipcode:req.body["zipcode"]||'you did not suply it'

	}]})
}
const putAvatar = (req,res) => {
	res.send({avata:[{
		username:'Pengyu Li',
		avatar:req.body["avatar"]||'you did not suply it'

	}]})
}

module.exports = app => {
     app.get('/:user?', index)
     app.put('/headline',putHeadline)
     app.put('/email',putEmail)
     app.put('/zipcode',putZipcode)
     app.put('/avatar',putAvatar)
}
