/* global __DEVELOPMENT__ */
import { CATEGORY, SITE_META, SITE_NAME, GAID, AD_UNIT_PREFIX, DFPID } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { DFPSlotsProvider, DFPManager, AdSlot } from 'react-dfp'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, fetchYoutubePlaylist, fetchTopics } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import ga from 'react-ga'
import Header from '../components/Header'
import List from '../components/List'
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import VideoList from '../components/VideoList'

if (process.env.BROWSER) {
  require('./Category.css')
}

const MAXRESULT = 10
const PAGE = 0

class Category extends Component {
  static fetchData({ params, store }) {
    if (params.category == 'videohub') {
      return store.dispatch(fetchYoutubePlaylist(MAXRESULT)).then(() => {
        return store.dispatch( fetchIndexArticles( [ 'sections' ] ) ).then(() => {
          return store.dispatch( fetchTopics() )
        })
      })
    } else {
      return store.dispatch(fetchArticlesByUuidIfNeeded(params.category, CATEGORY), {
        page: PAGE,
        max_results: MAXRESULT
      }).then(() => {
        return store.dispatch( fetchIndexArticles( [ 'sections' ] ) )
      }).then(() => {
        return store.dispatch( fetchTopics() )
      })
    }
  }

  constructor(props) {
    super(props)
    let category = this.props.params.category
    this.state = {
      catId: category
    }
    this.loadMore = this._loadMore.bind(this)
    this.loadMoreVideo = this._loadMoreVideo.bind(this)
    this.renderList = this._renderList.bind(this)
  }

  componentWillMount() {
    const { fetchArticlesByUuidIfNeeded, articlesByUuids, fetchIndexArticles, fetchYoutubePlaylist, sectionList, topics, youtubePlaylist } = this.props
    let catId = this.state.catId

    if ( !_.get(topics, 'fetched', undefined) ) {
      this.props.fetchTopics()
    }

    // if fetched before, do nothing
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    if ( !checkSectionList ) {
      fetchIndexArticles([ 'sections' ])
    }

    // if fetched before, do nothing
    let checkYoutubePlaylist = _.get(youtubePlaylist, 'fetched', undefined)
    if ( !checkYoutubePlaylist ) {
      fetchYoutubePlaylist(MAXRESULT)
    }

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ catId, 'items', 'length' ], 0) > 0 || catId == 'videohub') {
      return
    }

    fetchArticlesByUuidIfNeeded(catId, CATEGORY, {
      page: PAGE,
      max_results: MAXRESULT
    })

    this.props.fetchTopics()

  }

  componentDidMount() {
    const category = _.get(this.props.params, 'category', null)
    const catId = _.get(this.props.sectionList.response, [ 'categories', category, 'id' ], null)
    const catName = _.get(this.props.sectionList.response, [ 'categories', category, 'title' ], null)
    const section = _.find(_.get(this.props.sectionList, [ 'response', 'sections' ]), function (o) { return _.find(o.categories, { 'id': catId }) })
    const sectionName = _.get(section, 'title', '')

    ga.initialize(GAID, { debug: __DEVELOPMENT__ })
    if(section != null) ga.set( { 'contentGroup1': sectionName } )
    ga.pageview(this.props.location.pathname)

    this.props.setPageType(CATEGORY)
    this.props.setPageTitle('', catName ? catName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL)
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

  componentDidUpdate() {
    DFPManager.load()
    DFPManager.refresh()
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

  _loadMoreVideo() {
    this.props.fetchYoutubePlaylist(MAXRESULT, this.props.youtubePlaylist.nextPageToken)
  }

  _renderList() {
    const { articlesByUuids, entities, params, sectionList , youtubePlaylist } = this.props
    const catId = _.get(params, 'category')
    const section = _.find(_.get(sectionList, [ 'response', 'sections' ]), function (o) { return _.find(o.categories, { 'name': catId }) })
    const sectionName = _.get(section, 'name', '')
    let articles = denormalizeArticles(_.get(articlesByUuids, [ catId, 'items' ], []), entities)
    const category = _.get(params, 'category', null)
    const catName = _.get(sectionList.response, [ 'categories', category, 'title' ], null)

    if (catId != 'videohub') {
      return (
        <List
          articles={articles}
          categories={entities.categories}
          section={sectionName}
          title={catName}
          hasMore={ _.get(articlesByUuids, [ catId, 'hasMore' ])}
          loadMore={this.loadMore}
        />
      )
    } else {
      return (
        <VideoList
          playlist={youtubePlaylist.items}
          title={'VideoHub'}
          hasMore={ _.get(youtubePlaylist, [ 'nextPageToken' ])}
          loadMore={this.loadMoreVideo}
        />
      )
    }
  }

  render() {
    const { params, sectionList, topics, location } = this.props

    const category = _.get(params, 'category', null)
    const catId = _.get(sectionList.response, [ 'categories', category, 'id' ], null)
    const section = _.find(_.get(sectionList, [ 'response', 'sections' ]), function (o) { return _.find(o.categories, { 'id': catId }) })
    const sectionName = _.get(section, 'name', '')

    const catName = _.get(sectionList.response, [ 'categories', category, 'title' ], null)
    const meta = {
      title: catName ? catName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL,
      description: SITE_META.DESC,
      canonical: `${SITE_META.URL}category/${category}`,
      meta: { property: {} },
      auto: { ograph: true }
    }

    return (
      <DFPSlotsProvider dfpNetworkId={DFPID}>
        <DocumentMeta {...meta}>
        <Sidebar sectionList={sectionList.response} topics={topics} pathName={location.pathname}/>
        <Header sectionList={sectionList.response} topics={topics} pathName={location.pathname}/>

          <div id="main" className="pusher">
            <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '970px', textAlign: 'center' } }>
              <AdSlot sizes={ [ [ 970, 90 ],  [ 970, 250 ] ] }
                dfpNetworkId={DFPID}
                slotId={ 'mm_pc_'+AD_UNIT_PREFIX[sectionName]+'_970x250_HD' }
                adUnit={ 'mm_pc_'+AD_UNIT_PREFIX[sectionName]+'_970x250_HD' }
                sizeMapping={
                  [
                    { viewport: [   0,   0 ], sizes: [ ] },
                    { viewport: [ 970, 200 ], sizes: [ [ 970, 90 ], [ 970, 250 ] ]  }
                  ]
                }
              />
            </div>
            <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '320px', textAlign: 'center' } }>
              <AdSlot sizes={ [ [ 320, 100 ], [ 300, 250 ] ] }
                dfpNetworkId={DFPID}
                slotId={ 'mm_mobile_'+AD_UNIT_PREFIX[sectionName]+'_300x250_HD' }
                adUnit={ 'mm_mobile_'+AD_UNIT_PREFIX[sectionName]+'_300x250_HD' }
                sizeMapping={
                  [
                    { viewport: [   1,   1 ], sizes: [ [ 320, 100 ], [ 300, 250 ] ] },
                    { viewport: [ 970, 200 ], sizes: [ ]  }
                  ]
                }
              />
            </div>
            {this.renderList()}
            {this.props.children}
            <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '970px', textAlign: 'center' } }>
              <AdSlot sizes={ [ [ 970, 90 ] ] }
                dfpNetworkId={DFPID}
                slotId={ 'mm_pc_'+AD_UNIT_PREFIX[sectionName]+'_970x90_FT' }
                adUnit={ 'mm_pc_'+AD_UNIT_PREFIX[sectionName]+'_970x90_FT' }
                sizeMapping={
                  [
                    { viewport: [   0,   0 ], sizes: [ ] },
                    { viewport: [ 970, 200 ], sizes: [ [ 970, 90 ], [ 970, 250 ], [ 300, 250 ] ]  }
                  ]
                }
              />
            </div>
            <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '320px', textAlign: 'center' } }>
              <AdSlot sizes={ [ [ 320, 100 ] ] }
                dfpNetworkId={DFPID}
                slotId={ 'mm_mobile_'+AD_UNIT_PREFIX[sectionName]+'_320x100_FT' }
                adUnit={ 'mm_mobile_'+AD_UNIT_PREFIX[sectionName]+'_320x100_FT' }
                sizeMapping={
                  [
                    { viewport: [   1,   1 ], sizes: [ [ 320, 100 ], [ 300, 250 ] ] },
                    { viewport: [ 970, 200 ], sizes: [ ]  }
                  ]
                }
              />
            </div>
            <Footer sectionList={sectionList.response} />
          </div>
        </DocumentMeta>
      </DFPSlotsProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    articlesByUuids: state.articlesByUuids || {},
    entities: state.entities || {},
    sectionList: state.sectionList || {},
    topics: state.topics || {},
    youtubePlaylist: state.youtubePlaylist || {}
  }
}

Category.contextTypes = {
  device: React.PropTypes.string
}

export { Category }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, fetchIndexArticles, fetchYoutubePlaylist, fetchTopics, setPageType, setPageTitle })(Category)
