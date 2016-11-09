import { expect } from 'chai'
import { driver,maximize, go, sleep, findId, findCSS, By  } from './selenium'
import common from './common'
const webdriver = require('selenium-webdriver')

describe('End to end testing',()=>{
    before('should login', (done)=>{
        maximize().then(go()).then(common.login).then(done)
    })

    it('should get the main page', (done) => {
        sleep(500)
        .then(expect(findId('main')).to.be.ok)
        .then(done)
    })

    it('should post a new article', (done)=>{
        let len = 0
        let article = "test article"
        sleep(500)
        .then(findId('articles').findElements(webdriver.By.name('article')).then(
            (children)=>{
                expect(children.length).to.be.at.least(1)
                len = children.length
            }
        ))
        .then(findId('post').clear())
        .then(findId('post').sendKeys(article))
        .then(findId('post-btn').click())
        .then(sleep(500))
        .then(findId('articles').findElements(webdriver.By.name('article')).then(
            (children)=>{
                expect(children.length).to.be.eql(originalLength+1)
            }
        ))
        .then(sleep(500))
        .then(done)
    })


        

    it('should update the headline', (done)=>{
        let headline = 'Test Account'
        let newheadline = 'new headline for test'
        sleep(500)
        .then(findId('activityDisplay').getInnerHtml().then(
            text=>{
                expect(text).to.be.eql(originalHeadline)
            }
        ))
        .then(findId('headline-input').clear())
        .then(findId('headline-input').sendKeys(newheadline))
        .then(findId('updateAct').click())
        .then(sleep(500))
        .then(findId('activityDisplay').getInnerHtml().then(
            text=>{
                expect(text).to.be.eql(newheadline)
            }
        ))
        .then(findId('headline-input').clear())
        .then(findId('headline-input').sendKeys(headline))
        .then(findId('updateAct').click())
        .then(sleep(500))
        .then(findId('activityDisplay').getInnerHtml().then(
            text=>{
                expect(text).to.be.eql(headline)
            }
        ))
        .then(sleep(500))
        .then(done)
    })


    it('should search by keyword', (done)=>{
        let keyword = ''

        sleep(500)
        .then(findId('articles').findElements(webdriver.By.name('article')).then(
            (children)=>{
                expect(children.length).to.be.at.least(2)
            }
        ))
        .then(findId('search').clear())
        .then(findId('search').sendKeys(keyword))
        .then(sleep(500))
        .then(findId('articles').findElements(webdriver.By.name('article')).then(
            (children)=>{
                expect(children.length).to.be.eql(1)
            }
        ))
        .then(findId('search').clear())
        .then(sleep(500))
        .then(done)
    })

    it('should add/remove a follower', (done)=>{
        let originalLength = 0
        let follower = 'Follower'
        sleep(500)
        .then(findId('followers').findElements(webdriver.By.className('collection-item')).then(
            (followers)=>{
                originalLength = followers.length
                expect(followers.length).to.be.at.least(1)
            }
        ))
        .then(findId('inputFollow').clear())
        .then(findId('inputFollow').sendKeys(follower))
        .then(driver.executeScript('$(`side-nav`).scrollTop(500)'))
        .then(sleep(1000))
        .then(findId('btn-follow').click())
        .then(sleep(500))
        .then(findId('followers').findElements(webdriver.By.className('follower-item')).then(
            (followers)=>{
                expect(followers.length).to.be.eql(originalLength+1)
            }
        ))
        .then(findId('followers').findElements(webdriver.By.className('follower-item')).then(
            (elements) => {
                let newarr = elements.filter((element)=>{
                    return element.findElements(webdriver.By.className('follower-headline')).then(
                        (spans)=>{
                            const span = spans[0]
                            span.getInnerHtml().then(text=>{
                                return text == follower
                            })
                        }
                    )
                })
                console.log('array size: ' + newarr.length)
                const toremove = newarr[0]

                toremove.findElements(webdriver.By.className('btn-flat waves-effect waves-light')).then((btns)=>{
                    const btn = btns[0]
                    btn.click()
                })
            }
        ))
        .then(sleep(2000))
        .then(findId('followers').findElements(webdriver.By.className('follower-item')).then(
            (followers)=>{
                expect(followers.length).to.be.eql(originalLength)
            }
        ))
        .then(done)

    })

    it('should navigate to profile', (done)=>{
        sleep(500)
        .then(findId('profile').click())
        .then(sleep(500))
        .then(expect(findId('home')).to.be.ok)
        .then(done)
    })

    it('should update profile - email', (done)=>{

        const oldemail = 'pl26test@rice.edu'
        const newemail = 'a@b.c'
        sleep(500)
        
        .then(findId('email').clear())
        .then(findId('email').sendKeys(newemail))
        .then(findId('submit').click())
        .then(sleep(2000))
        .then(findId('email').then(ele=>{
            expect(ele.placeholder).to.eql(newemail)
        }))
        .then(findId('email').clear())
        .then(findId('email').sendKeys(oldemail))
        .then(findId('submit').click())
        .then(sleep(500))
        .then(findId('email').getAttribute('placeholder').then(text=>{
            expect(text).to.eql(newemail)
        }))
        .then(done)
    })

    it('should update profile - zipcode', (done)=>{

        const oldzip = '77005'
        const newzip = '10000'
        sleep(500)
        
        .then(findId('zip').clear())
        .then(findId('zip').sendKeys(newzip))
        .then(findId('submit').click())
        .then(sleep(2000))
        .then(findId('zip').getAttribute('placeholder').then(text=>{
            expect(text).to.eql(newzip)
        }))
        .then(findId('zipcode').clear())
        .then(findId('zipcode').sendKeys(oldzip))
        .then(findId('submit').click())
        .then(sleep(500))
        .then(findId('zip').getAttribute('placeholder').then(text=>{
            expect(text).to.eql(oldzip)
        }))
        .then(done)
    })


    it('should update profile - password', (done)=>{
        const pass = "password"
        sleep(500)
        .then(findId('password').clear())
        .then(findId('confirmation').clear())
        .then(findId('password').sendKeys(pass))
        .then(findId('confirmation').sendKeys(pass))
        .then(findId('submit').click())
        .then(sleep(100))
        .then(sleep(500))
        .then(done)
    })

    it('should navigate to home', (done)=>{
        sleep(500)
        .then(findId('home').click())
        .then(sleep(500))
        .then(expect(findId('logout')).to.be.ok)
        .then(done)
    })

    after('should log out', (done)=>{
        common.logout().then(done)
    })
})