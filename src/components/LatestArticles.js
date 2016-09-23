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
        <div className="related">
          <div className="related-block">
            <a href="/news/57cfadb581445bef12e8d751">
              <div className="related-img" style={{ background: 'url(https://storage.googleapis.com/mirrormedia-dev/images/20160816131905-4c36589e1a4365cce3b96fbeaba04c70-mobile.gif) no-repeat center center', backgroundSize:'cover' }}>
              </div>
            </a>
            <div className="related-date">
              2016.09.07
            </div>
            <div className="related-content">
              <a href="/news/57cfadb581445bef12e8d751">
                <h2>
                    聯準會牽動新興市場資金流向
                </h2>
              </a>
              <div className="line">
              </div>
              <div className="brief">
                聯準會主席葉倫將在美國時間26日，於Jackson Hole全球央行年會中發表演說，一般預料葉倫將不...
              </div>
              <div className="author">
                Author
              </div>
              <div className="related-cat">
                新聞/人物
              </div>
            </div>
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
