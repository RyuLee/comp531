import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { updateProfile } from './profileActions'

class ProfileForm extends Component {

    componentDidUpdate() {
        if (this.props.error.length == 0) {
            this.email.value = null
            this.zipcode.value = null
            this.password.value = null
            this.pwconf.value = null
        }
    }

    render() { return (
        <div className="center-form-profile">
            <h5>Update Profile</h5>
            <form onSubmit={(e) => {
                e.preventDefault()
                const payload = {
                    email:this.email.value,
                    zipcode:this.zipcode.value,
                    password:this.password.value,
                    pwconf:this.pwconf.value
                }
                this.props.dispatch(updateProfile(payload))
            }}>

                <div className="row">
                    <div className="input-field col s6">
                        Email Address:
                        <input type="email" id="email" placeholder={this.props.oldEmail}  ref={(node)=>this.email = node}></input>
                    </div>
                     <div className="input-field col s6">
                        Zip Code(Five digits):
                        <input type="number" id="zip" pattern="^\d{5}$" placeholder={this.props.oldZipcode}  ref={(node)=>this.zipcode = node}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        Password:(The length should be from 5 to 12.)
                        <input type="password" id="password" pattern="^\w{5,12}$"  ref={(node)=>this.password = node}></input>
                    </div>
                    <div className="input-field col s6">
                        Password Confirmation:
                        <input type="password" id="confirmation" pattern="^\w{5,12}$"  ref={(node)=>this.pwconf = node}></input>
                    </div>
                </div>
                <div className="row">
                    <div>
                        <input id="in2" type="hidden" id="tstamp" value="default"></input>
                    </div>
                    <div style={{margin:'30px'}}>
                        <input type="submit" id="submit" className="waves-effect waves-light btn" name="submit" value="Submit"></input>
                        &nbsp;
                        <input type="reset" id="reset" className="waves-effect waves-light btn" name="clear" value="Clear"></input>
                    </div>
                </div>
            </form>
        </div>
    )}
}

ProfileForm.propTypes = {
    error: PropTypes.string.isRequired,
    oldZipcode: PropTypes.number.isRequired,
    oldEmail: PropTypes.string.isRequired,
    oldPhone: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(
    (state) => {
        return {
            error: state.common.error,
            oldZipcode: state.profile.zipcode,
            oldEmail: state.profile.email,
            oldPhone: state.profile.phone
        }
    }
)(ProfileForm)

export { ProfileForm as PureProfileForm }
