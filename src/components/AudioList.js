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
            //let image = imageComposer(a).mobileImage
            let title = _.get(a, [ 'title' ], '')
            // let brief = sanitizeHtml( _.get(a, [ 'description', 'html' ], ''), { allowedTags: [ ] })
            

            // return (
            //   <div className="latest-block" key={a.id || a._id} >
            //     <a href={link}>
            //       <div className="latest-img" style={{ background: 'url('+image+') no-repeat center center', backgroundSize:'cover' }}>
            //       </div>
            //     </a>
            //     <div className="latest-content">
            //       <a href={link}>
            //         <h2>
            //             <span dangerouslySetInnerHTML={{ __html: title }}/><div className="cat-label"><div className="separator"></div><span>Audio</span></div>
            //         </h2>
            //       </a>
            //       <div className="line">
            //       </div>
            //       <div className="brief">
            //         {truncate(brief, 75)}
            //       </div>
            //     </div>
            //   </div>
            // )
            return (
              <div className="audio-box" key={a.id || a._id}>
                  <div className="audio-container ">
                      <div className="audio-time"><span className="left">00:00</span> / 07:42</div>
                      <div className="audio-progress">
                          <div className="bar"></div>
                      </div>
                      <div className="audio-cover">
                          <div className="audio-btn pause"></div>
                      </div>
                      <div className="audio-title"><span dangerouslySetInnerHTML={{ __html: title }}/></div>
                      <div className="audio-desc"></div>
                      <audio src="https://www.mirrormedia.mg/assets/audios/20161104173058-faca0aa139dba138532140a11957e7ef.wav"> </audio>
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

export { AudioList }
