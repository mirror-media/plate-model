import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from '../containers/App'
import Article from '../containers/Article'
import Category from '../containers/Category'
import Home from '../containers/Home'
import Section from '../containers/Section'
import Tag from '../containers/Tag'

export default function (history = browserHistory) {
  return (
    <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="section/:section" component={Section}/>
        <Route path="category/:category" component={Category}/>
        <Route path="tag/:tagId" component={Tag} />
        <Route path="article/:slug" component={Article}/>
      </Route>
    </Router>
  )
}
