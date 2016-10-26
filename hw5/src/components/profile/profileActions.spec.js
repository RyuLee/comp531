import {expect} from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'
import apiUrl from '../../actions'
import * as profileActions from './profileActions'

let Action, actions
beforeEach(() => {
  if (mockery.enable) {
	mockery.enable({warnOnUnregistered: false, useCleanCache:true})
	mockery.registerMock('node-fetch', fetch)
	require('node-fetch')
  }
  Action = require('../../actions').default
  actions = require('../../actions')
})

afterEach(() => {
  if (mockery.enable) {
	mockery.deregisterMock('node-fetch')
	mockery.disable()
  }
})
describe('Validate profile actions', () => {
it('should update the status message', (done) => {
  
  // the result from the mocked AJAX call
  const username = 'pl26test'
  const headline = 'A new headline!'

  mock(`${apiUrl}/headline`, {
  	method: 'PUT',
  	headers: {'Content-Type':'application/json'},
  	json: { username, headline }
  })
  profileActions.updateHeadline('does not matter')(
    fn => fn(action => {
    expect(action).to.eql({ 
      headline, type: actions.UPDATE_PROFILE
    })
    }))
done()
  
})
it('should update the profile', (done) => {
  
  // the result from the mocked AJAX call
  const username = 'pl26test'
  
    const email = "ryulee2014@gmail.com"
    

  mock(`${apiUrl}/email`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    json: { username, email }
  })
  
  profileActions.updateProfile({email})(
    fn => fn(action => {
    expect(action).to.eql({ 
      email, type: actions.UPDATE_PROFILE
    })
    }))
done()
  
})
it('should fetch the profile', (done) => {
  
  // the result from the mocked AJAX call
  const username = 'pl26test'
    

  mock(`${apiUrl}/email`, {
    method: 'GET',
    headers: {'Content-Type':'application/json'}
  })
  
  profileActions.fetchProfile()(
    fn => fn(action => {
    expect(action).to.eql({ 
      type: actions.UPDATE_PROFILE
    })
    }))
done()
  
})
})