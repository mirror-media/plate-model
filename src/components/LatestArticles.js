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

export default class LatestArticles extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { articles, categories, authors, title, hasMore, loadMore } = this.props
    let sortedArticles = _.sortBy(articles, function (o) { return new Date(o.publishedDate) }).reverse()

    return  (
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="ui text container" style={{ marginBottom: '35px', paddingLeft: '1em !important', marginLeft: '0 !important' }}>
          <div className="article-main" style={{ textAlign: 'center' }}>
            <h2 className="hot-topic"><div className="colorBlock choice"></div>{title}<div className="blue-line" style={{ marginLeft: '16px', display:'inline-block' }}></div></h2>
          </div>
        </div>
        <div className="latest">

          { _.map(sortedArticles, (a)=>{
            let image = imageComposer(a).mobileImage
            let brief = sanitizeHtml( _.get(a, [ 'brief','html' ], ''), { allowedTags: [ ] })
            let content = sanitizeHtml( _.get(a, [ 'content','html' ], ''), { allowedTags: [ ] })
            
            let briefContent = (brief.length >0) ? brief : content

            let writers = '文｜' + _.map(a.writers, 'name').join('、')
            let photographers = ' 攝影｜' + _.map(a.photographers, (n)=>{ return _.get(authors, [ n, 'name' ], null) }).join('、')
            let designers = ' 設計｜' + _.map(a.designers, (n)=>{ return _.get(authors, [ n, 'name' ], null) }).join('、')
            let engineers = ' 工程｜' + _.map(a.engineers, (n)=>{ return _.get(authors, [ n, 'name' ], null) }).join('、')

            return (
              <div className="latest-block" key={a.id} >
                <a href={'/story/'+a.slug}>
                  <div className="latest-img" style={{ background: 'url('+image+') no-repeat center center', backgroundSize:'cover' }}>
                  </div>
                </a>
                <div className="latest-content">
                  <a href={'/story/'+a.slug}>
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
                    { (_.get(a, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }
                    { (_.get(a, [ 'photographers', 'length' ], 0) > 0) ? photographers+' ' : null }
                    { (_.get(a, [ 'designers', 'length' ], 0) > 0) ? designers+' ' : null }
                    { (_.get(a, [ 'engineers', 'length' ], 0) > 0) ? engineers+' ' : null }
                    { _.get(a, 'extendByline', null) }
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

export { LatestArticles }
