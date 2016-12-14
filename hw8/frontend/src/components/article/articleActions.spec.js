import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'

let resource, articleActions, url

describe('test for articleActions ', () => {

    beforeEach(() => {
        if (mockery.enable) {
            mockery.enable({warnOnUnregistered: false, useCleanCache:true})
            mockery.registerMock('node-fetch', fetch)
            require('node-fetch')
            url = require('../../actions').apiUrl
            resource = require('../../actions').resource
            articleActions = require('./articleActions')
        }
    })

    afterEach(() => {
        if (mockery.enable) {
            mockery.deregisterMock('node-fetch')
            mockery.disable()
        } 
    })  


    it('should fetch articles (mocked request)', (done)=>{
        let state = {articles : {avatars:{}}}

        mock(`${url}/articles`,{
            method:'GET',
            headers: {'Content-Type':'application/json'},
            json: { articles: [{_id: 1, author: 'pl26test', comments: [] }]}
        })

        articleActions.fetchArticles()(
            action =>{
                expect(action).to.satisfy((action)=>{
                    return action.type=='UPDATE_ARTICLES' && action.articles['1'].author == 'pl26test'
                })
                
            }
            ,
            ()=>{return state}
        )
        done()
    })

    it('should update the search keyword', ()=>{
        const keyword = 'keyword'
        expect(articleActions.searchKeyword(keyword)).to.eql({type:'SEARCH_KEYWORD',keyword})
        
    })



})
