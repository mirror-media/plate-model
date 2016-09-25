import React, { Component } from 'react'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'
import entities from 'entities'
import dateformat from 'dateformat'
import { imageComposer } from '../utils/index'

if (process.env.BROWSER) {
  require('./Choices.css')
}

export default class Choices extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { articles, categories } = this.props

    return articles ? (
      <div className="container mobile-hide" style={{ marginTop: '50px' }}>
        <div className="ui text container" style={{ marginBottom: '35px', paddingLeft: '1em !important', marginLeft: '0 !important' }}>
          <div className="article-main" style={{ textAlign: 'center' }}>
            <h2 className="hot-topic"><div className="colorBlock choice"></div>編輯精選<div className="blue-line" style={{ marginLeft: '16px', display: 'inline-block' }}></div></h2>
          </div>
        </div>

        <div className="choice-main">
          { _.map(_.take(articles, 3), (a)=>{
            let image = imageComposer(a).mobileImage
            let brief = sanitizeHtml( _.get(a, [ 'brief','html' ], ''), { allowedTags: [ ] })
            let content = sanitizeHtml( _.get(a, [ 'content','html' ], ''), { allowedTags: [ ] })
            
            let briefContent = (brief.length >0) ? brief : content

            let writers = '文｜' + _.pluck(a.writers, 'name').join('、')
            let photographers = ' 攝影｜' + _.pluck(a.photographers, 'name').join('、')
            return (
              <div className="choice-block" key={'choice' + a.id}>
                <a href={'/news/' + a.slug }>
                  <div className="choice-img " style={{ background:'url('+image+') no-repeat center center', backgroundSize:'cover' }}>
                  </div>
                </a>
                <div className="choice-cat ">
                    { _.get(categories, [ _.first(a.categories), 'title' ]) }
                </div>
                <div className="choice-content ">
                  <a href={'/news/' + a.slug }>
                    <h2>
                        {a.title}
                    </h2>
                  </a>
                  <div className="line"></div>
                  <div className="brief">
                    { truncate(entities.decodeHTML(briefContent), 200) }
                  </div>
                </div>
                <div className="choice-meta ">
                  <div className="author">
                    { writers }
                    { (a.photographers.length > 0) ? photographers : null }
                  </div>
                  <div className="separator">
                  </div>
                  <div className="date">
                    { dateformat(a.publishedDate, 'yyyy.mm.dd') }
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="ui three column stackable grid">
          
          { _.map(_.slice(articles, 3), (a)=>{
            let image = imageComposer(a).mobileImage
            let brief = sanitizeHtml( _.get(a, [ 'brief','html' ], ''), { allowedTags: [ ] })
            let content = sanitizeHtml( _.get(a, [ 'content','html' ], ''), { allowedTags: [ ] })
            
            let briefContent = (brief.length >0) ? brief : content

            let writers = '文｜' + _.pluck(a.writers, 'name').join('、')

            return (
              <div className="column" style={{ padding: 0 }} key={'choice' + a.id}>
                <div className="choice-block">
                  <a href={'/news/' + a.slug }><div className="column-choice-img" style={{ background:'url('+image+') no-repeat center center', backgroundSize:'cover' }}>
                    <div className="choice-cat">
                      { _.get(categories, [ _.first(a.categories), 'title' ]) }
                    </div>
                  </div></a>
                  <div className="column-choice-content">
                    <a href={'/news/' + a.slug }><h2>{ a.title }</h2></a>
                    <div className="line"></div>
                    <div className="brief">
                      { truncate(entities.decodeHTML(briefContent), 75) }
                    </div>
                  </div>
                  <div className="column-choice-meta">
                    <div className="author">
                      { writers }
                    </div>
                    <div className="separator"></div>
                    <div className="date">
                      { dateformat(a.publishedDate, 'yyyy.mm.dd') }</div>
                  </div>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    ) : null
  }
}

export { Choices }
