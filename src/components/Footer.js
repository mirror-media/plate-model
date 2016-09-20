// import { PHOTOGRAPHY, copyrightTypes, donatePath } from '../constants/index'
import { PHOTOGRAPHY } from '../constants/index'
import classNames from 'classnames'
// import logoFB from '../../static/asset/icon-facebook.svg'
// import logoGithub from '../../static/asset/icon-github.svg'
// import logoIcon from '../../static/asset/logo-mobile.svg'
// import logoIG from '../../static/asset/icon-instagram.svg'
// import logoLine from '../../static/asset/icon-line.svg'
// import logoRss from '../../static/asset/icon-rss.svg'
// import logoCC from '../../static/asset/icon-cc.svg'
// import whiteLogIcon from '../../static/asset/logo-white.svg'
import React, { Component } from 'react'
import styles from './Footer.scss'

export default class Footer extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    // const { copyright, theme } = this.props
    const { theme } = this.props
    // let copyrightObj = copyrightTypes.default

    // if (copyright === 'Copyrighted') {
    //   copyrightObj = copyrightTypes.copyrighted
    // } else if (copyright === 'Creative-Commons') {
    //   copyrightObj = copyrightTypes.creativeCommons
    // }

    // let copyrightString = copyrightObj.string
    // let copyrightImg = copyrightObj.image ? <img className={styles['cc-image']} src={logoCC} /> : null
    // let copyrightLink = copyrightObj.link ?
    //                 (<a href={copyrightObj.link} rel="license" target="_blank" className={styles['cc-license']}>
    //                   {copyrightImg}
    //                   <p className={styles['license-text']}> {copyrightString} </p>
    //                   </a>) : <p className={styles['license-text']}> {copyrightString} </p>

    return (
      <footer className={classNames(styles['footer'], { [styles['photography-theme']]: theme === PHOTOGRAPHY })}>
        <div className="ui text container footer">
          <div className="ui center aligned grid" style={{ margin:0 }}>
            <div className="sixteen wide column">
              <div className="ui divider"></div>
              <div style={{ fontSize: '17px', letterSpacing: '1.1px', color: 'rgba(0, 0, 0, 0.5)', marginBottom:'20px' }}>訂閱鏡週刊</div>
              <div className="ui">
                <a className="item" href="#" style={{ color: 'rgba(0,0,0,0.3)', fontSize: '1.5em', paddingRight: '0.6em' }}><i className="weibo icon"></i></a>
                <a className="item" href="#" style={{ color: 'rgba(0,0,0,0.3)', fontSize: '1.5em', paddingRight: '0.6em' }}><i className="facebook f icon"></i></a>
                <a className="item" href="#" style={{ color: 'rgba(0,0,0,0.3)', fontSize: '1.5em', paddingRight: '0.6em' }}><i className="wechat icon"></i></a>
                <a className="item" href="#" style={{ color: 'rgba(0,0,0,0.3)', fontSize: '1.5em', paddingRight: '0.6em' }}><i className="instagram icon"></i></a>
                <a className="item" href="#" style={{ color: 'rgba(0,0,0,0.3)', fontSize: '1.5em', paddingRight: '0.6em' }}><i className="feed icon"></i></a>
                <a className="item" href="#" style={{ color: 'rgba(0,0,0,0.3)', fontSize: '1.5em' }}><i className="mail icon"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}
