/*eslint no-unused-vars:0, no-console:0 */
/* global __DEVELOPMENT__ */
'use strict'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { devCatListId, prodCatListId } from '../conf/list-id'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, makeSearchQuery, fetchLatestPosts, fetchTopics } from '../actions/articles'
import { HOME, CATEGORY, SITE_NAME, SITE_META, GAID } from '../constants/index'
import { setPageType, setPageTitle } from '../actions/header'
import _ from 'lodash'
import async from 'async'
import Choices from '../components/Choices'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import ga from 'react-ga'
import Header from '../components/Header'
import LatestArticles from '../components/LatestArticles'
import LatestChoices from '../components/LatestChoices'
import LatestSections from '../components/LatestSections'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Sidebar from '../components/Sidebar'
import SystemError from '../components/SystemError'
import TopChoice from '../components/TopChoice'
import TopNews from '../components/TopNews'

const MAXRESULT = 10
const PAGE = 1

if (process.env.BROWSER) {
  require('./Home.css')
}

class HomeB extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchIndexArticles([ 'choices', 'posts', 'sections', 'sectionfeatured' ])).then(() => {
      return store.dispatch( fetchTopics() )
    })
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
    this.props.setPageTitle('', SITE_NAME.FULL)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      ga.pageview(nextProps.location.pathname)
    }
  }

  componentWillMount() {
    const { fetchArticlesByUuidIfNeeded, fetchIndexArticles } = this.props
    const { articlesByUuids, entities, sectionFeatured, sectionList, choices, fetchLatestPosts, topics, latestPosts } = this.props

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

    if ( !_.get(topics, 'fetched', undefined) ) {
      this.props.fetchTopics()
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
    const { articlesByUuids, entities, sectionFeatured, sectionList, choices, latestPosts, topics, location } = this.props

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
          <Sidebar sectionList={sectionListResponse} topics={topics} pathname={location.pathname}/>
          <Header sectionList={sectionListResponse} topics={topics} pathname={location.pathname}/>

          <div id="main" className="pusher">
            <TopChoice 
              article={ _.get(entities.articles, _.first( _.get(choices, 'items', []) ), {}) } 
              categories={entities.categories}
            />
            <LatestChoices
                articles={entities.articles}
                categories={entities.categories}
                choices={_.get(choices, 'items', [])}
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
    sectionFeatured: state.sectionFeatured || {},
    topics: state.topics || {}
  }
}

HomeB.contextTypes = {
  device: React.PropTypes.string
}

export { HomeB }

export default connect(mapStateToProps, {
  fetchArticlesByUuidIfNeeded,
  fetchIndexArticles,
  fetchLatestPosts,
  fetchTopics,
  setPageType,
  setPageTitle
})(HomeB)
