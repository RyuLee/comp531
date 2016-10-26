import React from 'react'

import Headline from './headline'
import Following from './following'
import ArticlesView from '../article/articlesView'

const Main = () => (
    // This is the main view.
    // On this view we display the user's avatar, their headline,
    // their feed of articles (with a search fiilter),
    // and their list of followers.
    <div className="row">
        <div className="col s12 m6 l3 side-img">
            <Headline/>
            <Following/>
        </div>
        
        <ArticlesView/>
    </div>
)

export default Main
