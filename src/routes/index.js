import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from '../containers/App'
import Category from '../containers/Category'
import Home from '../containers/Home'
import HomeB from '../containers/HomeB'
import Section from '../containers/Section'
import Tag from '../containers/Tag'
import Search from '../containers/Search'

export default function (history = browserHistory) {
  return (
    <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="HomeB" component={HomeB}/>
        <Route path="section/:section" component={Section}/>
        <Route path="category/:category" component={Category}/>
        <Route path="tag/:tagId" component={Tag} />
        <Route path="search/:keyword" component={Search} />
      </Route>
    </Router>
  )
}
