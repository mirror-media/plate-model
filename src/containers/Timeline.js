/* global __DEVELOPMENT__ */
import { DFPID, GAID, SECTION, SITE_META, SITE_NAME } from '../constants/index'
import { connect } from 'react-redux'
import { DFPSlotsProvider } from 'react-dfp'
import { fetchIndexArticles, fetchTopics } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Footer from '../components/Footer'
import ga from 'react-ga'
import Header from '../components/Header'
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'

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
  }

  componentWillUpdate(nextProps) {
    const section = _.get(nextProps.params, 'section', null)
    const catName = _.get( _.find( _.get(nextProps.sectionList, [ 'response', 'sections' ]), { name: section }), [ 'title' ], null)

    if (nextProps.location.pathname !== this.props.location.pathname) {
      if(section != null) ga.set( { 'contentGroup1': catName } )
      ga.pageview(nextProps.location.pathname)
    }

  }

  render() {
    const { params, sectionList, topics, location } = this.props
    const section = _.get(params, 'section', null)
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
          <Sidebar sectionList={sectionList.response} topics={topics} pathName={location.pathname}/>
          <Header sectionList={sectionList.response} topics={topics} pathName={location.pathname}/>

          <div id="main" className="pusher">
            <div id="columns">
              <figure>
                <img src="//pbs.twimg.com/media/Czc7MNuVIAAAa4Y.jpg" />
                <figcaption>PATEK PHILIPPE #PatekPhilippe #movement #mirrorwatch #鏡錶誌 https://t.co/soFW9EU8hY</figcaption>
              </figure>

              <figure>
                <img src="//pbs.twimg.com/media/Czc3sULUsAITq4k.jpg" />
                <figcaption>BELL &amp; ROSS https://t.co/TAfbvPBfpB</figcaption>
              </figure>
              <figure>
                <img src="//pbs.twimg.com/media/Czc4NOMVQAA7mz7.jpg" />
                <figcaption>OMEGA Speedmaster https://t.co/NOtvrvaiIi</figcaption>
              </figure>
              <figure>
                <img src="//pbs.twimg.com/media/Czc7MNuVIAAAa4Y.jpg" />
                <figcaption>PATEK PHILIPPE #PatekPhilippe #movement #mirrorwatch #鏡錶誌 https://t.co/soFW9EU8hY</figcaption>
              </figure>
              <figure>
                <img src="//pbs.twimg.com/media/Czc3sULUsAITq4k.jpg" />
                <figcaption>BELL &amp; ROSS https://t.co/TAfbvPBfpB</figcaption>
              </figure>
              <figure>
                <img src="//pbs.twimg.com/media/Czc7MNuVIAAAa4Y.jpg" />
                <figcaption>PATEK PHILIPPE #PatekPhilippe #movement #mirrorwatch #鏡錶誌 https://t.co/soFW9EU8hY</figcaption>
              </figure>
              <figure>
                <img src="//pbs.twimg.com/media/Czc4NOMVQAA7mz7.jpg" />
                <figcaption>OMEGA Speedmaster https://t.co/NOtvrvaiIi</figcaption>
              </figure>
              <figure>
                <img src="//pbs.twimg.com/media/Czc4NOMVQAA7mz7.jpg" />
                <figcaption>OMEGA Speedmaster https://t.co/NOtvrvaiIi</figcaption>
              </figure>
              <figure>
                <img src="//pbs.twimg.com/media/Czc3sULUsAITq4k.jpg" />
                <figcaption>BELL &amp; ROSS https://t.co/TAfbvPBfpB</figcaption>
              </figure>
            </div>
            {this.props.children}
            <Footer sectionList={sectionList.response} />
          </div>
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
    topics: state.topics || {}
  }
}

Timeline.contextTypes = {
  device: React.PropTypes.string
}

export { Timeline }
export default connect(mapStateToProps, { fetchIndexArticles, fetchTopics, setPageType, setPageTitle })(Timeline)
