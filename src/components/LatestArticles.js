import React, { Component } from 'react'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'
import entities from 'entities'

if (process.env.BROWSER) {
  require('./LatestArticles.css')
}

export default class LatestArticles extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { articles, categories } = this.props

    return  (
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="ui text container" style={{ marginBottom: '35px', paddingLeft: '1em !important', marginLeft: '0 !important' }}>
          <div className="article-main" style={{ textAlign: 'center' }}>
            <h2 className="hot-topic"><div className="colorBlock choice"></div>最新文章<div className="blue-line" style={{ marginLeft: '16px', display:'inline-block' }}></div></h2>
          </div>
        </div>
        <div className="latest">

          { _.map(articles, (a)=>{

            let brief = sanitizeHtml( _.get(a, [ 'brief','html' ], ''), { allowedTags: [ ] })
            let content = sanitizeHtml( _.get(a, [ 'content','html' ], ''), { allowedTags: [ ] })
            
            let briefContent = (brief.length >0) ? brief : content

            let writers = '文｜' + _.pluck(a.writers, 'name').join('、')
            let photographers = ' 攝影｜' + _.pluck(a.photographers, 'name').join('、')

            return (
              <div className="latest-block" key={a.id} >
                <a href={'/news/'+a.slug}>
                  <div className="latest-img" style={{ background: 'url(https://storage.googleapis.com/mirrormedia-dev/images/20160816131905-4c36589e1a4365cce3b96fbeaba04c70-mobile.gif) no-repeat center center', backgroundSize:'cover' }}>
                  </div>
                </a>
                <div className="latest-content">
                  <a href={'/news/'+a.slug}>
                    <h2>
                        {a.title}<div className="cat-label"><div className="separator"></div><span>{ _.get(categories, [ _.first(a.categories), 'title' ]) }</span></div>
                    </h2>
                  </a>
                  <div className="line">
                  </div>
                  <div className="brief">
                    { truncate(entities.decodeHTML(briefContent), 75) }
                  </div>
                  <div className="author">
                    { writers }
                    { (a.photographers.length > 0) ? photographers : null }
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export { LatestArticles }
