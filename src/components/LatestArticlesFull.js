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
  require('./LatestArticlesFull.css')
}

export default class LatestArticlesFull extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick() {
    ga.event({
      category: this.props.pathName,
      action: 'click',
      label: 'LatestArticlesFull'
    })
  }

  render() {
    const { articles, hasMore, loadMore } = this.props
    //const { articles, categories, hasMore, loadMore } = this.props
    let sortedArticles = _.sortBy(articles, function (o) { return new Date(o.publishedDate) }).reverse()

    return  (
      <section className="latestArticlesFull">
        <div className="section-title" style={{ 'marginBottom': '20px' }}>
          <h2>
            <div className="colorBlock"></div>
            最新新聞 Latest Stories
          </h2>
        </div>
        { _.map(_.take(sortedArticles, 3), (a)=>{
          let image = imageComposer(a).mobileImage
          //let title = sanitizeHtml( _.get(a, [ 'title' ], ''), { allowedTags: [ ] })
          let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'

          let brief = sanitizeHtml( _.get(a, [ 'brief', 'html' ], ''), { allowedTags: [ ] })
          let content = sanitizeHtml( _.get(a, [ 'content', 'html' ], ''), { allowedTags: [ ] })
          let briefContent = (brief.length >0) ? brief : content
          if ( _.has(a, '_highlightResult') ) {
            //title = sanitizeHtml( _.get(a, [ '_highlightResult', 'title', 'value' ], ''), { allowedTags: [ 'em' ] })
            brief = sanitizeHtml( _.get(a, [ '_highlightResult', 'brief', 'value' ], ''), { allowedTags: [ 'em' ] })
            content = sanitizeHtml( _.get(a, [ '_highlightResult', 'content',' value' ], ''), { allowedTags: [ 'em' ] })
            briefContent = (brief.length >0) ? brief : content
          }

          let writers = '文｜' + _.map(a.writers, (n)=> { return n.name } ).join('、') + ' ｜ '

          return (
            <div className="latestArticlesFull-post" key={a.id || a._id}>
              <a href={ linkStyle+a.slug+'/' } onClick={ this._handleClick }>
                <div className="latestArticlesFull-post__img" style={{ background:'url('+image+') no-repeat center center', backgroundSize:'cover' }} >
                </div>
              </a>
              <div className="latestArticlesFull-post__content">
                <a href={linkStyle+a.slug+'/'} onClick={ this._handleClick }><h2>{ a.title }</h2></a>
                <div className="latestArticlesFull-post-meta">
                  <span className="latestArticlesFull-post-meta__author">{ (_.get(a, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }</span>
                  <span className="latestArticlesFull-post-meta__date">{ dateformat(a.publishedDate, 'yyyy.mm.dd') }</span>
                </div>
                <div className="latestArticlesFull-post__brief">
                  { truncate(entities.decodeHTML(briefContent), 70) }
                </div>
              </div>
            </div>
          )
        })}
        { _.map(_.slice(sortedArticles, 3), (a)=>{
          let image = imageComposer(a).mobileImage
          //let title = sanitizeHtml( _.get(a, [ 'title' ], ''), { allowedTags: [ ] })
          let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'

          let brief = sanitizeHtml( _.get(a, [ 'brief', 'html' ], ''), { allowedTags: [ ] })
          let content = sanitizeHtml( _.get(a, [ 'content', 'html' ], ''), { allowedTags: [ ] })
          let briefContent = (brief.length >0) ? brief : content
          if ( _.has(a, '_highlightResult') ) {
            //title = sanitizeHtml( _.get(a, [ '_highlightResult', 'title', 'value' ], ''), { allowedTags: [ 'em' ] })
            brief = sanitizeHtml( _.get(a, [ '_highlightResult', 'brief', 'value' ], ''), { allowedTags: [ 'em' ] })
            content = sanitizeHtml( _.get(a, [ '_highlightResult', 'content',' value' ], ''), { allowedTags: [ 'em' ] })
            briefContent = (brief.length >0) ? brief : content
          }

          let writers = '文｜' + _.map(a.writers, (n)=> { return n.name } ).join('、') + ' ｜ '

          return (
            <div className="latestArticlesFull-post" key={a.id || a._id}>
              <a href={ linkStyle+a.slug+'/' } onClick={ this._handleClick }>
                <div className="latestArticlesFull-post__img" style={{ background:'url('+image+') no-repeat center center', backgroundSize:'cover' }} >
                </div>
              </a>
              <div className="latestArticlesFull-post__content">
                <a href={linkStyle+a.slug+'/'} onClick={ this._handleClick }><h2>{ a.title }</h2></a>
                <div className="latestArticlesFull-post-meta">
                  <span className="latestArticlesFull-post-meta__author">{ (_.get(a, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }</span>
                  <span className="latestArticlesFull-post-meta__date">{ dateformat(a.publishedDate, 'yyyy.mm.dd') }</span>
                </div>
                <div className="latestArticlesFull-post__brief">
                  { truncate(entities.decodeHTML(briefContent), 70) }
                </div>
              </div>
            </div>
          )
        })}
        { hasMore ? <MoreFull loadMore={loadMore} /> : null }
      </section>
    )
  }
}

export { LatestArticlesFull }
