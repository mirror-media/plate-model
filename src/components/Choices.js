import React, { Component } from 'react'
import { Link } from 'react-router'
import _ from 'lodash'

if (process.env.BROWSER) {
  require('./Choices.css')
}

export default class Choices extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { articles } = this.props

    return articles ? (
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="ui text container" style={{ marginBottom: '35px', paddingLeft: '1em !important', marginLeft: '0 !important' }}>
          <div className="article-main" style={{ textAlign: 'center' }}>
            <h2 className="hot-topic"><div className="colorBlock choice"></div>編輯精選<div className="blue-line" style={{ marginLeft: '16px', display: 'inline-block' }}></div></h2>
          </div>
        </div>

        { _.map(articles, (a)=>{
          return (
            <div className="choice-main">
              <div className="choice-block">
                <Link to={'/news'}>
                  <div className="choice-img " style={{ background:'url(https://storage.googleapis.com/mirrormedia-dev/images/20160816131905-4c36589e1a4365cce3b96fbeaba04c70-mobile.gif) no-repeat center center', backgroundSize:'cover' }}>
                  </div>
                </Link>
                <div className="choice-cat ">
                    娛樂
                </div>
                <div className="choice-content ">
                  <Link to={'/news'}>
                    <h2>
                        {a.title}
                    </h2>
                  </Link>
                  <div className="line"></div>
                  <div className="brief">
                    Brief
                  </div>
                </div>
                <div className="choice-meta ">
                  <div className="author">
                    Author
                  </div>
                  <div className="separator">
                  </div>
                  <div className="date">
                    Date
                  </div>
                </div>
              </div>
            </div>
          )
        })}

      </div>
    ) : null
  }
}

export { Choices }
