import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateHeadline } from '../profile/profileActions'

class Headline extends Component {

    render() { return (
        <ul>
        <div>
            <div>
                <a href="#!user"><img className="circle circle-img-user" src={this.props.avatar}></img></a>
                <form action="#">
                    <div className="file-field input-field">
                        <div className="btn h1">
                            <span style={{font_size:'12px'}}>Upload</span>
                            <input type="file" style={{height:'30px',width:'60px'}}></input>
                        </div>
                    </div>
                </form>
                <a href="#!name"><span className="black-text name h6">{this.props.username}</span></a>
                
            </div>
        </div>
        <div>
            <div style={{height:'150px'}}>
                <div id="activityDisplay" className="h3">{this.props.headline}</div>
                <input id="headline" type="text"
                        placeholder="update your headline"
                        ref={ (node) => { this.newHeadline = node }}
                        onChange={() => this.forceUpdate()} />
                { 
                    !(this.newHeadline && this.newHeadline.value.length > 0) ? '' :
                <input id="updateAct" type="button" className="waves-effect waves-light btn-flat h5" 
                value="Update"
                onClick={() => {
                    console.log(this.newHeadline.value)
                            this.props.dispatch(updateHeadline(this.newHeadline.value))
                            this.newHeadline.value = ''
                        }}/>
                }
            </div>
        </div>
        </ul>

    )}
}
export default connect(
    (state) => {
        return {
            username: state.profile.username,
            headline: state.profile.headline,
            avatar: state.profile.avatar
        }
    }
)(Headline)
