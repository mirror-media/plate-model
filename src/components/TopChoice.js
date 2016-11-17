import React, { Component } from 'react'
import _ from 'lodash'
import { imageComposer } from '../utils/index'
import ga from 'react-ga'

if (process.env.BROWSER) {
  require('./Choices.css')
}

export default class TopChoice extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick() {
    ga.event({
      category: 'home',
      action: 'click',
      label: 'topChoice'
    })
  }

  render() {
    const { article, categories } = this.props
    let a = article
    let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'
    let image = imageComposer(a).mobileImage
    return a ? (
      <div className="container tablet-hide computer-hide">
        <div className="choice-main">
          <div className="choice-block" key={'choice' + a.id}>
            <a href={linkStyle + a.slug + '/'} onClick={ this._handleClick }>
              <div className="choice-img " style={{ background:'url('+image+') no-repeat center center', backgroundSize:'cover' }}>
              </div>
            </a>
            <div className="choice-title">
                編輯精選
            </div>
            <div className="choice-cat ">
                { _.get(categories, [ _.first(a.categories), 'title' ], '　　') }
            </div>
            <div className="choice-content ">
              <a href={linkStyle + a.slug + '/'} onClick={ this._handleClick }>
                <h2>
                    {a.title}
                </h2>
              </a>
            </div>
          </div>
        </div>
      </div>
    ) : null
  }
}

export { TopChoice }
