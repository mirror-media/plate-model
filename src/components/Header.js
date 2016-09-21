import React, { Component } from 'react'
import logo from '../../static/asset/logo.svg'

if (process.env.BROWSER) {
  require('./Header.css')
}

export default class Header extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {

    return (
      <div className="ui borderless menu" style={{ backgroundColor: '#F5F5F5', border: 'none', boxShadow: 'none', margin:'0', height:'110px', paddingBottom: '5px' }}>
        <div className="ui text container" style={{ maxWidth: 1024 +'px !important' }}>
          <a href="/" className="header item" style={{ marginLeft: '122px' }}>
            <img className="logo small" src={logo} style={{ width:'128px' }} />
          </a>

          <div className="right menu">
            <div className="item share" style={{ fontFamily: 'SourceHanSansTWHK-Normal', fontSize: '15px', letterSpacing: '0.7px', color: 'rgba(0, 0, 0, 0.3)', marginTop: '10px' }}>
              <span>訂閱：</span>
              <a href="#" ><img src="/asset/icon/line@2x.png"      style={{ width: '56px!important', height: '25px' }}/></a>
              <a href="#" ><img src="/asset/icon/weibo@2x.png"     style={{ width: '29px!important', height: '25px' }}/></a>
              <a href="#" ><img src="/asset/icon/facebook@2x.png"  style={{ width: '25px!important', height: '25px' }}/></a>
              <a href="#" ><img src="/asset/icon/wechat@2x.png"    style={{ width: '29px!important', height: '25px' }}/></a>
              <div className="vertical line" />
              <a href="#" ><img src="/asset/icon/search@2x.png"    style={{ width: '24px!important', height: '24px' }}/></a>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export { Header }
