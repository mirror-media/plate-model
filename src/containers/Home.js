/*eslint no-unused-vars:0, no-console:0 */
/* global __DEVELOPMENT__ */
'use strict'
import { HOME, CATEGORY, SITE_NAME, SITE_META } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded } from '../actions/articles'
import { setPageType } from '../actions/header'
import _ from 'lodash'

import LatestSections from '../components/LatestSections'
import Choices from '../components/Choices'
import LatestArticles from '../components/LatestArticles'

import Tags from '../components/Tags'
import DocumentMeta from 'react-document-meta'
import Features from '../components/Features'
import Footer from '../components/Footer'
import React, { Component } from 'react'
import SystemError from '../components/SystemError'
import TopNews from '../components/TopNews'
import async from 'async'
import { devCatListId, prodCatListId } from '../conf/list-id'

const MAXRESULT = 10
const PAGE = 1

if (process.env.BROWSER) {
  require('./Home.css')
}

class Home extends Component {
  static fetchData({ params, store }) {
    return store.dispatch(fetchIndexArticles()) 
  }

  constructor(props, context) {
    super(props, context)
    this.loadMoreArticles = this._loadMoreArticles.bind(this, this.specialTopicListId)
  }

  componentDidMount() {
    this.props.setPageType(HOME)
  }

  componentWillMount() {
    const { fetchArticlesByUuidIfNeeded, fetchIndexArticles } = this.props
    const { articlesByUuids, entities, sectionsFeatured, choices, latestPosts } = this.props
    let params = {
      page: PAGE,
      max_results: MAXRESULT
    }
    fetchIndexArticles()
    if (sectionsFeatured.isFetching == true || choices.isFetching == true || latestPosts.isfetching == true) {
      fetchIndexArticles()
    }
  }

  _loadMoreArticles(catId) {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded } = this.props

    if (_.get(articlesByUuids, [ catId, 'hasMore' ]) === false) {
      return
    }

    let itemSize = _.get(articlesByUuids, [ catId, 'items', 'length' ], 0)
    let page = Math.floor(itemSize / MAXRESULT) + 1
    fetchArticlesByUuidIfNeeded(catId, CATEGORY, {
      page: page,
      max_results: MAXRESULT
    })
  }

  render() {
    const { device } = this.context
    const { articlesByUuids, entities, sectionsFeatured, choices, latestPosts } = this.props
    const topnews_num = 5
    let sections = sectionsFeatured
    let choicesPosts = _.filter(entities.articles, (v,k)=>{ return _.indexOf(choices.items, k) > -1 })
    let posts = _.filter(entities.articles, (v,k)=>{ return _.indexOf(latestPosts.items, k) > -1 })
    
    const meta = {
      title: SITE_NAME.FULL,
      description: SITE_META.DESC,
      canonical: SITE_META.URL,
      meta: { property: {} },
      auto: { ograph: true }
    }
    // console.log(articlesByUuids)
    // console.log(entities)
    // console.log(indexArticles)
    // console.log(_.values(posts))
    if (posts) {
      return (
        <DocumentMeta {...meta}>
          
          <LatestSections sections={sections} entities={entities} device={device}/>

          <Choices articles={choicesPosts} device={device} />

          <LatestArticles articles={posts} device={device} />
          {
            this.props.children
          }
          <Footer />
        </DocumentMeta>
      )
    } else {
      return ( <SystemError /> )
    }
  }
}

function mapStateToProps(state) {
  return {
    articlesByUuids: state.articlesByUuids || {},
    entities: state.entities || {},
    indexArticles: state.indexArticles || {},
    choices: state.choices || {},
    latestPosts: state.latestPosts || {},
    sectionsFeatured: state.sectionsFeatured || {}
  }
}

Home.contextTypes = {
  device: React.PropTypes.string
}

export { Home }

export default connect(mapStateToProps, {
  fetchArticlesByUuidIfNeeded,
  fetchIndexArticles,
  setPageType
})(Home)
