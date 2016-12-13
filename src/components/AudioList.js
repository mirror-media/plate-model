import AudioBox from './AudioBox'
import More from '../components/More'
import React, { Component } from 'react'
import _ from 'lodash'

if (process.env.BROWSER) {
  require('./LatestArticles.css')
  require('./AudioList.css')
}

export default class AudioList extends Component {
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
    const { audios, hasMore, loadMore } = this.props

    return  (
      <div className="container audioList">
        {this.renderTitle()}
        <div className="latest">

          { _.map(audios, (a)=>{

            let id = _.get(a, [ 'audio', 'id' ] )
            let title = _.get(a, [ 'title' ], '')
            let url = _.get(a, [ 'audio', 'url' ] )
            let cover = _.get(a, [ 'coverPhoto', 'image', 'resizedTargets', 'tiny', 'url' ] )

            return (
              <AudioBox id={id} title={title} url={url} cover={cover} key={a.id || a._id} />
            )
          })}

        </div>
        {hasMore ? <More loadMore={loadMore} /> : null}
      </div>
    )
  }
}

export { AudioList }
