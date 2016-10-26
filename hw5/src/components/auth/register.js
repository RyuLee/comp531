import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { register } from './authActions'

class Register extends Component {

    componentDidUpdate() {
        if (this.props.error.length == 0) {
            this.email.value = null
            this.dispname.value = null
            this.phone.value = null
            this.bday.value = null
            this.zipcode.value = null
            this.password.value = null
            this.pwconf.value = null
        }
    }

    render() { return (
<div className="center-form">
            <h5>Register</h5>
            <form onSubmit={(e) => {
                e.preventDefault()
                const payload = {
                    username:this.username.value,
                    dispname:this.dispname.value,
                    phone:this.phone.value,
                    email:this.email.value,
                    bday:this.bday.value,
                    zipcode:this.zipcode.value,
                    password:this.password.value,
                    pwconf:this.pwconf.value
                }
                this.props.dispatch(register(payload))
            }}>
                <div className="row">
                    <div className="input-field col s6">
                        Account Name:
                        <input type="text" name="account" placeholder="ABC123" pattern="^[a-zA-Z]+.*$" required ref={(node)=>this.username = node}></input>
                    </div>
                    <div className="input-field col s6">
                        Display Name(Optional):
                        <input type="text" name="name" placeholder="xxx" ref={(node)=>this.dispname = node}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        Email Address:
                        <input type="email" name="email" placeholder="abc@abc.com" required ref={(node)=>this.email = node}></input>
                    </div>
                    <div className="input-field col s6">
                        Phone:
                        <input type="tel" name="phone" pattern="^\d{3}-\d{3}-\d{4}$" placeholder="123-123-1234" 
                        required ref={(node)=>this.phone = node}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        Birthday:
                        <input id="in1" type="date" name="bday" required ref={(node)=>this.bday = node}></input>
                    </div>
                    <div className="input-field col s6">
                        Zip Code(Five digits):
                        <input type="number" name="zip" pattern="^\d{5}$" placeholder="00000" required ref={(node)=>this.zipcode = node}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        Password:(The length should be from 5 to 12.)
                        <input type="password" name="password" pattern="^\w{5,12}$" required ref={(node)=>this.password = node}></input>
                    </div>
                    <div className="input-field col s6">
                        Password Confirmation:
                        <input type="password" name="confirmation" pattern="^\w{5,12}$" required ref={(node)=>this.pwconf = node}></input>
                    </div>
                </div>
                <div className="row">
                    <div>
                        <input id="in2" type="hidden" name="tstamp" value="default"></input>
                    </div>
                    <div style={{margin:'30px'}}>
                        <input type="submit" className="waves-effect waves-light btn" name="submit" value="Submit"></input>
                        &nbsp;
                        <input type="reset" className="waves-effect waves-light btn" name="clear" value="Clear"></input>
                    </div>
                </div>
            </form>
        </div>
    )}
}

export default connect()(Register)