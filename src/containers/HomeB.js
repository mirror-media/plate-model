/*eslint no-unused-vars:0, no-console:0 */
/* global __DEVELOPMENT__, $ */
'use strict'
import async from 'async'
import Choices from '../components/Choices'
import cookie from 'react-cookie'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import ga from 'react-ga'
import Header from '../components/Header'
import LatestArticlesB from '../components/LatestArticlesB'
import LatestChoicesB from '../components/LatestChoicesB'
import LatestSections from '../components/LatestSections'
import Leading from '../components/Leading'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Sidebar from '../components/Sidebar'
import SystemError from '../components/SystemError'
import TopNews from '../components/TopNews'
import _ from 'lodash'
import { AdSlot, DFPManager, DFPSlotsProvider } from 'react-dfp'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { devCatListId, prodCatListId } from '../conf/list-id'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, fetchLatestPosts, fetchEvent, fetchTopics , makeSearchQuery } from '../actions/articles'
import { HOME, CATEGORY, SITE_NAME, SITE_META, GAID, DFPID } from '../constants/index'
import { setPageType, setPageTitle } from '../actions/header'

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

    DFPManager.attachSlotRenderEnded((id, event) => {
      if (id.slotId == 'mm_mobile_hp_320x480_FS' && !id.event.isEmpty) {
        console.log(id)
        if ( $(window).width() < 970 && !cookie.load('visited') ) {
          cookie.save('visited', true, { path: '/', maxAge: 600 })
          $('.ui.dimmer').dimmer('show')
          $('.ui.dimmer .close').click( function () {
            $('.ui.dimmer').dimmer('hide')
            console.log(cookie.load('visited'))
          })
        }
      }
    })

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

    this.props.fetchEvent({
      max_results: 1,
      where: {
        isFeatured: true
      }
    })

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

    ga.event({
      category: 'homeb',
      action: 'click',
      label: 'loadMoreb'
    })

    this.setState({
      page: page + 1
    })

  }

  render() {
    const { articlesByUuids, entities, sectionFeatured, sectionList, choices, latestPosts, topics, location } = this.props
    const { device } = this.context

    const event = _.get(this.props.event, [ 'items', 0 ])
    const embed = _.get(event, [ 'embed' ] )
    const eventType = _.get(event, [ 'eventType' ] )
    const eventPeriod = [ _.get(event, [ 'startDate' ]), _.get(event, [ 'endDate' ]) ]
    const image = _.get(event, [ 'image' ] )
    const isFeatured = _.get(event, [ 'isFeatured' ])
    const video = _.get(event, [ 'video' ] )


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
        <DFPSlotsProvider dfpNetworkId={DFPID}>
          <DocumentMeta {...meta} >
            <Sidebar sectionList={sectionListResponse} topics={topics} pathName={location.pathname}/>
            <Header sectionList={sectionListResponse} topics={topics} pathName={location.pathname}/>

            <div className="ui dimmer">
              <div className="content" style={ { height: '480px', width: '320px', position: 'fixed', top: 'calc(50% - 240px)', left: 'calc(50% - 160px)' } }>
                <div className="close" style={ { top: '-16px', right: '0', position: 'absolute', 'zIndex': '9999' } }>
                  <div style={ { background: 'url(/asset/close.png) center center no-repeat', backgroundSize: 'cover', width: '32px', height: '32px' } } />
                </div>
                <div className="center">
                  <AdSlot sizes={ [ [ 320, 480 ] ] }
                    dfpNetworkId={DFPID}
                    slotId={ 'mm_mobile_hp_320x480_FS' }
                    adUnit={ 'mm_mobile_hp_320x480_FS' }
                    sizeMapping={
                      [
                        { viewport: [   1,   1 ], sizes: [ [ 320, 480 ] ] },
                        { viewport: [ 970, 200 ], sizes: [ ]  }
                      ]
                    }
                  />
                </div>
              </div>
            </div>

            <div id="main" className="pusher">

              <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '970px' } }>
                <AdSlot sizes={ [ [ 970, 90 ],  [ 970, 250 ] ] }
                  dfpNetworkId={DFPID}
                  slotId={ 'mm_pc_hp_970x250_HD' }
                  adUnit={ 'mm_pc_hp_970x250_HD' }
                  sizeMapping={
                    [
                      { viewport: [   0,   0 ], sizes: [ ] },
                      { viewport: [ 970, 200 ], sizes: [ [ 970, 90 ], [ 970, 250 ] ]  }
                    ]
                  }
                />
              </div>
              <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '320px' } }>
                <AdSlot sizes={ [ [ 320, 100 ] ] }
                  dfpNetworkId={DFPID}
                  slotId={ 'mm_mobile_hp_320x100_HD' }
                  adUnit={ 'mm_mobile_hp_320x100_HD' }
                  sizeMapping={
                    [
                      { viewport: [   1,   1 ], sizes: [ [ 320, 100 ], [ 300, 250 ] ] },
                      { viewport: [ 970, 200 ], sizes: [ ]  }
                    ]
                  }
                />
              </div>
              <Leading leading={ eventType } mediaSource={ { 'heroImage': image, 'heroVideo': video, 'embed': embed, 'eventPeriod': eventPeriod, 'flag': 'event', 'isFeatured': isFeatured } } device={ this.context.device } />

              <LatestChoicesB
                  articles={entities.articles}
                  categories={entities.categories}
                  choices={_.get(choices, 'items', [])}
                />
              <LatestArticlesB
                articles={posts}
                categories={entities.categories}
                authors={entities.authors}
                title={"最新文章"}
                hasMore={ _.get(latestPosts, [ 'items', 'length' ], 0) < _.get(latestPosts, [ 'meta', 'total' ], 0) }
                loadMore={this.loadMore}
              />

              <div style={ { margin: '20px auto', 'maxWidth': '970px' } }>
                <AdSlot sizes={ [ [ 970, 90 ] ] }
                  dfpNetworkId={DFPID}
                  slotId={ 'mm_pc_hp_970x90_FT' }
                  adUnit={ 'mm_pc_hp_970x90_FT' }
                  sizeMapping={
                    [
                      { viewport: [   0,   0 ], sizes: [ ] },
                      { viewport: [ 970, 200 ], sizes: [ [ 970, 90 ], [ 970, 250 ], [ 300, 250 ] ]  }
                    ]
                  }
                />
              </div>
              <div style={ { margin: '20px auto', 'maxWidth': '320px' } }>
                <AdSlot sizes={ [ [ 320, 100 ] ] }
                  dfpNetworkId={DFPID}
                  slotId={ 'mm_mobile_hp_320x100_FT' }
                  adUnit={ 'mm_mobile_hp_320x100_FT' }
                  sizeMapping={
                    [
                      { viewport: [   1,   1 ], sizes: [ [ 320, 100 ], [ 300, 250 ] ] },
                      { viewport: [ 970, 200 ], sizes: [ ]  }
                    ]
                  }
                />
              </div>

              <Footer sectionList={sectionListResponse} />
            </div>

          </DocumentMeta>
        </DFPSlotsProvider>
      )
    } else {
      return ( <SystemError /> )
    }
  }
}

function mapStateToProps(state) {
  return {
    articlesByUuids: state.articlesByUuids || {},
    choices: state.choices || {},
    entities: state.entities || {},
    event: state.event || {},
    indexArticles: state.indexArticles || {},
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
  fetchEvent,
  fetchIndexArticles,
  fetchLatestPosts,
  fetchTopics,
  setPageType,
  setPageTitle
})(HomeB)
