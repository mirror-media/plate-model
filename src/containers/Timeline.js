/* global __DEVELOPMENT__ */
import { DFPID, GAID, SECTION, SITE_META, SITE_NAME } from '../constants/index'
import { connect } from 'react-redux'
import { DFPSlotsProvider } from 'react-dfp'
import { fetchIndexArticles, fetchTopics, fetchTwitterTimeline } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import DocumentMeta from 'react-document-meta'
import FooterFull from '../components/FooterFull'
import HeaderFull from '../components/HeaderFull'
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
      return store.dispatch( fetchTopics() )
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
    const { fetchIndexArticles, sectionList, topics } = this.props

    //TODO: We should not get all the keys
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    if ( !checkSectionList ) {
      fetchIndexArticles([ 'sections' ])
    }

    if ( !_.get(topics, 'fetched', undefined) ) {
      this.props.fetchTopics()
    }

  }

  componentDidMount() {
    const section = _.get(this.props.params, 'section', null)
    const catName = _.get( _.find( _.get(this.props.sectionList, [ 'response', 'sections' ]), { name: section }), [ 'title' ], null)

    ga.initialize(GAID, { debug: __DEVELOPMENT__ })
    if(section != null) ga.set( { 'contentGroup1': catName } )
    ga.pageview(this.props.location.pathname)

    this.props.setPageType(SECTION)
    this.props.setPageTitle('', catName ? catName + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL)

    this.props.fetchTwitterTimeline()

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
    // const sectionLogo = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'image' ], null)
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
    let sectionLogo = {
      'description': 'section-watch_m',
      'tags': [],
      'image': {
        'gcsDir': 'assets/images/',
        'url': 'https://storage.googleapis.com/mirrormedia-dev/assets/images/20161219101501-b49754297f3e3e1351e1f4b59eed66ec.png',
        'filetype': 'image/png',
        'height': 40,
        'resizedTargets': {
          'mobile': {
            'url':'https://storage.googleapis.com/mirrormedia-dev/assets/images/20161219101501-b49754297f3e3e1351e1f4b59eed66ec-mobile.png',
            'width': 152,
            'height': 40
          },
          'tiny': {
            'url': 'https://storage.googleapis.com/mirrormedia-dev/assets/images/20161219101501-b49754297f3e3e1351e1f4b59eed66ec-tiny.png',
            'width': 150,
            'height': 39
          },
          'tablet': {
            'url': 'https://storage.googleapis.com/mirrormedia-dev/assets/images/20161219101501-b49754297f3e3e1351e1f4b59eed66ec-tablet.png',
            'width': 152,
            'height': 40
          },
          'desktop': {
            'url': 'https://storage.googleapis.com/mirrormedia-dev/assets/images/20161219101501-b49754297f3e3e1351e1f4b59eed66ec-desktop.png',
            'width': 152,
            'height': 40
          }
        },
        'width': 152,
        'iptc': {
          'keywords': []
        },
        'gcsBucket': 'mirrormedia-dev',
        'filename': '20161219101501-b49754297f3e3e1351e1f4b59eed66ec.png',
        'size': 5585
      },
      'sale': false,
      'id': '585742a587844cd85a2ff056',
      'createTime': 'Mon, 19 Dec 2016 02:15:00 GMT'
    }
    return (
          <DFPSlotsProvider dfpNetworkId={DFPID}>
            <DocumentMeta {...meta}>
              <SidebarFull pathName={location.pathname} sectionList={sectionList.response}/>
              <HeaderFull pathName={location.pathname} sectionLogo={sectionLogo}/>
              <div className="leadingFull__gradient"></div>
              <section>
                  <a href="/story/57cfaffb81445bef12e8d758/">
                      <figure className="post-image" style={ { background: 'url(//pbs.twimg.com/media/Czc7MNuVIAAAa4Y.jpg) center center / cover no-repeat' } }></figure>
                  </a>
              </section>
              { _.map(twitterTimeline.items, (t)=>{
                return (
                  <section className="tweet" key={t.id_str}>
                    <div className="datetime">{ dateformat(t.created_at, 'mm/dd HH:MM') }</div>
                    <div className="box topLine">
                      <div className="clock"></div>
                      <div className="innerBox leftLine">
                        <div className="heroImg"><img src={ _.get(t, [ 'extended_entities', 'media', 0, 'media_url_https' ]) }/></div>
                        <div className="content" dangerouslySetInnerHTML={ { __html: twitter.autoLink(t.text, t.entities.urls) } }></div>
                        <div className="share"></div>
                      </div>
                    </div>
                  </section>
                )
              })}
              <div onClick={this.loadMore}>more</div>
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
    topics: state.topics || {},
    twitterTimeline: state.twitterTimeline || {}
  }
}

Timeline.contextTypes = {
  device: React.PropTypes.string
}

export { Timeline }
export default connect(mapStateToProps, { fetchIndexArticles, fetchTopics, setPageType, setPageTitle, fetchTwitterTimeline })(Timeline)
