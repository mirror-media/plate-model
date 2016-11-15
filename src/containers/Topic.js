/* global __DEVELOPMENT__ */
import { SITE_META, SITE_NAME, GAID, TOPIC } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Header from '../components/Header'
import Footer from '../components/Footer'
import React, { Component } from 'react'
import List from '../components/List'
import ga from 'react-ga'

const MAXRESULT = 10
const PAGE = 1

class Topic extends Component {
  static fetchData({ params, store }) {
    return store.dispatch(fetchArticlesByUuidIfNeeded(params.topicId), TOPIC, {
      page: PAGE,
      max_results: MAXRESULT
    }).then(() => {
      return store.dispatch( fetchIndexArticles( [ 'sections' ] ) )
    })
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    ga.initialize(GAID, { debug: __DEVELOPMENT__ })
    ga.pageview(this.props.location.pathname)

    this.props.setPageType(TOPIC)
  }

  componentWillMount() {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params, fetchIndexArticles, sectionList } = this.props
    let topicId = _.get(params, 'topicId')

    // if fetched before, do nothing
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    if ( !checkSectionList ) {
      fetchIndexArticles([ 'sections' ])
    }
      
    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ topicId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(topicId, TOPIC)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      ga.pageview(nextProps.location.pathname)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = nextProps
    let topicId = _.get(params, 'topicId')
    
    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ topicId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(topicId, TOPIC)
    this.setState({
      topicId: nextProps.params.topicId
    })
  }

  _loadMore() {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = this.props
    const topicId = _.get(params, 'topicId')

    let articlesByCat = _.get(articlesByUuids, [ topicId ], {})
    if (_.get(articlesByCat, 'hasMore') === false) {
      return
    }

    let itemSize = _.get(articlesByCat, 'items.length', 0)
    let page = Math.floor(itemSize / MAXRESULT) + 1

    fetchArticlesByUuidIfNeeded(topicId, TOPIC, {
      page: page,
      max_results: MAXRESULT
    })
  }

  render() {
    // const { device } = this.context
    // const { articlesByUuids, entities, params } = this.props
    // const topicId = _.get(params, 'topicId')
    // const topicName = _.get(entities, [ 'topics', topicId, 'name' ], null)
    // const topicBox = topicName ? <div className="top-title-outer"><h1 className="top-title"> {topicName} </h1></div> : null
    // let articles = denormalizeArticles(_.get(articlesByUuids, [ topicId, 'items' ], []), entities)

    const { articlesByUuids, entities, params, sectionList } = this.props
    const topicId = _.get(params, 'topicId')
    const topicName = ''
    const topicDesc = ''
    let articles = denormalizeArticles(_.get(articlesByUuids, [ topicId, 'items' ], []), entities)

    const meta = {
      title: topicName ? topicName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL,
      description: topicDesc,
      canonical: `${SITE_META.URL}topic/${topicId}`,
      meta: { property: {} },
      auto: { ograph: true }
    }
    return (
      <DocumentMeta {...meta}>
          <Header sectionList={sectionList.response} />

        <div className="leading" style={ { width: '100%', height: '400px', border: '1px solid #000' } } />

        <div id="main" className="pusher">
          <List 
            articles={articles}
            categories={entities.categories} 
            title={topicName} 
            hasMore={ _.get(articlesByUuids, [ topicId, 'hasMore' ])}
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
    sectionList: state.sectionList || {}
  }
}

Topic.contextTypes = {
  device: React.PropTypes.string
}

export { Topic }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, fetchIndexArticles, setPageType, setPageTitle })(Topic)
