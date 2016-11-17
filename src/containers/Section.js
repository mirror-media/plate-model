/* global __DEVELOPMENT__ */
import { SECTION, SITE_META, SITE_NAME, GAID, AD_UNIT_PREFIX, DFPID } from '../constants/index'
import { connect } from 'react-redux'
import { denormalizeArticles } from '../utils/index'
import { fetchIndexArticles, fetchArticlesByUuidIfNeeded, fetchTopics } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import React, { Component } from 'react'
import List from '../components/List'
import Featured from '../components/Featured'
import { DFPSlotsProvider, AdSlot } from 'react-dfp'
import ga from 'react-ga'
import { camelize } from 'humps'

if (process.env.BROWSER) {
  require('./Section.css')
}

const MAXRESULT = 10
const PAGE = 1

// english to chinese of category

class Section extends Component {
  static fetchData({ params, store }) {
    return store.dispatch(fetchArticlesByUuidIfNeeded(params.section, SECTION), {
      page: PAGE,
      max_results: MAXRESULT
    }).then(() => {
      return store.dispatch( fetchIndexArticles( [ 'sections', 'sectionfeatured' ] ) )
    }).then(() => {
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
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, fetchIndexArticles, sectionList, topics, sectionFeatured } = this.props
    let catId = this.state.catId

    //TODO: We should not get all the keys
    let checkSectionList = _.get(sectionList, 'fetched', undefined)
    let checkSectionFeatured = _.get(sectionFeatured, 'fetched', undefined)
    if ( !checkSectionList || !checkSectionFeatured) {
      fetchIndexArticles([ 'sections', 'sectionfeatured' ])
    }

    if ( !_.get(topics, 'fetched', undefined) ) {
      this.props.fetchTopics()
    }

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ catId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(catId, SECTION, {
      page: PAGE,
      max_results: MAXRESULT
    })
    
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

  componentWillReceiveProps(nextProps) {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = nextProps
    let catId = _.get(params, 'section')

    // if fetched before, do nothing
    if (_.get(articlesByUuids, [ catId, 'items', 'length' ], 0) > 0) {
      return
    }

    fetchArticlesByUuidIfNeeded(catId, SECTION, {
      page: PAGE,
      max_results: MAXRESULT
    })
  }

  _loadMore() {
    const { articlesByUuids, fetchArticlesByUuidIfNeeded, params } = this.props
    let catId = _.get(params, 'section')

    let articlesByCat = _.get(articlesByUuids, [ catId ], {})
    if (_.get(articlesByCat, 'hasMore') === false) {
      return
    }

    let itemSize = _.get(articlesByCat, 'items.length', 0)
    let page = Math.floor(itemSize / MAXRESULT) + 1

    fetchArticlesByUuidIfNeeded(catId, SECTION, {
      page: page,
      max_results: MAXRESULT
    })
  }

  render() {
    const { articlesByUuids, entities, sectionFeatured, params, sectionList, topics, location } = this.props
    const catId = _.get(params, 'section')

    let articles = denormalizeArticles(_.get(articlesByUuids, [ catId, 'items' ], []), entities)

    let featured = _.filter(entities.articles, (v,k)=>{ return _.indexOf(_.get(sectionFeatured, [ 'items', camelize(catId) ], []), k) > -1 })

    const section = _.get(params, 'section', null)
    const catName = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'title' ], null)
    const catDesc = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'description' ], null)
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
            <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '970px' } }>
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
            <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '320px' } }>
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
            <Featured articles={featured} categories={entities.categories} />
            <List 
              articles={articles}
              categories={entities.categories} 
              section={section}
              title={catName} 
              hasMore={ _.get(articlesByUuids, [ catId, 'hasMore' ])}
              loadMore={this.loadMore}
            />
            {this.props.children}

            <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '970px' } }>
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
            <div style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '320px' } }>
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
    sectionFeatured: state.sectionFeatured || {},
    topics: state.topics || {}
  }
}

Section.contextTypes = {
  device: React.PropTypes.string
}

export { Section }
export default connect(mapStateToProps, { fetchArticlesByUuidIfNeeded, fetchIndexArticles, fetchTopics, setPageType, setPageTitle })(Section)
