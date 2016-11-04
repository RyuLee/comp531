const md5 = require('md5')

const password = 'SamplePassword123'

const salt = md5('11/03/2016')

const Users = {
    'qw12':{
        username: 'qw12',
        hash: (md5(password + salt)),
        salt: salt
    }
}


const addUser = (username, password) => {
    const newSalt = md5((new Date()).getTime())
    Users[username] = {username, hash: md5(password + newSalt), salt: newSalt}
}

const postRegister = (req, res) => {
    if (!req.body.username || !req.body.password){
        res.status(400).send('username and password should be supplied')
        return
    }

    if (Users[req.body.username]){
        res.status(400).send('user already exists')
        return
    }

    addUser(req.body.username, req.body.password)

    res.send({
        username: Users[req.body.username].username,
        status: 'success'
    })
}

const postLogin = (req, res) => {
    if (!req.body.username || !req.body.password){
        res.status(401).send('Unauthorized')
        return
    }

    const userObj = Users[req.body.username]

    if (userObj && md5(req.body.password + userObj.salt) == userObj.hash){
        res.send({username:userObj.username, status:'success'})
    }
    else{
        res.status(401).send('Unauthorized')
        return
    }
}


module.exports = app => {
    app.post('/login', postLogin)
    app.post('/register', postRegister)
}