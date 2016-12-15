/* global __DEVELOPMENT__ */
import { DFPID, GAID, SECTION, SITE_META, SITE_NAME } from '../constants/index'
import { connect } from 'react-redux'
import { camelize } from 'humps'
import { DFPSlotsProvider } from 'react-dfp'
import { fetchArticlesByUuidIfNeeded, fetchIndexArticles, fetchTopics } from '../actions/articles'
import { setPageType, setPageTitle } from '../actions/header'
import _ from 'lodash'
import DocumentMeta from 'react-document-meta'
import ChoicesFull from '../components/ChoicesFull'
import FooterFull from '../components/FooterFull'
import ga from 'react-ga'
import HeaderFull from '../components/HeaderFull'
import LatestStories from '../components/LatestStories'
import LeadingFull from '../components/LeadingFull'
import React, { Component } from 'react'
import SidebarFull from '../components/SidebarFull'

if (process.env.BROWSER) {
  require('./SectionFull.css')
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
    const { articlesByUuids, entities, sectionFeatured, params, sectionList, location } = this.props
    const catId = _.get(params, 'section')
    const sectionLogo = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'logo' ], null)
    const customCSS = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'css' ], null)
    const customJS = _.get( _.find( _.get(sectionList, [ 'response', 'sections' ]), { name: section }), [ 'javascript' ], null)

    let ids = _.get(articlesByUuids, [ catId, 'items' ], [])
    let articles = []
    ids.forEach((id) => {
      if (entities.articles.hasOwnProperty(id)) {
        articles.push(entities.articles[id])
      }
    })
    //let articles = denormalizeArticles(_.get(articlesByUuids, [ catId, 'items' ], []), entities)

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

    // const isFeatured = _.get(event, [ 'isFeatured' ])

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