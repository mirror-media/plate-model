import { imageComposer } from '../utils/index'
import _ from 'lodash'
import React, { Component } from 'react'
import dateformat from 'dateformat'
import entities from 'entities'
import ga from 'react-ga'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

if (process.env.BROWSER) {
  require('./ChoicesFull.css')
}

export default class ChoicesFull extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick() {
    ga.event({
      category: this.props.pathName,
      action: 'click',
      label: 'choicesFull'
    })
  }

  render() {
    const { articles, authors } = this.props

    return articles ? (
      <section id="editorPicks" className="choice-section">
        <div className="section-title">
          <h2>
            <div className="colorBlock"></div>
            編輯精選 Editor's Picks
          </h2>
        </div>
        <div className="choice-post-block">
          { _.map(_.take(articles, 3), (a)=>{
            let brief = sanitizeHtml( _.get(a, [ 'brief','html' ], ''), { allowedTags: [ ] })
            let briefContent = (brief.length >0) ? brief : content
            let content = sanitizeHtml( _.get(a, [ 'content','html' ], ''), { allowedTags: [ ] })
            let image = imageComposer(a).mobileImage
            let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'
            let writersName = []
            _.map(a.writers, (w)=> { 
              writersName.push({ 'name': _.result(_.find(authors, { 'id':  w }), 'name') })
            })
            let writers = '文｜' + _.pluck(writersName, 'name').join('、') + '｜'

            return (
              <div className="post-container" key={'choiceFull' + a.id}>
                <a href={linkStyle + a.slug + '/'} onClick={ this._handleClick }>
                  <div className="editor-img" style={{ background:'url('+image+') no-repeat center center', backgroundSize:'cover' }} >
                  </div>
                </a>
                <div className="choice-post">
                  <a href={linkStyle + a.slug + '/'} onClick={ this._handleClick }>
                    <h2>{ a.title }</h2>
                  </a>
                  <div className="choice-brief">
                    <a href={linkStyle + a.slug + '/'} onClick={ this._handleClick }>{ truncate(entities.decodeHTML(briefContent), 70) }</a>
                  </div>
                  <div className="choice meta">
                    <div className="choice-author">{ (_.get(a, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }</div>
                    <div className="choice-date">{ dateformat(a.publishedDate, 'yyyy.mm.dd') }</div>
                  </div>
                </div>
              </div>
            )
          })}
          </div>
      </section>
    ) : null
  }
}

export { ChoicesFull }
