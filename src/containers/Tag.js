/* global __DEVELOPMENT__ */
import { GAID, SITE_META, SITE_NAME, TAG } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchArticlesByUuidIfNeeded, fetchIndexArticles, fetchTag, fetchTopics } from '../actions/articles'
import { imageComposer } from '../utils/index'
import { setPageTitle, setPageType } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import FooterFull from '../components/FooterFull'
import Header from '../components/Header'
import HeaderFull from '../components/HeaderFull'
import LatestArticlesFull from '../components/LatestArticlesFull'
import List from '../components/List'
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import SidebarFull from '../components/SidebarFull'
import ga from 'react-ga'

if (process.env.BROWSER) {
  require('./Tag.css')
}

const MAXRESULT = 10
const FULLSTYLEMAXRESULT = 9
const PAGE = 1

class Tag extends Component {
  static fetchData({ params, store }) {
    return store.dispatch( fetchIndexArticles( [ 'sections' ] ) )
    .then(() => {
      return store.dispatch( fetchTopics() )
    }).then(() => {
      return store.dispatch( fetchTag(params.tagId) )
    })
  }

  constructor(props) {
    super(props)
    this.loadMore = this._loadMore.bind(this)
  }

  componentWillMount() {
    const { fetchArticlesByUuidIfNeeded, fetchIndexArticles, fetchTag, params, sectionList, tag, topics } = this.props
    let tagId = _.get(params, 'tagId')
    let tagStyle = _.get(tag, [ 'items', 'style' ] ) ? _.get(tag, [ 'items', 'style' ] ) : 'feature'
    
    if ( !_.get(topics, 'fetched', undefined) ) {
      this.props.fetchTopics()
    }

    if ( !_.get(tag, 'fetched', undefined) ) {
      fetchTag(tagId)
    }

    switch (tagStyle) {
      case 'feature':
        fetchArticlesByUuidIfNeeded(tagId, TAG, {
          page: PAGE,
          max_results: MAXRESULT
        })
        break
      case 'full':
        fetchArticlesByUuidIfNeeded(tagId, TAG, {
          page: PAGE,
          max_results: FULLSTYLEMAXRESULT
        })
    }
    
    // if fetched before, do nothing
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    if ( !checkSectionList ) {
      fetchIndexArticles([ 'sections' ])
    }
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
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params, tag } = nextProps
    let tagId = _.get(params, 'tagId')
    let tagStyle = _.get(tag, [ 'items', 'style' ] ) ? _.get(tag, [ 'items', 'style' ] ) : 'feature'

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ tagId, 'items', 'length' ], 0) > 0) {
      return
    }

    switch (tagStyle) {
      case 'feature':
        fetchArticlesByUuidIfNeeded(tagId, TAG, {
          page: PAGE,
          max_results: MAXRESULT
        })
        break
      case 'full':
        fetchArticlesByUuidIfNeeded(tagId, TAG, {
          page: PAGE,
          max_results: FULLSTYLEMAXRESULT
        })
    }
  }

  _loadMore() {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params, tag } = this.props
    const tagId = _.get(params, 'tagId')
    const tagStyle = _.get(tag, [ 'items', 'style' ] ) ? _.get(tag, [ 'items', 'style' ] ) : 'feature'
    
    let articlesByTag = _.get(articlesByUuids, [ tagId ], {})
    if (_.get(articlesByTag, 'hasMore') === false) {
      return
    }

    let itemSize = _.get(articlesByTag, 'items.length', 0)

    switch (tagStyle) {
      case 'feature':
        let page = Math.floor(itemSize / MAXRESULT) + 1
        fetchArticlesByUuidIfNeeded(tagId, TAG, {
          page: page,
          max_results: MAXRESULT
        })
        break
      case 'full':
        let pageStyleFull = Math.floor(itemSize / FULLSTYLEMAXRESULT) + 1
        fetchArticlesByUuidIfNeeded(tagId, TAG, {
          page: pageStyleFull,
          max_results: FULLSTYLEMAXRESULT
        })
    }

    ga.event({
      category: 'tag',
      action: 'click',
      label: 'loadMore'
    })
  }

  render() {
    const { articlesByUuids, entities, location, params, sectionList, tag, topics } = this.props
    const tagId = _.get(params, 'tagId')
    const tagStyle = _.get(tag, [ 'items', 'style' ] ) ? _.get(tag, [ 'items', 'style' ] ) : 'feature'
    const section = _.get(tag.items, 'sections[0].name', null)
    const sectionLogo = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'image' ], null)

    let articles = denormalizeArticles(_.get(articlesByUuids, [ tagId, 'items' ], []), entities)
    let sectionListResponse = _.get(sectionList, 'response', {})
    let heroImage = imageComposer(tag.items).desktopImage
    let tagName = _.get(entities, [ 'tags', tagId, 'name' ], '')
    const meta = {
      auto: { ograph: true },
      canonical: `${SITE_META.URL}tag/${tagId}`,
      description: SITE_META.DESC,
      meta: { property: {} },
      title: tagName ? tagName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL
    }
    const customCSS = _.get(tag.items, [ 'css' ])
    switch (tagStyle) {
      default:
        return (
          <DocumentMeta {...meta}>
            <Sidebar pathName={location.pathname} sectionList={sectionListResponse} topics={topics}/>
            <Header pathName={location.pathname} sectionList={sectionListResponse} topics={topics}/>

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
      case 'full':
        return (
          <DocumentMeta {...meta}>
            <SidebarFull pathName={location.pathname} section={section} sectionList={sectionListResponse}/>
            <HeaderFull pathName={location.pathname} sectionLogo={sectionLogo}/>
            <section className="tag-gallery" style={{ backgroundImage: 'url('+heroImage+')' }}>
              <div className="tag-gallery-headline">
                <h1 className="tag-gallery-headline__enName"></h1>
                <h3 className="tag-gallery-headline__zhName"></h3>
                <div className="tag-gallery-intro">
                  <span className="tag-gallery-intro__title"></span>
                  <img src="/asset/icon/tag-arrow.png"/>
                </div>
              </div>
            </section>
            <LatestArticlesFull
                articles={articles}
                categories={entities.categories}
                hasMore={ _.get(articlesByUuids, [ tagId, 'hasMore' ])}
                loadMore={this.loadMore}
                pathName={location.pathname} />
            <FooterFull pathName={location.pathname} sectionList={sectionListResponse} sectionLogo={sectionLogo}/>
            <style dangerouslySetInnerHTML={ { __html: customCSS } } />
          </DocumentMeta>
        )
    }
  }
}

function mapStateToProps(state) {
  return {
    articlesByUuids: state.articlesByUuids || {},
    entities: state.entities || {},
    sectionList: state.sectionList || {},
    tag: state.tag || {},
    topics: state.topics || {}
  }
}

Tag.contextTypes = {
  device: React.PropTypes.string
}

export { Tag }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, fetchIndexArticles, fetchTag, fetchTopics, setPageTitle, setPageType })(Tag)
