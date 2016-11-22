import React from 'react'
import { connect } from 'react-redux'
import { navToMain, navToProfile } from '../../actions'
import { logout } from '../auth/authActions'
import {Navbar,NavItem,Nav} from 'react-materialize'

const Nav2 = ({username, onProfile, dispatch}) => (
  
    <Navbar brand='RiceBook' right style={{position:'relative'}}>

      {username.length == 0?'':
      <div>
      { onProfile ? <NavItem  id="home" href="#" onClick={() => { dispatch(navToMain()) }}>Home</NavItem>
      :<NavItem  id="profile" href="#" onClick={() => { dispatch(navToProfile()) }}>Edit Your Profile</NavItem>
      }
      <NavItem  href="#" id="logout" onClick={() => { dispatch(logout()) }}>Log out {username} </NavItem>
    </div>}
    
    </Navbar>
    
)

export default connect(
  (state) => {
    return {
      username: state.profile.username || '',
      onProfile: state.common.location == 'profile' }
  })(Nav2)
