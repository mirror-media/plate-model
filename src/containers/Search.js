/* global __DEVELOPMENT__ */
import { SITE_META, SITE_NAME, SEARCH, GAID } from '../constants/index'
import { connect } from 'react-redux'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, makeSearchQuery, fetchTopics } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import React, { Component } from 'react'
import List from '../components/List'
import ga from 'react-ga'

if (process.env.BROWSER) {
  require('./Section.css')
}

const MAXRESULT = 10
const PAGE = 0

// english to chinese of category

class Search extends Component {
  static fetchData({ params, store }) {
    let keyword = params.keyword
    return store.dispatch( makeSearchQuery(encodeURIComponent(keyword)+'&offset='+PAGE+'&length='+MAXRESULT) ).then(() => {
      return store.dispatch( fetchIndexArticles( [ 'sections' ] ) )
    }).then(() => {
      return store.dispatch( fetchTopics() )
    })
  }

  constructor(props) {
    super(props)
    let keyword = this.props.params.keyword
    this.state = {
      keyword: keyword,
      nlength: MAXRESULT
    }
    this.loadMore = this._loadMore.bind(this)
  }

  componentWillMount() {
    // const { articlesByUuids, fetchArticlesByUuidIfNeeded, fetchIndexArticles, searchResult, makeSearchQuery, sectionList } = this.props
    const { fetchIndexArticles, makeSearchQuery, sectionList, topics, searchResult } = this.props
    let keyword = this.state.keyword

    let checkSearchResult = _.get(searchResult, 'response', undefined)
    if ( !checkSearchResult ) {
      makeSearchQuery((encodeURIComponent(keyword)+'&offset='+PAGE+'&length='+MAXRESULT)).then(() =>{
        // console.log( searchResult )
        return
      })
    }

    if ( !_.get(topics, 'fetched', undefined) ) {
      this.props.fetchTopics()
    }

    // if fetched before, do nothing
    if (_.get(sectionList, [ 'response', 'length' ], 0) == 0 ) {
      fetchIndexArticles( [ 'sections' ] )
    }
  }

  componentDidMount() {
    const { params } = this.props
    const keyword = _.get(params, 'keyword', null)

    ga.initialize(GAID, { debug: __DEVELOPMENT__ })
    ga.pageview(this.props.location.pathname)

    this.props.setPageType(SEARCH)
    this.props.setPageTitle('', keyword ? '「' + keyword + '」' + + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      ga.pageview(nextProps.location.pathname)
    }
  }

  _loadMore() {
    const { searchResult, makeSearchQuery, params } = this.props
    const keyword = _.get(params, 'keyword', null)
    let nlength = this.state.nlength

    if ( _.get(searchResult, [ 'response', 'nbHits' ], 0) <= (_.get(searchResult, [ 'response', 'length' ], 0)) ) {
      return
    }

    let length = nlength + MAXRESULT

    makeSearchQuery((encodeURIComponent(keyword)+'&offset='+0+'&length='+length)).then(() =>{
      // console.log( searchResult )
      return
    })

    this.setState({
      nlength: length
    })
  }

  render() {
    const { entities, params, sectionList, searchResult, topics, location } = this.props
    const keyword = _.get(params, 'keyword', null)

    const meta = {
      title: keyword ? '「' + keyword + '」' + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL,
      description: SITE_META.DESC,
      canonical: `${SITE_META.URL}search/${keyword}`,
      meta: { property: {} },
      auto: { ograph: true }
    }

    return (
      <DocumentMeta {...meta}>
        <Sidebar sectionList={sectionList.response} topics={topics} pathName={location.pathname}/>
        <Header sectionList={sectionList.response} topics={topics} pathName={location.pathname}/>

        <div id="main" className="pusher">
          <List
            articles={ _.get(searchResult, [ 'response', 'hits' ], []) }
            categories={entities.categories}
            title={params.keyword}
            hasMore={ _.get(searchResult, [ 'response', 'nbHits' ], 0) > (_.get(searchResult, [ 'response', 'length' ], 0)) }
            loadMore={this.loadMore}
          />
          {this.props.children}
          <Footer sectionList={sectionList.response} />
        </div>
      </DocumentMeta>
    )
  }
}

function mapStateToProps(state) {
  return {
    articlesByUuids: state.articlesByUuids || {},
    entities: state.entities || {},
    sectionList: state.sectionList || {},
    searchResult: state.searchResult || {},
    topics: state.topics || {}
  }
}

Search.contextTypes = {
  device: React.PropTypes.string
}

export { Search }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, makeSearchQuery, fetchIndexArticles, fetchTopics, setPageType, setPageTitle })(Search)
