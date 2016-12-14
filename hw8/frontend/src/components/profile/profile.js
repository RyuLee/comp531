import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ProfileForm from './profileForm'
import Avatar from './avatar'
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const Messages_ = ({error, success}) => (
     <MuiThemeProvider>
    <div >
        { error.length == 0 ? '' :
            
        <Snackbar
          open={true}
          message={error}
          autoHideDuration={4000}
          
        />
        }
        { success.length == 0 ? '' :
            <Snackbar
            open={true}
            message={success}
            autoHideDuration={4000}
            
        />
        }
    </div>
</MuiThemeProvider>
)

Messages_.propTypes = {
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired
}

const Messages = connect(
    (state) => {
        return {
            error: state.common.error,
            success: state.common.success,
        }
    }
)(Messages_)

const Profile = () => {
    return (
        <div>
            <Avatar/>
            <div className="col s6 l4">
                <Messages/>
                <ProfileForm/>
            </div>
        </div>
    )
}
export default Profile
