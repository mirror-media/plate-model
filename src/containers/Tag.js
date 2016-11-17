/* global __DEVELOPMENT__ */
import { SITE_META, SITE_NAME, TAG, GAID } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, fetchTopics } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import ga from 'react-ga'
import Header from '../components/Header'
import List from '../components/List'
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'


const MAXRESULT = 10
const PAGE = 1

class Tag extends Component {
  static fetchData({ params, store }) {
    return store.dispatch(fetchArticlesByUuidIfNeeded(params.tagId), TAG, {
      page: PAGE,
      max_results: MAXRESULT
    }).then(() => {
      return store.dispatch( fetchIndexArticles( [ 'sections' ] ) )
    }).then(() => {
      return store.dispatch( fetchTopics() )
    })
  }

  constructor(props) {
    super(props)
    this.loadMore = this._loadMore.bind(this)
  }

  componentWillMount() {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params, fetchIndexArticles, topics, sectionList } = this.props
    let tagId = _.get(params, 'tagId')

    if ( !_.get(topics, 'fetched', undefined) ) {
      this.props.fetchTopics()
    }
    
    // if fetched before, do nothing
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    if ( !checkSectionList ) {
      fetchIndexArticles([ 'sections' ])
    }
      
    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ tagId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(tagId, TAG, {
      page: PAGE,
      max_results: MAXRESULT
    })
  }

  componentDidMount() {
    const { entities, params } = this.props
    let tagId = _.get(params, 'tagId')
    let tagName = _.get(entities, [ 'tags', tagId, 'name' ], '')

    ga.initialize(GAID, { debug: __DEVELOPMENT__ })
    ga.pageview(this.props.location.pathname)

    this.props.setPageType(TAG)
    this.props.setPageTitle('', tagName ? tagName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      ga.pageview(nextProps.location.pathname)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = nextProps
    let tagId = _.get(params, 'tagId')

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ tagId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(tagId, TAG, {
      page: PAGE,
      max_results: MAXRESULT
    })
  }

  _loadMore() {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = this.props
    const tagId = _.get(params, 'tagId')
    let articlesByTag = _.get(articlesByUuids, [ tagId ], {})
    if (_.get(articlesByTag, 'hasMore') === false) {
      return
    }

    let itemSize = _.get(articlesByTag, 'items.length', 0)
    let page = Math.floor(itemSize / MAXRESULT) + 1

    fetchArticlesByUuidIfNeeded(tagId, TAG, {
      page: page,
      max_results: MAXRESULT
    })
  }

  render() {
    const { articlesByUuids, entities, params, sectionList, topics, location } = this.props
    const tagId = _.get(params, 'tagId')
    let articles = denormalizeArticles(_.get(articlesByUuids, [ tagId, 'items' ], []), entities)
    let sectionListResponse = _.get(sectionList, 'response', {})
    let tagName = _.get(entities, [ 'tags', tagId, 'name' ], '')
    const meta = {
      auto: { ograph: true },
      canonical: `${SITE_META.URL}tag/${tagId}`,
      description: SITE_META.DESC,
      meta: { property: {} },
      title: tagName ? tagName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL
    }

    return (
      <DocumentMeta {...meta}>
        <Sidebar sectionList={sectionListResponse} topics={topics} pathName={this.props.location.pathname}/>
        <Header sectionList={sectionListResponse} topics={topics} pathName={this.props.location.pathname}/>

        <div id="main" className="pusher">
          <List 
            articles={articles} 
            categories={entities.categories}
            hasMore={ _.get(articlesByUuids, [ tagId, 'hasMore' ])}
            loadMore={this.loadMore}
          />
          {this.props.children}
          <Footer sectionList={sectionListResponse} />
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
    topics: state.topics || {}
  }
}

Tag.contextTypes = {
  device: React.PropTypes.string
}

export { Tag }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, fetchIndexArticles, fetchTopics, setPageType, setPageTitle })(Tag)
