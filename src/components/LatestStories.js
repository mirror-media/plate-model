import { imageComposer } from '../utils/index'
import _ from 'lodash'
import MoreFull from '../components/MoreFull'
import React, { Component } from 'react'
import dateformat from 'dateformat'
import entities from 'entities'
import ga from 'react-ga'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

if (process.env.BROWSER) {
  require('./LatestStories.css')
}

export default class LatestStories extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick() {
    ga.event({
      category: this.props.pathName,
      action: 'click',
      label: 'latestStories'
    })
  }

  render() {
    const { articles, hasMore, loadMore } = this.props
    let sortedArticles = _.sortBy(articles, function (o) { return new Date(o.publishedDate) }).reverse()

    return  (
      <section id="latestStories">
        <div className="section-title">
          <h2>
            <div className="colorBlock"></div>
            最新新聞 Latest Stories
          </h2>
        </div>
        <div className="post-block">
          <div className="latestStories-container">
            { _.map(_.take(sortedArticles, 3), (a)=>{
              let image = imageComposer(a).mobileImage
              let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'
              let brief = sanitizeHtml( _.get(a, [ 'brief', 'html' ], ''), { allowedTags: [ ] })
              let content = sanitizeHtml( _.get(a, [ 'content', 'html' ], ''), { allowedTags: [ ] })
              let briefContent = (brief.length >0) ? brief : content
              let writers = '文｜' + _.pluck(a.writers, 'name').join('、') + '｜'
              if ( _.has(a, '_highlightResult') ) {
                brief = sanitizeHtml( _.get(a, [ '_highlightResult', 'brief', 'value' ], ''), { allowedTags: [ 'em' ] })
                content = sanitizeHtml( _.get(a, [ '_highlightResult', 'content',' value' ], ''), { allowedTags: [ 'em' ] })
                briefContent = (brief.length >0) ? brief : content
              }
              return (
                <div key={a.id || a._id}>
                  <div className="latestStories-divider"></div>
                  <div className="latestStories-story">
                    <a href={ linkStyle+a.slug+'/' } onClick={ this._handleClick }>
                      <div className="latestStories-story__img" style={{ background:'url('+image+') no-repeat center center', backgroundSize:'cover' }} >
                      </div>
                    </a>
                    <div className="latestStories-story__content">
                      <div className="latestStories-story__title">
                        <a href={linkStyle + a.slug + '/'} onClick={ this._handleClick }>
                          <h2>{ a.title }</h2>
                        </a>
                      </div>
                      <div className="latestStories-story__meta">
                        <div className="latestStories-story__author">{ (_.get(a, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }</div>
                        <div className="latestStories-story__date">{ dateformat(a.publishedDate, 'yyyy.mm.dd') }</div>
                      </div>
                      <div className="latestStories-story__brief">
                        <a href={linkStyle + a.slug + '/'} onClick={ this._handleClick }>{ truncate(entities.decodeHTML(briefContent), 70) }</a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            { _.map(_.slice(sortedArticles, 5), (a)=>{
              let image = imageComposer(a).mobileImage
              let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'
              let brief = sanitizeHtml( _.get(a, [ 'brief', 'html' ], ''), { allowedTags: [ ] })
              let content = sanitizeHtml( _.get(a, [ 'content', 'html' ], ''), { allowedTags: [ ] })
              let briefContent = (brief.length >0) ? brief : content
              let writers = '文｜' + _.pluck(a.writers, 'name').join('、') + '｜'
              if ( _.has(a, '_highlightResult') ) {
                brief = sanitizeHtml( _.get(a, [ '_highlightResult', 'brief', 'value' ], ''), { allowedTags: [ 'em' ] })
                content = sanitizeHtml( _.get(a, [ '_highlightResult', 'content',' value' ], ''), { allowedTags: [ 'em' ] })
                briefContent = (brief.length >0) ? brief : content
              }
              return (
                <div key={a.id || a._id}>
                  <div className="latestStories-divider"></div>
                  <div className="latestStories-story">
                    <a href={ linkStyle+a.slug+'/' } onClick={ this._handleClick }>
                      <div className="latestStories-story__img" style={{ background:'url('+image+') no-repeat center center', backgroundSize:'cover' }} >
                      </div>
                    </a>
                    <div className="latestStories-story__content">
                      <div className="latestStories-story__title">
                        <a href={linkStyle + a.slug + '/'} onClick={ this._handleClick }>
                          <h2>{ a.title }</h2>
                        </a>
                      </div>
                      <div className="latestStories-story__meta">
                        <div className="latestStories-story__author">{ (_.get(a, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }</div>
                        <div className="latestStories-story__date">{ dateformat(a.publishedDate, 'yyyy.mm.dd') }</div>
                      </div>
                      <div className="latestStories-story__brief">
                        <a href={linkStyle + a.slug + '/'} onClick={ this._handleClick }>{ truncate(entities.decodeHTML(briefContent), 70) }</a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>  
          { hasMore ? <MoreFull loadMore={loadMore} /> : null }
        </div>
      </section>
    )
  }
}

export { LatestStories }
