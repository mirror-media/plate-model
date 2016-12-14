import { imageComposer } from '../utils/index'
import _ from 'lodash'
import dateformat from 'dateformat'
import entities from 'entities'
// import ga from 'react-ga'
import MoreFull from '../components/MoreFull'
import React, { Component } from 'react'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

if (process.env.BROWSER) {
  require('./LatestStories.css')
}

export default class LatestStories extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { articles, hasMore, loadMore } = this.props
    // const { articles, categories, hasMore, loadMore } = this.props
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
          { _.map(_.take(sortedArticles, 3), (a)=>{
            let image = imageComposer(a).mobileImage
            let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'
            let brief = sanitizeHtml( _.get(a, [ 'brief', 'html' ], ''), { allowedTags: [ ] })
            let content = sanitizeHtml( _.get(a, [ 'content', 'html' ], ''), { allowedTags: [ ] })
            let briefContent = (brief.length >0) ? brief : content
            let writers = '文｜' + _.pluck(a.writers, 'name').join('、')
            if ( _.has(a, '_highlightResult') ) {
              brief = sanitizeHtml( _.get(a, [ '_highlightResult', 'brief', 'value' ], ''), { allowedTags: [ 'em' ] })
              content = sanitizeHtml( _.get(a, [ '_highlightResult', 'content',' value' ], ''), { allowedTags: [ 'em' ] })
              briefContent = (brief.length >0) ? brief : content
            }
            return (
              <div className="story-container" key={a.id || a._id}>
                <a href={ linkStyle+a.slug+'/' }>
                  <div className="story-img" style={{ background:'url('+image+') no-repeat center center', backgroundSize:'cover' }} >
                  </div>
                </a>
                <div className="story-content">
                  <div className="story-title">
                    <a href={linkStyle + a.slug + '/'}>
                      <h2>{ a.title }</h2>
                    </a>
                  </div>
                  <div className="story-meta">
                    <div className="story-author">{ (_.get(a, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }</div>
                    <div className="story-date">{ dateformat(a.publishedDate, 'yyyy.mm.dd') }</div>
                  </div>
                  <div className="story-brief">
                    { truncate(entities.decodeHTML(briefContent), 70) }
                  </div>
                </div>
              </div>
            )
          })}
          { hasMore ? <MoreFull loadMore={loadMore} /> : null }
        </div>
      </section>
    )
  }
}

export { LatestStories }
