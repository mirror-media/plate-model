/* global __DEVELOPMENT__ */
import { SITE_META, SITE_NAME, GAID, TOPIC } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, fetchImages } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import ga from 'react-ga'
import Header from '../components/Header'
import List from '../components/List'
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import Leading from '../components/Leading'

const MAXRESULT = 10
const PAGE = 1

if (process.env.BROWSER) {
  require('./Topic.css')
}

class Topic extends Component {
  static fetchData({ params, store }) {
    return store.dispatch(fetchArticlesByUuidIfNeeded(params.topicId, TOPIC, {
      page: PAGE,
      max_results: MAXRESULT
    })).then(() => {
      return store.dispatch( fetchIndexArticles( [ 'sections' ] ) )
    })
  }

  constructor(props) {
    super(props)
    this.loadMore = this._loadMore.bind(this)
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

    this.props.fetchImages('TOPIC', '581bf3ce9f5a0d6f27821d74', {})

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ topicId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(topicId, TOPIC, {
      page: PAGE,
      max_results: MAXRESULT
    })

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

    fetchArticlesByUuidIfNeeded(topicId, TOPIC, {
      page: PAGE,
      max_results: MAXRESULT
    })
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
    const { articlesByUuids, entities, params, sectionList } = this.props
    const topicId = _.get(params, 'topicId')
    const topicName = _.get(_.find( _.get(entities, 'topics', {}), function (o) { return o.name == topicId || o.id == topicId } ), 'name')
    const topicUUID = _.get(_.find( _.get(entities, 'topics', {}), function (o) { return o.name == topicId || o.id == topicId } ), 'id')
    let articles = denormalizeArticles(_.get(articlesByUuids, [ topicId, 'items' ], []), entities)
    let sectionListResponse = _.get(sectionList, 'response', {})
    const images  = _.get(this.props.images, [ 'items', 'items' ])
    const meta = {
      auto: { ograph: true },
      canonical: `${SITE_META.URL}topic/${topicId}`,
      description: SITE_META.DESC,
      meta: { property: {} },
      title: topicName ? topicName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL
    }
    return (
      <DocumentMeta {...meta}>
        <Sidebar sectionList={sectionListResponse} />

        <div className="top">
          <Header sectionList={sectionListResponse} />
          <div className="topic-title"><h2>Title Here</h2></div>
          <Leading type="slideshow" images={images} device={this.context.device} />
        </div>

        <div id="main" className="pusher middle">
          <List
            articles={articles}
            categories={entities.categories}
            title={topicName}
            hasMore={ _.get(articlesByUuids, [ topicId, 'hasMore' ])}
            loadMore={this.loadMore}
          />
          {this.props.children}
          <Footer sectionList={sectionListResponse} />
        </div>

        <style dangerouslySetInnerHTML={ { __html: _.get(entities, [ 'topics', topicUUID, 'style' ], '') } } />
      </DocumentMeta>
    )
  }
}

function mapStateToProps(state) {
  return {
    articlesByUuids: state.articlesByUuids || {},
    entities: state.entities || {},
    sectionList: state.sectionList || {},
    images: state.images || {}
  }
}

Topic.contextTypes = {
  device: React.PropTypes.string
}

export { Topic }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, fetchIndexArticles, setPageType, setPageTitle, fetchImages })(Topic)
