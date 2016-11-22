import Action, { resource, updateError, updateSuccess, navToMain, navToOut} from '../../actions'

import { fetchFollowers } from '../main/followingActions'
import { fetchArticles } from '../article/articleActions'
import { fetchProfile, validateProfile } from '../profile/profileActions'

export function initialVisit() {
    return (dispatch) => {
        resource('GET', 'headlines').then((response) => {
            dispatch(navToMain())
            dispatch({type: Action.UPDATE_HEADLINE,
                username: response.headlines[0].username,
                headline: response.headlines[0].headline
            })
            dispatch(fetchProfile())
            dispatch(fetchFollowers())
            dispatch(fetchArticles())
        }).catch((err) => {
            
        })
    }
}

export function localLogin(username, password) {
    return (dispatch) => {
        resource('POST', 'login', { username, password })
        .then((response) => {
            dispatch({type: Action.LOGIN_LOCAL, username: response.username})
            dispatch(initialVisit())
        }).catch((err) => {
            dispatch(updateError(`Error appears when logging in as ${username}`))
        })
    }
}

export function logout() {
    return (dispatch) => {
        resource('PUT', 'logout')
        .then(dispatch({type:'NAV_OUT'}))
        .catch((err) => {
            dispatch({type: Action.LOGIN_LOCAL, username: undefined})
            dispatch(navToOut())
        })
    }
}

export function register({username, email, phone, bday, zipcode, password, pwconf}) {
    return (dispatch) => {
        const err = validateProfile({username, email, phone, bday, zipcode, password, pwconf})
        console.log(err)
        if (err.length > 0) {
            return dispatch(updateError(err))
        }
        console.log({username, email, phone, bday, zipcode, password})
        resource('POST', 'register', {username, email, phone, bday, zipcode, password})
        .then((response) => {
            return dispatch(updateSuccess(`Success for registering!  You can now log in as "${response.username}".`))
        }).catch((err) => {
           return dispatch(updateError("Error for registering, username may be already taken?"))
       })
    }
}