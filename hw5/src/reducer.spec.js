import { expect } from 'chai'
import mockery from 'mockery'
import fetch, {mock} from 'mock-fetch'

import Reducer from './reducers'
import {articles} from './reducers'
import {filterFunction} from './components/article/articlesView'

let initialState = {
    common:{error:'', success: '',location: ''},
	articles:{articles:{},searchKeyword:'', avatars: {} },
 	profile: { username: '',headline: '',avatar: '',email: '',zipcode: '',phone:'',bday:''},
 	followers:{ followers: {}}
}


describe('Validate reducer (no fetch requests here)', ()=> {
    it('should clear state when logout', ()=>{
        expect(Reducer(undefined, {type:'NAV_OUT'})).to.eql(initialState)
    })

	it('should return the initial state', ()=>{
        expect(Reducer(undefined, {})).to.eql(initialState)
    })

 	it('should state success (for displaying success message to user)', ()=>{
        const success = 'success'
        expect(Reducer(undefined, {type:'SUCCESS', success}))
        .to.eql({...initialState, common:{...initialState.common, success}})
    })

 	it('should state error (for displaying error message to user)', ()=>{
        const error = 'error'
        expect(Reducer(undefined, {type:'ERROR', error}))
        .to.eql({...initialState, common:{...initialState.common, error}})
    })

 	let articles = {1:{id:1,author:'pl26test', text:'hello1'}, 2:{id:2,author:'Scott', text:'hello2'}}
 	it('should set the articles',()=> {
		expect(Reducer(undefined, {type:'UPDATE_ARTICLES', articles}))
		.to.eql({...initialState, articles: {...initialState.articles, articles}})
	})

   
	let keyword = 'keyword'
    it('should set the search keyword', ()=>{
        expect(Reducer(undefined, {type:'SEARCH_KEYWORD',keyword})).to.eql({...initialState, articles:{...initialState.articles, searchKeyword:keyword}})
    })


    it('should filter displayed articles by the search keyword',()=> {
        let articles = {0:{_id:0, text:'hi', author:'pl26test', date:'2016-10-26'},
                          1:{_id:1, text:'hello', author:'pl26test', date:'2016-10-26'}}
        let keyword = 'hi'
        expect(filterFunction(articles,keyword))
        .to.eql([{_id:0, text:'hi', author:'pl26test', date:'2016-10-26'}]);
    })


})