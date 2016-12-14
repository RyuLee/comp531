import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateHeadline } from '../profile/profileActions'
import { uploadImage } from '../profile/profileActions'
class Headline extends Component {
    componentDidUpdate(oldprops) {
        if (oldprops.img != this.props.img) {
            this.preview = undefined
            this.file = undefined
            this.forceUpdate()
        }
    }

    handleImageChange(e) {
        e.preventDefault()

        let reader = new FileReader();
        reader.onloadend = () => {
            this.preview = reader.result
            this.forceUpdate();
        }

        this.file = e.target.files[0];
        reader.readAsDataURL(this.file)
    }
    render() { return (
        <ul>
        <div>
            <div>
                <a href="#!user"><img className="circle circle-img-user" src={this.props.avatar}></img></a>
                <form action="#">
                    <div className="file-field input-field">
                        <div className="btn h1">
                            <span style={{font_size:'12px'}}>File</span>
                            <input type="file" style={{height:'30px',width:'60px'}} accept="image/*" onChange={(e) => this.handleImageChange(e)}></input>
                            <input style={{height:'30px',width:'60px'}} type="button" value="Upload" onClick={() => { this.props.dispatch(uploadImage(this.file)) }}/>
                        </div>
                    </div>
                </form>
                <a href="#!name"><span className="black-text name h6">{this.props.username}</span></a>
                
            </div>
        </div>
        <div>
            <div style={{height:'150px'}}>
                <div id="activityDisplay" className="h3">{this.props.headline}</div>
                <input id="headline-input" type="text"
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
