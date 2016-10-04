/*eslint no-unused-vars:0, no-console:0 */
/* global __DEVELOPMENT__ */
'use strict'
import { HOME, CATEGORY, SITE_NAME, SITE_META, GAID } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, makeSearchQuery, fetchLatestPosts } from '../actions/articles'
import { setPageType } from '../actions/header'
import _ from 'lodash'
import ga from 'react-ga'
import TopChoice from '../components/TopChoice'
import Choices from '../components/Choices'
import LatestSections from '../components/LatestSections'
import LatestArticles from '../components/LatestArticles'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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
  static fetchData({ store }) {
    return store.dispatch(fetchIndexArticles([ 'choices', 'sections', 'posts', 'sectionfeatured' ])) 
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      page: PAGE
    }
    this.loadMore = this._loadMore.bind(this)
  }

  componentDidMount() {
    ga.initialize(GAID, { debug: __DEVELOPMENT__ })
    ga.pageview(this.props.location.pathname)

    this.props.setPageType(HOME)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      ga.pageview(nextProps.location.pathname)
    }
  }

  componentWillMount() {
    const { fetchArticlesByUuidIfNeeded, fetchIndexArticles } = this.props
    const { articlesByUuids, entities, sectionFeatured, sectionList, choices, fetchLatestPosts, latestPosts } = this.props

    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    let checkSectionFeatured = _.get(sectionFeatured, 'fetched', undefined)
    let checkChoices = _.get(choices, 'fetched', undefined)
    let checkLatestPosts = _.get(latestPosts, 'fetched', undefined)
    
    let unfetched = []

    if ( !checkLatestPosts ) unfetched.push('posts')
    if ( !checkSectionList ) unfetched.push('sections')
    if ( !checkChoices ) unfetched.push('choices')
    if ( !checkSectionFeatured) unfetched.push('sectionfeatured')

    if ( unfetched.length != 0 ) {
      this.props.fetchIndexArticles( unfetched )
    }

  }

  _loadMore() {
    const { fetchLatestPosts, latestPosts } = this.props

    let page = this.state.page

    fetchLatestPosts({
      page: page+1,
      max_results: MAXRESULT,
      sort: '-publishedDate'
    })

    this.setState({
      page: page + 1
    })
  }

  render() {
    const { device } = this.context
    const { articlesByUuids, entities, sectionFeatured, sectionList, choices, latestPosts } = this.props

    let sections = sectionFeatured
    // let choicesPosts = _.filter(entities.articles, (v,k)=>{ return _.indexOf(choices.items, k) > -1 })
    let posts = _.filter(entities.articles, (v,k)=>{ return _.indexOf(latestPosts.items, k) > -1 })
    
    let sectionListResponse = _.get(sectionList, 'response', {})

    const meta = {
      title: SITE_NAME.FULL,
      description: SITE_META.DESC,
      canonical: SITE_META.URL,
      meta: { property: {} },
      auto: { ograph: true }
    }

    if (posts) {
      return (
        <DocumentMeta {...meta} >
          <Sidebar sectionList={sectionListResponse} />
          <Header sectionList={sectionListResponse} />

          <div id="main" className="pusher">
            <TopChoice 
              article={ _.get(entities.articles, _.first( _.get(choices, 'items', []) ), {}) } 
              categories={entities.categories}
            />
            <LatestSections 
              sections={sections} 
              entities={entities} 
              sectionList={sectionListResponse}
            />
            <Choices 
              choices={_.get(choices, 'items', [])}
              articles={entities.articles} 
              categories={entities.categories} 
              authors={entities.authors} 
            />
            <LatestArticles 
              articles={posts} 
              categories={entities.categories} 
              authors={entities.authors} 
              title={"最新文章"} 
              hasMore={ _.get(latestPosts, [ 'items', 'length' ], 0) < _.get(latestPosts, [ 'meta', 'total' ], 0) }
              loadMore={this.loadMore}
            />

            <Footer sectionList={sectionListResponse} />
          </div>

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
    sectionList: state.sectionList || {},
    sectionFeatured: state.sectionFeatured || {}
  }
}

Home.contextTypes = {
  device: React.PropTypes.string
}

export { Home }

export default connect(mapStateToProps, {
  fetchArticlesByUuidIfNeeded,
  fetchIndexArticles,
  fetchLatestPosts,
  setPageType
})(Home)
