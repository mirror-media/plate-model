/*eslint no-unused-vars:0, no-console:0 */
/* global __DEVELOPMENT__, $ */
'use strict'
<<<<<<< 5984c0c278fdd9107a10b47579b9f586b8bc07cb

=======
>>>>>>> implement full screen DFS slot (cookie)
import _ from 'lodash'
import async from 'async'
import Choices from '../components/Choices'
import cookie from 'react-cookie'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import ga from 'react-ga'
import Header from '../components/Header'
import LatestArticles from '../components/LatestArticles'
import LatestSections from '../components/LatestSections'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Sidebar from '../components/Sidebar'
import SystemError from '../components/SystemError'
import TopChoice from '../components/TopChoice'
import TopNews from '../components/TopNews'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { devCatListId, prodCatListId } from '../conf/list-id'
import { DFPManager, DFPSlotsProvider, AdSlot } from 'react-dfp'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, makeSearchQuery, fetchLatestPosts, fetchTopics } from '../actions/articles'
import { HOME, CATEGORY, SITE_NAME, SITE_META, GAID, DFPID } from '../constants/index'
import { setPageType, setPageTitle } from '../actions/header'

const MAXRESULT = 10
const PAGE = 1

if (process.env.BROWSER) {
  require('./Home.css')
}

class Home extends Component {
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
      if (id.slotId == 'mm_mobile_hp_320x480_FS' && !id.event.isEmpty && !cookie.load('visited')) {
        console.log(id)
        if ( $(window).width() < 970 ) {
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
    const { articlesByUuids, entities, sectionFeatured, sectionList, choices, latestPosts, topics } = this.props

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
          <Sidebar sectionList={sectionListResponse} topics={topics}/>
          <Header sectionList={sectionListResponse} topics={topics}/>

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

              <TopChoice 
                article={ _.get(entities.articles, _.first( _.get(choices, 'items', []) ), {}) } 
                categories={entities.categories}
              />
              <LatestSections 
                sections={sections} 
                entities={entities} 
                sectionList={sectionListResponse}
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

              <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '970px' } }>
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
              <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '320px' } }>
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
    entities: state.entities || {},
    indexArticles: state.indexArticles || {},
    choices: state.choices || {},
    latestPosts: state.latestPosts || {},
    sectionList: state.sectionList || {},
    sectionFeatured: state.sectionFeatured || {},
    topics: state.topics || {}
  }
}

Home.contextTypes = {
  device: React.PropTypes.string
}

export { Home }

export default connect(mapStateToProps, {
  fetchArticlesByUuidIfNeeded,
  fetchIndexArticles,
  fetchLatestPosts,
  fetchTopics,
  setPageType,
  setPageTitle
})(Home)
