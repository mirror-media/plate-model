/* global __DEVELOPMENT__ */
import { DFPID, GAID, SECTION, SITE_META, SITE_NAME } from '../constants/index'
import { connect } from 'react-redux'
import { DFPSlotsProvider } from 'react-dfp'
import { fetchIndexArticles, fetchTopics, fetchTwitterTimeline } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import DocumentMeta from 'react-document-meta'
import FooterFull from '../components/FooterFull'
import HeaderFull from '../components/HeaderFull'
import MoreFull from '../components/MoreFull'
import React, { Component } from 'react'
import SidebarFull from '../components/SidebarFull'
import _ from 'lodash'
import dateformat from 'dateformat'
import ga from 'react-ga'
import twitter from 'twitter-text'

if (process.env.BROWSER) {
  require('./Timeline.css')
}

class Timeline extends Component {
  static fetchData({ params, store }) {
    params = params
    return store.dispatch( fetchIndexArticles( [ 'sections' ] ) 
    ).then(() => {
      return store.dispatch( fetchTwitterTimeline('MirrorWatchTW', 30) )
    })
  }

  constructor(props) {
    super(props)
    let section = this.props.params.section
    this.state = {
      catId: section
    }
    this.loadMore = this._loadMore.bind(this)
  }

  componentWillMount() {
    const { fetchIndexArticles, sectionList, twitterTimeline } = this.props

    //TODO: We should not get all the keys
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    if ( !checkSectionList ) {
      fetchIndexArticles([ 'sections' ])
    }

    if ( !_.get(twitterTimeline, 'fetched', undefined) ) {
      fetchTwitterTimeline('MirrorWatchTW', 30)
    }
  }

  componentDidMount() {
    const section = _.get(this.props.params, 'section', null)
    const catName = _.get( _.find( _.get(this.props.sectionList, [ 'response', 'sections' ]), { name: section }), [ 'title' ], null)

    ga.initialize(GAID, { debug: __DEVELOPMENT__ })
    if(section != null) ga.set( { 'contentGroup1': catName } )
    ga.pageview(this.props.location.pathname)

    this.props.setPageType(SECTION)
    this.props.setPageTitle('', 'Timeline' + SITE_NAME.SEPARATOR + SITE_NAME.FULL)

  }

  componentWillUpdate(nextProps) {
    const section = _.get(nextProps.params, 'section', null)
    const catName = _.get( _.find( _.get(nextProps.sectionList, [ 'response', 'sections' ]), { name: section }), [ 'title' ], null)

    if (nextProps.location.pathname !== this.props.location.pathname) {
      if(section != null) ga.set( { 'contentGroup1': catName } )
      ga.pageview(nextProps.location.pathname)
    }

  }

  _loadMore() {
    const { twitterTimeline } = this.props
    let lastTweet = _.last(twitterTimeline.items)
    this.props.fetchTwitterTimeline('MirrorWatchTW', 10, _.get(lastTweet, 'id', 0) )
  }

  render() {
    const { params, sectionList, location, twitterTimeline } = this.props
    const section = _.get(params, 'section', null)
    const sectionLogo = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: 'watch' }), [ 'image' ], null)
    const catName = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'title' ], null)
    const catDesc = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'description' ], null)
    const customCSS = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'css' ], null)
    const customJS = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'javascript' ], null)
    const meta = {
      title: catName ? catName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL,
      description: catDesc,
      canonical: `${SITE_META.URL}section/${section}`,
      meta: { property: {} },
      auto: { ograph: true }
    }

    return (
          <DFPSlotsProvider dfpNetworkId={DFPID}>
            <DocumentMeta {...meta}>
              <SidebarFull pathName={'/section/watch'} section={'watch'} sectionList={sectionList.response}/>
              <HeaderFull pathName={'/section/watch'} section={'watch'} sectionLogo={sectionLogo}/>
              <div className="leadingFull__gradient" style={{ zIndex: '9' }}></div>
              <section style={{ position: 'relative' }}>
                <div className="titleBox"/>
                <figure className="post-image" style={ { background: 'url(//www.mirrormedia.mg/assets/images/20170320141850-acc898b5c64351723a13f93a9981fdf5.jpg) center center / cover no-repeat' } }></figure>
              </section>
              <div className="timelineWrapper">
                { _.map(twitterTimeline.items, (t)=>{
                  return (
                    <section className="tweet" key={t.id_str}>
                      <div className="datetime">{ dateformat(t.created_at, 'mm/dd HH:MM') }</div>
                      <div className="box topLine">
                        <div className="clock"></div>
                        <div className="innerBox leftLine">
                          <div className="heroImg"><a href={'https://twitter.com/MirrorWatchTW/status/'+_.get(t, 'id_str')}><img src={ _.get(t, [ 'extended_entities', 'media', 0, 'media_url_https' ]) }/></a></div>
                          <div className="content" dangerouslySetInnerHTML={ { __html: twitter.autoLink(t.text, t.entities.urls) } }></div>
                          <div className="share"></div>
                        </div>
                      </div>
                    </section>
                  )
                })}
                <MoreFull loadMore={this.loadMore} />
              </div>
              <FooterFull pathName={location.pathname} sectionList={sectionList.response} sectionLogo={sectionLogo}/>
              <style dangerouslySetInnerHTML={ { __html: customCSS } } />
              <script dangerouslySetInnerHTML={ { __html: customJS } } />
            </DocumentMeta>
          </DFPSlotsProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    sectionList: state.sectionList || {},
    twitterTimeline: state.twitterTimeline || {}
  }
}

Timeline.contextTypes = {
  device: React.PropTypes.string
}

export { Timeline }
export default connect(mapStateToProps, { fetchIndexArticles, fetchTopics, setPageType, setPageTitle, fetchTwitterTimeline })(Timeline)
