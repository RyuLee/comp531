import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Login from './login'
import Register from './register'
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
let ErrorMessage = ({error, success, baropen }) => (
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
ErrorMessage.propTypes = {
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired,
}
ErrorMessage = connect((state) => {
    return { error: state.common.error, success: state.common.success }
})(ErrorMessage)

const Landing = ({isRegister}) => (
        
        <div>
         <Login/>
         <Register/>
         <ErrorMessage/>
        </div>
)

export default Landing

