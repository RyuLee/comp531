import { expect } from 'chai'
import { go, sleep, findId, findCSS, By } from './selenium'
import common from './common'

describe('Test registration', ()=>{

    before('should load the page', (done)=>{
        go().then(done)
    })


    it('should finish registration', (done) => {
        sleep(500)
        .then(findId('account').sendKeys('abc11111'))
        .then(findId('email').sendKeys('a@b.c'))
        .then(findId('bday').sendKeys('11111992'))
        .then(findId('zip').sendKeys('00000'))
        .then(findId('password').sendKeys('a123456'))
        .then(findId('confirmation').sendKeys('a123456'))
        .then(findId('submit').click())
        .then(sleep(500))
        .then(sleep(500))
        .then(done)
    })
})