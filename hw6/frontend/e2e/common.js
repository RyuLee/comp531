import { expect } from 'chai'
import { driver,findId, sleep } from './selenium'
const webdriver = require('selenium-webdriver')
// TODO add your test user credentials here!
exports.creds = {
    username: "pl26test",
    password: "at-repeat-ask"
}

exports.login = () =>
    sleep(700)
    .then(findId('username').clear())
    .then(findId('password').clear())
    .then(findId('username').sendKeys(exports.creds.username))
    .then(findId('password').sendKeys(exports.creds.password))
    .then(findId('login').click())
    .then(sleep(2000))

exports.logout = () => 

    sleep(500)
    .then(findId('logout').click())
    .then(sleep(500))
    .then(expect(findId('login')).to.be.ok)
    .then(sleep(500))
