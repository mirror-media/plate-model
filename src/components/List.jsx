import React, { Component } from 'react'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'
import entities from 'entities'
import { imageComposer } from '../utils/index'
import More from '../components/More'

if (process.env.BROWSER) {
  require('./LatestArticles.css')
}

export default class List extends Component {
  constructor(props, context) {
    super(props, context)
    this.renderTitle = this.renderTitle.bind(this)
  }

  renderTitle() {
    let title = _.get(this.props, 'title')

    return title ? (
        <div className="ui text container" style={{ marginBottom: '35px', paddingLeft: '1em !important', marginLeft: '0 !important' }}>
          <div className="article-main" style={{ textAlign: 'center' }}>
            <h2 className="hot-topic"><div className="colorBlock choice"></div>{title}<div className="blue-line" style={{ marginLeft: '16px', display:'inline-block' }}></div></h2>
          </div>
        </div>
    ) : null
  }

  render() {
    const { articles, categories, hasMore, loadMore } = this.props
    let sortedArticles = _.sortBy(articles, function (o) { return new Date(o.publishedDate) }).reverse()

    return  (
      <div className="container">
        {this.renderTitle()}
        <div className="latest">

          { _.map(sortedArticles, (a)=>{
            let image = imageComposer(a).mobileImage
            let title = sanitizeHtml( _.get(a, [ 'title' ], ''), { allowedTags: [ ] })
            let brief = sanitizeHtml( _.get(a, [ 'brief', 'html' ], ''), { allowedTags: [ ] })
            let content = sanitizeHtml( _.get(a, [ 'content', 'html' ], ''), { allowedTags: [ ] })
            let briefContent = (brief.length >0) ? brief : content
            if ( _.has(a, '_highlightResult') ) {
              title = sanitizeHtml( _.get(a, [ '_highlightResult', 'title', 'value' ], ''), { allowedTags: [ 'em' ] })
              brief = sanitizeHtml( _.get(a, [ '_highlightResult', 'brief', 'value' ], ''), { allowedTags: [ 'em' ] })
              content = sanitizeHtml( _.get(a, [ '_highlightResult', 'content',' value' ], ''), { allowedTags: [ 'em' ] })
              briefContent = (brief.length >0) ? brief : content
            }

            return (
              <div className="latest-block" key={a.id || a._id} >
                <a href={'/story/'+a.slug}>
                  <div className="latest-img" style={{ background: 'url('+image+') no-repeat center center', backgroundSize:'cover' }}>
                  </div>
                </a>
                <div className="latest-content">
                  <a href={'/story/'+a.slug}>
                    <h2>
                        <span dangerouslySetInnerHTML={{__html: title }}/><div className="cat-label"><div className="separator"></div><span>{ _.get(a, [ 'categories', 0, 'title' ], '') }</span></div>
                    </h2>
                  </a>
                  <div className="line">
                  </div>
                  <div className="brief">
                    <div dangerouslySetInnerHTML={{__html: truncate(entities.decodeHTML(briefContent), 75) }}/>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {hasMore ? <More loadMore={loadMore} /> : null}
      </div>
    )
  }
}

export { List }
