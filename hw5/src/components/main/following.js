import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { addFollower, delFollower, dispatch } from './followingActions'

const Follower = ({name, avatar, headline, dispatch}) => (
    <div>
    <div className="divider"></div>
    <a><img className="circle circle-img" 
     src={avatar}></img><span>&nbsp;{name}&nbsp;</span></a>
    <span>{headline}</span><br></br><button className="btn-flat waves-effect waves-light" 
    style={{position:'relative'}} onClick={() => { dispatch(delFollower(name)) }}>Unfollow</button>
    </div>
)

Follower.propTypes = {
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    headline: PropTypes.string,
    dispatch: PropTypes.func.isRequired
}

class Following extends Component {
    render() { return (
        <div>
            <li><a className="subheader">Social Network</a></li>
            <li>
                <div><i className="material-icons">perm_identity</i>Friends</div>
                <input style={{position: 'relative',left: '20px',width: '40%'}} type="text" placeholder="Add Firends"
                ref={(node) => this.newFollower = node }
                        onChange={(e) => {
                            this.forceUpdate()
                        }}/>
                    { !(this.newFollower && this.newFollower.value && this.newFollower.value.length > 0) ? '' :
                    <input className="btn-flat waves-effect waves-light" type="button"
                        onClick={() => {
                            this.props.dispatch(addFollower(this.newFollower.value))
                            this.newFollower.value = ''
                            this.forceUpdate()
                        }}
                        value="add follower"/>
                }
                { this.props.error.length == 0 ? '' :
                    <div className="alert alert-danger">
                        { this.props.error }
                    </div>
                }
                { Object.keys(this.props.followers).sort().map((f) => this.props.followers[f]).map((follower) =>
                    <Follower key={follower.name}
                        name={follower.name} avatar={follower.avatar} headline={follower.headline}
                        dispatch={this.props.dispatch} />
                )}
            </li>
            </div>
                

                
    )}
}

Following.propTypes = {
    error: PropTypes.string.isRequired,
    followers: PropTypes.object.isRequired
}

export default connect(
    (state) => {
        return {
            error: state.common.error,
            followers: state.followers.followers
        }
    }
)(Following)
