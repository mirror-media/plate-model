/* global __DEVELOPMENT__ */
import { AUTHOR, DFPID, GAID, SITE_META, SITE_NAME } from '../constants/index'
import { DFPSlotsProvider } from 'react-dfp'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchArticleByAuthor, fetchIndexArticles, fetchTopics } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import Header from '../components/Header'
import List from '../components/List'
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import _ from 'lodash'
import ga from 'react-ga'

if (process.env.BROWSER) {
  require('./Author.css')
}

const MAXRESULT = 10
const PAGE = 0

class Author extends Component {
  static fetchData({ params, store }) {
    return store.dispatch( fetchArticleByAuthor({
      page: PAGE,
      max_results: MAXRESULT,
      where: {
        '$or' : [
          { writers: _.get(params, 'authorId', '') },
          { photographers: _.get(params, 'authorId', '') },
          { camera_man: _.get(params, 'authorId', '') },
          { designers: _.get(params, 'authorId', '') },
          { engineers: _.get(params, 'authorId', '') }
        ]
      },
      sort: '-publishedDate'
    })).then(() => {
      return store.dispatch( fetchIndexArticles( [ 'sections' ] ) )
    }).then(() => {
      return store.dispatch( fetchTopics() )
    })
  }

  constructor(props) {
    super(props)
    let authorId = this.props.params.authorId
    this.state = {
      authorId: authorId
    }
    this.loadMore = this._loadMore.bind(this)
    this.renderList = this._renderList.bind(this)
  }

  componentWillMount() {
    const { fetchArticleByAuthor, fetchIndexArticles, params, sectionList, topics } = this.props

    if ( !_.get(topics, 'fetched', undefined) ) {
      this.props.fetchTopics()
    }

    // if fetched before, do nothing
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    if ( !checkSectionList ) {
      fetchIndexArticles([ 'sections' ])
    }

    fetchArticleByAuthor({
      page: PAGE,
      max_results: MAXRESULT,
      where: {
        '$or' : [
          { writers: _.get(params, 'authorId', '') },
          { photographers: _.get(params, 'authorId', '') },
          { camera_man: _.get(params, 'authorId', '') },
          { designers: _.get(params, 'authorId', '') },
          { engineers: _.get(params, 'authorId', '') }
        ]
      },
      sort: '-publishedDate'
    })
  }

  componentDidMount() {
    const authorId = _.get(this.props.params, [ 'authorId' ], null)
    const authorName = _.get(this.props, [ 'entities', 'authors', authorId, 'name' ], null)

    ga.initialize(GAID, { debug: __DEVELOPMENT__ })
    ga.set( { 'contentGroup1': '作者頁' } )
    ga.pageview(this.props.location.pathname)

    this.props.setPageType(AUTHOR)
    this.props.setPageTitle('', authorName ? authorName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL)
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

  _loadMore() {
    const { articleByAuthor, fetchArticleByAuthor, params } = this.props
    let articlesByAuthor = _.get(articleByAuthor, 'author', {})

    if (_.get(articlesByAuthor, 'hasMore') === false) {
      return
    }

    let itemSize = _.get(articlesByAuthor, 'items.length', 0)
    let page = Math.floor(itemSize / MAXRESULT) + 1

    fetchArticleByAuthor({
      page: page,
      max_results: MAXRESULT,
      where: {
        '$or' : [
          { writers: _.get(params, 'authorId', '') },
          { photographers: _.get(params, 'authorId', '') },
          { camera_man: _.get(params, 'authorId', '') },
          { designers: _.get(params, 'authorId', '') },
          { engineers: _.get(params, 'authorId', '') }
        ]
      },
      sort: '-publishedDate'
    })

    ga.event({
      category: 'author',
      action: 'click',
      label: 'loadMore'
    })
  }

  _renderList() {
    const { entities, params } = this.props
    const authorId = _.get(params, 'authorId', null)
    const authorName = _.get(entities, [ 'authors', authorId, 'name' ], '作者文章')
    const authorEmail = _.get(entities, [ 'authors', authorId, 'email' ], '')
    let articles = denormalizeArticles(_.get(this.props, [ 'articleByAuthor', 'author', 'items' ], []), entities)

    const _title = authorName + '<span class=\"author-email\" ><a href=\"mailto:' + authorEmail + '\">' + authorEmail + '</a></span>'
    const _hasMore = _.get(this.props, [ 'articleByAuthor', 'author', 'hasMore' ])
    return (
      <List
        articles={articles}
        categories={{}}
        hasMore={_hasMore}
        loadMore={this.loadMore}
        section={''}
        title={_title}
      />
    )
  }


  render() {
    const { params, sectionList = {}, topics, location } = this.props
    const authorId = _.get(params, 'authorId', null)

    const authorName = _.get(this.props, [ 'entities', 'authors', authorId, 'name' ], null)
    const meta = {
      title: authorName ? authorName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL,
      description: SITE_META.DESC,
      canonical: `${SITE_META.URL}author/${authorId}`,
      meta: { property: {} },
      auto: { ograph: true }
    }

    return (
      <DFPSlotsProvider dfpNetworkId={DFPID}>
        <DocumentMeta {...meta}>
        <Sidebar sectionList={sectionList.response} topics={topics} pathName={location.pathname}/>
        <Header sectionList={sectionList.response} topics={topics} pathName={location.pathname}/>

          <div id="main" className="pusher">

            {this.renderList()}
            {this.props.children}

            <Footer sectionList={sectionList.response} />
          </div>
        </DocumentMeta>
      </DFPSlotsProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    articleByAuthor: state.articleByAuthor || {},
    entities: state.entities || {},
    sectionList: state.sectionList || {},
    topics: state.topics || {}
  }
}

Author.contextTypes = {
  device: React.PropTypes.string
}

export { Author }
export default connect(mapStateToProps, {
  fetchArticleByAuthor,
  fetchIndexArticles,
  fetchTopics,
  setPageType,
  setPageTitle
})(Author)
