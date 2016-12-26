/* global __DEVELOPMENT__ */
import { AD_UNIT_PREFIX, DFPID, GAID, SECTION, SITE_META, SITE_NAME } from '../constants/index'
import { AdSlot, DFPSlotsProvider } from 'react-dfp'
import { connect } from 'react-redux'
import { camelize } from 'humps'
import { denormalizeArticles } from '../utils/index'
import { fetchArticlesByUuidIfNeeded, fetchEvent, fetchIndexArticles, fetchTopics } from '../actions/articles'
import { setPageTitle, setPageType } from '../actions/header'
import _ from 'lodash'
import ChoicesFull from '../components/ChoicesFull'
import DocumentMeta from 'react-document-meta'
import Featured from '../components/Featured'
import Footer from '../components/Footer'
import FooterFull from '../components/FooterFull'
import Header from '../components/Header'
import HeaderFull from '../components/HeaderFull'
import LatestStories from '../components/LatestStories'
import Leading from '../components/Leading'
import LeadingFull from '../components/LeadingFull'
import List from '../components/List'
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import SidebarFull from '../components/SidebarFull'
import ga from 'react-ga'

if (process.env.BROWSER) {
  require('./Section.css')
}

const MAXRESULT = 10
const PAGE = 1

// english to chinese of category

class Section extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchIndexArticles([ 'sections', 'sectionfeatured' ]))
    .then(() => {
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
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, fetchIndexArticles, sectionFeatured, sectionList, topics } = this.props
    let catId = this.state.catId
    
    //TODO: We should not get all the keys
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    let checkSectionFeatured = _.get(sectionFeatured, 'fetched', undefined)
    if ( !checkSectionList || !checkSectionFeatured) {
      fetchIndexArticles([ 'sections', 'sectionfeatured' ])
    }

    const section = _.get(this.props.params, 'section', null)
    const sectionID = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'id' ], null)
    const sectionStyle = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'style' ], null)

    this.props.fetchEvent({
      max_results: 1,
      where: {
        sections: sectionID
      }
    })

    if ( !_.get(topics, 'fetched', undefined) ) {
      this.props.fetchTopics()
    }

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ catId, 'items', 'length' ], 0) > 0) {
      return
    }
    switch (sectionStyle) {
      case 'feature':
        fetchArticlesByUuidIfNeeded(catId, SECTION, {
          related: 'full',
          page: PAGE,
          max_results: MAXRESULT
        })
        break
      case 'full':
        fetchArticlesByUuidIfNeeded(catId, SECTION, {
          related: 'full',
          page: PAGE,
          max_results: MAXRESULT
        })
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
    const sectionID = _.get( _.find( _.get(nextProps.sectionList, [ 'response', 'sections' ]), { name: section }), [ 'id' ], null)

    if (nextProps.location.pathname !== this.props.location.pathname) {
      if(section != null) ga.set( { 'contentGroup1': catName } )
      ga.pageview(nextProps.location.pathname)

      this.props.fetchEvent({
        max_results: 1,
        where: {
          sections: sectionID
        }
      })
    }

  }

  componentWillReceiveProps(nextProps) {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params, sectionList } = nextProps
    let catId = _.get(params, 'section')

    const section = _.get(this.props.params, 'section', null)
    const sectionStyle = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'style' ], null)

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ catId, 'items', 'length' ], 0) > 0) {
      return
    }

    switch (sectionStyle) {
      case 'feature':
        fetchArticlesByUuidIfNeeded(catId, SECTION, {
          related: 'full',
          page: PAGE,
          max_results: MAXRESULT
        })
        break
      case 'full':
        fetchArticlesByUuidIfNeeded(catId, SECTION, {
          related: 'full',
          page: PAGE,
          max_results: MAXRESULT
        })
    }
  }

  _loadMore() {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params, sectionList } = this.props
    let catId = _.get(params, 'section')

    const section = _.get(this.props.params, 'section', null)
    const sectionStyle = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'style' ], null)

    let articlesByCat = _.get(articlesByUuids, [ catId ], {})
    if (_.get(articlesByCat, 'hasMore') === false) {
      return
    }

    let itemSize = _.get(articlesByCat, 'items.length', 0)
    let page = Math.floor(itemSize / MAXRESULT) + 1

    switch (sectionStyle) {
      case 'feature':
        fetchArticlesByUuidIfNeeded(catId, SECTION, {
          related: 'full',
          page: page,
          max_results: MAXRESULT
        })
        break
      case 'full':
        fetchArticlesByUuidIfNeeded(catId, SECTION, {
          related: 'full',
          page: page,
          max_results: MAXRESULT
        })
    }

    ga.event({
      category: 'section',
      action: 'click',
      label: 'loadMore'
    })
  }

  render() {
    const { articlesByUuids, entities, location, params, sectionFeatured, sectionList, topics } = this.props
    const catId = _.get(params, 'section')
    let articles = denormalizeArticles(_.get(articlesByUuids, [ catId, 'items' ], []), entities)
    let featured = _.filter(entities.articles, (v,k)=>{ return _.indexOf(_.get(sectionFeatured, [ 'items', camelize(catId) ], []), k) > -1 })

    const section = _.get(params, 'section', null)
    const sectionLogo = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'image' ], null)
    const sectionStyle = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'style' ], null)
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

    const event = _.get(this.props.event, [ 'items', 0 ])
    const embed = _.get(event, [ 'embed' ] )
    const eventType = _.get(event, [ 'eventType' ] )
    const eventPeriod = [ _.get(event, [ 'startDate' ]), _.get(event, [ 'endDate' ]) ]
    const image = _.get(event, [ 'image' ] )
    // const isFeatured = _.get(event, [ 'isFeatured' ])
    const video = _.get(event, [ 'video' ] )
    switch (sectionStyle) {
      case 'feature':
        return (
          <DFPSlotsProvider dfpNetworkId={DFPID}>
            <DocumentMeta {...meta}>
              <Sidebar pathName={location.pathname} sectionList={sectionList.response} topics={topics}/>
              <Header pathName={location.pathname} sectionList={sectionList.response} topics={topics}/>

              <div id="main" className="pusher">
                <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '970px', textAlign: 'center' } }>
                  <AdSlot sizes={ [ [ 970, 90 ],  [ 970, 250 ] ] }
                    dfpNetworkId={DFPID}
                    slotId={ 'mm_pc_'+AD_UNIT_PREFIX[section]+'_970x250_HD' }
                    adUnit={ 'mm_pc_'+AD_UNIT_PREFIX[section]+'_970x250_HD' }
                    sizeMapping={
                      [
                        { viewport: [   0,   0 ], sizes: [ ] },
                        { viewport: [ 970, 200 ], sizes: [ [ 970, 90 ], [ 970, 250 ] ]  }
                      ]
                    }
                  />
                </div>
                <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '320px', textAlign: 'center' } }>
                  <AdSlot sizes={ [ [ 300, 250 ], [ 320, 100 ] ] }
                    dfpNetworkId={DFPID}
                    slotId={ 'mm_mobile_'+AD_UNIT_PREFIX[section]+'_300x250_HD' }
                    adUnit={ 'mm_mobile_'+AD_UNIT_PREFIX[section]+'_300x250_HD' }
                    sizeMapping={
                      [
                        { viewport: [   1,   1 ], sizes: [ [ 300, 250 ], [ 320, 100 ] ] },
                        { viewport: [ 970, 200 ], sizes: [ ]  }
                      ]
                    }
                  />
                </div>
                <Leading device={ this.context.device } leading={ eventType } mediaSource={ { 'heroImage': image, 'heroVideo': video, 'embed': embed, 'eventPeriod': eventPeriod, 'flag': 'event', 'isFeatured': true } } pathName={location.pathname}/>
                <Featured articles={featured} categories={entities.categories} />
                <List
                  articles={articles}
                  categories={entities.categories}
                  hasMore={ _.get(articlesByUuids, [ catId, 'hasMore' ])}
                  loadMore={this.loadMore}
                  pathName={this.props.location.pathname}
                  section={section}
                  title={catName}
                />
                {this.props.children}

                <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '970px', textAlign: 'center' } }>
                  <AdSlot sizes={ [ [ 970, 90 ] ] }
                    dfpNetworkId={DFPID}
                    slotId={ 'mm_pc_'+AD_UNIT_PREFIX[section]+'_970x90_FT' }
                    adUnit={ 'mm_pc_'+AD_UNIT_PREFIX[section]+'_970x90_FT' }
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
                    slotId={ 'mm_mobile_'+AD_UNIT_PREFIX[section]+'_320x100_FT' }
                    adUnit={ 'mm_mobile_'+AD_UNIT_PREFIX[section]+'_320x100_FT' }
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
              <style dangerouslySetInnerHTML={ { __html: customCSS } } />
              <script dangerouslySetInnerHTML={ { __html: customJS } } />
            </DocumentMeta>
          </DFPSlotsProvider>
        )
      case 'full':
        return (
          <DFPSlotsProvider dfpNetworkId={DFPID}>
            <DocumentMeta {...meta}>
              <SidebarFull pathName={location.pathname} sectionList={sectionList.response}/>
              <HeaderFull pathName={location.pathname} sectionLogo={sectionLogo}/>
              <LeadingFull 
                articles={articles}
                pathName={location.pathname}
                section={section}
                title={catName} />
              <ChoicesFull 
                articles={featured}
                authors={entities.authors}
                categories={entities.categories}
                pathName={location.pathname} />
              <LatestStories
                articles={articles}
                hasMore={ _.get(articlesByUuids, [ catId, 'hasMore' ])}
                loadMore={this.loadMore}
                pathName={location.pathname} />
              <FooterFull pathName={location.pathname} sectionList={sectionList.response} sectionLogo={sectionLogo}/>
              <style dangerouslySetInnerHTML={ { __html: customCSS } } />
              <script dangerouslySetInnerHTML={ { __html: customJS } } />
            </DocumentMeta>
          </DFPSlotsProvider>
        )
    }
  }
}

function mapStateToProps(state) {
  return {
    articlesByUuids: state.articlesByUuids || {},
    entities: state.entities || {},
    event: state.event || {},
    sectionFeatured: state.sectionFeatured || {},
    sectionList: state.sectionList || {},
    topics: state.topics || {}
  }
}

Section.contextTypes = {
  device: React.PropTypes.string
}

export { Section }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, fetchEvent, fetchIndexArticles, fetchTopics, setPageType, setPageTitle })(Section)
