import React from 'react'
import { connect } from 'react-redux'

import { localLogin } from './authActions'

const Login = ({dispatch}) => {
    let username, password
    return (
    <div className="login">
        <h5>Login</h5>
        <div className="row">
            <div className="input-field col s10">
                Account:
                <input id="loginAct" type="text" name="account" pattern="^[a-zA-Z]+.*$" required ref={(node)=>{username = node}}></input>
            </div>
        </div>
        <div className="row">
            <div className="input-field col s10">
                Password:
                <input id="loginPwd" type="password" name="password" pattern="^\w{5,12}$" required ref={(node)=>{password = node}}></input>
            </div>
        </div>
        <div className="row">
            <div className="login-btn">
                <input type="submit" className="waves-effect waves-light btn" name="login" value="Login" 
                onClick={()=>{
                    dispatch(localLogin(username.value,password.value))}}></input>
            </div>
        </div>
    </div>    )
}

export default connect()(Login)
