import { CATEGORY, SITE_META, SITE_NAME, GAID } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded } from '../actions/articles'
import { setPageType } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import React, { Component } from 'react'
import List from '../components/List'
import ga from 'react-ga'

if (process.env.BROWSER) {
  require('./Category.css')
}

const MAXRESULT = 10
const PAGE = 1

class Category extends Component {
  static fetchData({ params, store }) {
    return store.dispatch(fetchArticlesByUuidIfNeeded(params.category, CATEGORY), {
      page: PAGE,
      max_results: MAXRESULT
    }).then(() => {
      return store.dispatch( fetchIndexArticles( [ 'sections' ] ) )
    })
  }

  constructor(props) {
    super(props)
    let category = this.props.params.category
    this.state = {
      catId: category
    }
    this.loadMore = this._loadMore.bind(this)
  }

  componentWillMount() {
    const { fetchArticlesByUuidIfNeeded, articlesByUuids, fetchIndexArticles, sectionList } = this.props
    let catId = this.state.catId

    // if fetched before, do nothing
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    if ( !checkSectionList ) {
      fetchIndexArticles([ 'sections' ])
    }

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ catId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(catId, CATEGORY, {
      page: PAGE,
      max_results: MAXRESULT
    })

  }

  componentDidMount() {
    const category = _.get(this.props.params, 'category', null)
    const catId = _.get(this.props.sectionList.response, [ 'categories', category, 'id' ], null)
    const section = _.find(_.get(this.props.sectionList, [ 'response', 'sections' ]), function (o) { return _.find(o.categories, { 'id': catId }) })
    const sectionName = _.get(section, 'title', '')

    ga.initialize(GAID, { debug: true })
    if(section != null) ga.set( { 'contentGroup1': sectionName } )
    ga.pageview(this.props.location.pathname)

    this.props.setPageType(CATEGORY)
  }

  componentWillUpdate(nextProps) {
    const category = _.get(nextProps.params, 'category', null)
    const catId = _.get(nextProps.sectionList.response, [ 'categories', category, 'id' ], null)
    const section = _.find(_.get(nextProps.sectionList, [ 'response', 'sections' ]), function (o) { return _.find(o.categories, { 'id': catId }) })
    const sectionName = _.get(section, 'title', '')

    if (nextProps.location.pathname !== this.props.location.pathname) {
      if(section != null) ga.set( { 'contentGroup1': sectionName } )
      ga.pageview(nextProps.location.pathname)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = nextProps
    let catId = _.get(params, 'category')

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ catId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(catId, CATEGORY, {
      page: PAGE,
      max_results: MAXRESULT
    })
  }

  _loadMore() {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = this.props
    let catId = _.get(params, 'category')

    let articlesByCat = _.get(articlesByUuids, [ catId ], {})
    if (_.get(articlesByCat, 'hasMore') === false) {
      return
    }

    let itemSize = _.get(articlesByCat, 'items.length', 0)
    let page = Math.floor(itemSize / MAXRESULT) + 1

    fetchArticlesByUuidIfNeeded(catId, CATEGORY, {
      page: page,
      max_results: MAXRESULT
    })
  }

  render() {
    const { articlesByUuids, entities, params, sectionList } = this.props
    const catId = _.get(params, 'category')
    let articles = denormalizeArticles(_.get(articlesByUuids, [ catId, 'items' ], []), entities)
    const category = _.get(params, 'category', null)
    const catName = _.get(sectionList.response, [ 'categories', category, 'title' ], null)
    const meta = {
      title: catName ? catName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL,
      description: SITE_META.DESC,
      canonical: `${SITE_META.URL}category/${category}`,
      meta: { property: {} },
      auto: { ograph: true }
    }

    return (
      <DocumentMeta {...meta}>
        <Sidebar sectionList={sectionList.response} />
        <Header sectionList={sectionList.response} />

        <div id="main" className="pusher">
          <List 
            articles={articles} 
            categories={entities.categories} 
            title={catName} 
            hasMore={ _.get(articlesByUuids, [ catId, 'hasMore' ])}
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

Category.contextTypes = {
  device: React.PropTypes.string
}

export { Category }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, fetchIndexArticles, setPageType })(Category)
