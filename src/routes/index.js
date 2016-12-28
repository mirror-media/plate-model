import App from '../containers/App'
import Author from '../containers/Author'
import Category from '../containers/Category'
import Home from '../containers/Home'
import Questionnaire from '../containers/Questionnaire'
import React from 'react'
import Search from '../containers/Search'
import Section from '../containers/Section'
import Tag from '../containers/Tag'
import Timeline from '../containers/Timeline'
import Topic from '../containers/Topic'

import { browserHistory, IndexRoute, Route, Router } from 'react-router'

export default function (history = browserHistory) {
  return (
    <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="author/:authorId" component={Author}/>
        <Route path="category/:category" component={Category}/>
        <Route path="search/:keyword" component={Search} />
        <Route path="section/:section" component={Section}/>
        <Route path="tag/:tagId" component={Tag} />
        <Route path="topic/:topicId" component={Topic} />
        <Route path="timeline" component={Timeline}/>
        <Route path="q/:questionnaireId(/:resultIdForOg)" component={Questionnaire} />
      </Route>
    </Router>
  )
}
