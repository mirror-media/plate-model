import React, { Component } from 'react'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'
import entities from 'entities'
import { imageComposer } from '../utils/index'
import More from '../components/More'
import ga from 'react-ga'
import { AdSlot } from 'react-dfp'
import { DFPID } from '../constants/index'

if (process.env.BROWSER) {
  require('./LatestArticles.css')
}

export default class LatestArticles extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
    this.renderAD = this.renderAD.bind(this)
  }

  renderAD() {
    return (
      <div className="computer-hide" style={ { margin: '0 auto', 'marginBottom': '20px', 'maxWidth': '300px' } }>
        <AdSlot sizes={ [ [ 300, 250 ] ] }
          dfpNetworkId={DFPID}
          slotId={ 'mm_mobile_hp_300x250_L1' } 
          adUnit={ 'mm_mobile_hp_300x250_L1' } 
          sizeMapping={
            [ 
              { viewport: [   1,   1 ], sizes: [ [ 300, 250 ] ] },
              { viewport: [ 970, 200 ], sizes: [ ]  }
            ] 
          }
        />
      </div>
    )
  }

  _handleClick() {
    ga.event({
      category: 'home',
      action: 'click',
      label: 'latestArticles'
    })
  }

  render() {
    const { articles, categories, authors, title, hasMore, loadMore } = this.props
    let sortedArticles = _.sortBy(articles, function (o) { return new Date(o.publishedDate) }).reverse()

    return  (
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="ui text container" style={{ marginBottom: '35px', paddingLeft: '1em !important', marginLeft: '0 !important' }}>
          <div className="article-main" style={{ textAlign: 'center' }}>
            <h2 className="hot-topic"><div className="colorBlock choice"></div><span>{title}</span><div className="blue-line" style={{ marginLeft: '16px', display:'inline-block' }}></div></h2>
          </div>
        </div>
        <div className="latest">

          { _.map(_.take(sortedArticles, 5), (a)=>{
            
            let image = imageComposer(a).mobileImage
            let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'

            let brief = sanitizeHtml( _.get(a, [ 'brief','html' ], ''), { allowedTags: [ ] })
            let content = sanitizeHtml( _.get(a, [ 'content','html' ], ''), { allowedTags: [ ] })
            let briefContent = (brief.length >0) ? brief : content

            let writers = '文｜' + _.map(a.writers, 'name').join('、')
            let photographers = ' 攝影｜' + _.map(a.photographers, (n)=>{ return _.get(authors, [ n, 'name' ], null) }).join('、')
            let designers = ' 設計｜' + _.map(a.designers, (n)=>{ return _.get(authors, [ n, 'name' ], null) }).join('、')
            let engineers = ' 工程｜' + _.map(a.engineers, (n)=>{ return _.get(authors, [ n, 'name' ], null) }).join('、')

            return (
              <div className="latest-block" key={a.id} >
                <a href={linkStyle+a.slug+'/'}>
                  <div className="latest-img" style={{ background: 'url('+image+') no-repeat center center', backgroundSize:'cover' }}>
                  </div>
                </a>
                <div className="latest-content">
                  <a href={linkStyle+a.slug+'/'}>
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
          {this.renderAD()}
          { _.map(_.slice(sortedArticles, 5), (a)=>{
            
            let image = imageComposer(a).mobileImage
            let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'

            let brief = sanitizeHtml( _.get(a, [ 'brief','html' ], ''), { allowedTags: [ ] })
            let content = sanitizeHtml( _.get(a, [ 'content','html' ], ''), { allowedTags: [ ] })
            let briefContent = (brief.length >0) ? brief : content

            let writers = '文｜' + _.map(a.writers, 'name').join('、')
            let photographers = ' 攝影｜' + _.map(a.photographers, (n)=>{ return _.get(authors, [ n, 'name' ], null) }).join('、')
            let designers = ' 設計｜' + _.map(a.designers, (n)=>{ return _.get(authors, [ n, 'name' ], null) }).join('、')
            let engineers = ' 工程｜' + _.map(a.engineers, (n)=>{ return _.get(authors, [ n, 'name' ], null) }).join('、')

            return (
              <div className="latest-block" key={a.id} >
                <a href={linkStyle+a.slug+'/'} onClick={ this._handleClick }>
                  <div className="latest-img" style={{ background: 'url('+image+') no-repeat center center', backgroundSize:'cover' }}>
                  </div>
                </a>
                <div className="latest-content">
                  <a href={linkStyle+a.slug+'/'} onClick={ this._handleClick }>
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
