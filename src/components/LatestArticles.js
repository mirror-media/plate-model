import React, { Component } from 'react'
import Tags from './Tags'

if (process.env.BROWSER) {
  require('./LatestArticles.css')
}

export default class LatestArticles extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { articles, device } = this.props

    return  (
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="ui text container" style={{ marginBottom: '35px', paddingLeft: '1em !important', marginLeft: '0 !important' }}>
          <div className="article-main" style={{ textAlign: 'center' }}>
            <h2 className="hot-topic"><div className="colorBlock choice"></div>最新文章<div className="blue-line" style={{ marginLeft: '16px', display:'inline-block' }}></div></h2>
          </div>
        </div>
        <Tags
          articles={articles}
          device={device}
        />
      </div>
    )
  }
}

export { LatestArticles }
