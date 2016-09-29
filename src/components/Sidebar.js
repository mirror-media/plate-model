/* global $ */
import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'

if (process.env.BROWSER) {
  require('./Sidebar.css')
}

export default class Sidebar extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    $.site('change setting', 'silent', true)  
    $('.ui.left.sidebar').sidebar('hide')  
  }

  _closeSidebar() {
    // console.log('close sidebar')
    $('.ui.left.sidebar').sidebar('toggle')
  }

  render() {
    const { sectionList } = this.props

    return (
      <div className="ui gradient-transparent-vertical backdrop left sidebar" style={{ width:'274px' }}>
        <div className="ui left" style={{ position: 'absolute', color: '#fff', fontSize: '3em', marginTop: '18px', marginLeft: '10px' }}>
          <a className="item" onClick={this._closeSidebar}><img src="/asset/icon/white@2x.png" style={{ width: '24px', height: '24px' }}/></a>
        </div>
        <div className="ui borderless vertical menu" style={{ marginLeft: '40px', marginTop: '70px !important', background: 'transparent', border: 'none', boxShadow: 'none' }}>
          { _.map(sectionList.sections, (s)=>{
            return (
              <Link to={'/section/' + s.name} key={s.id} className="item" style={{ color: '#FFF', marginBottom: '30px', fontWeight: 'normal !important' }}>
              {s.title}
              </Link>
            )
          })}
        </div>
        <div style={{ marginLeft: '40px', marginTop: '90px' }}>
          <div style={{ fontFamily: 'Noto Sans TC', fontSize: '17px', letterSpacing: '1.1px', color: 'rgba(0, 0, 0, 0.5)' }}>訂閱鏡週刊</div>
          <div style={{ width: '195px', height: '2px', border: 'solid 1px rgba(0, 0, 0, 0.5)', margin: '10px 0' }}></div>
          <div className="ui" style={{ lineHeight: '40px' }}>
            <a href="#" className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/line@2x.png" style={{ width: '56px', height: '25px' }}/></a>
            <a href="#" className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/weibo@2x.png" style={{ width: '29px', height: '25px' }}/></a>
            <a href="#" className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/facebook@2x.png" style={{ width: '25px', height: '25px' }}/></a>
            <a href="#" className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/wechat@2x.png" style={{ width: '29px', height: '25px' }}/></a>
            <a href="#" className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/instagram@2x.png" style={{ width: '25px', height: '25px' }}/></a>
            <a href="#" className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/feed@2x.png" style={{ width: '25px', height: '25px' }}/></a>
            <a href="#" className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/mail@2x.png" style={{ width: '26px', height: '25px' }}/></a>
          </div>
        </div>
      </div>
    )
  }
}

export { Sidebar }
