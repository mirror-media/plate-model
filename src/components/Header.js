/* global $ */
import { SOCIAL_LINK } from '../constants/index'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { Link } from 'react-router'
import _ from 'lodash'

import logo from '../../static/asset/logo.svg'

if (process.env.BROWSER) {
  require('./Header.css')
}

export default class Header extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      height: 110,
      isScrolledOver: false
    }
    this._getHeaderHeight = this._getHeaderHeight.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
    this._renderMenu = this._renderMenu.bind(this)
    this._openSidebar = this._openSidebar.bind(this)
    this._openSearchbar = this._openSearchbar.bind(this)

  }

  componentDidMount() {
    this._getHeaderHeight()
    window.addEventListener('resize', this._getHeaderHeight)

    // detect sroll position
    window.addEventListener('scroll', this._handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll)
  }

  _handleScroll() {
    const scrollPos = window.scrollY
    if(scrollPos > this.state.height && !this.state.isScrolledOver) {
      this.setState({ isScrolledOver: true })
    } else if(scrollPos <= this.state.height && this.state.isScrolledOver) {
      this.setState({ isScrolledOver: false })
    }
  }

  _getHeaderHeight() {
    const rect = ReactDOM.findDOMNode(this.refs.headerbox).getBoundingClientRect()
    this.setState({
      height: _.get(rect, 'height', 110)
    })
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line
    if(nextState.height !== this.state.height ||
       nextState.isScrolledOver !== this.state.isScrolledOver) {
      return true
    }
    return true
  }

  _openSidebar() {
    // console.log('open sidebar')
    $('.ui.left.sidebar')
      .sidebar({
        dimPage: false,
        exclusive: true,
        scrollLock: true,
        transition: 'overlay',
        mobileTransition: 'overlay'
      }).sidebar('toggle')
  }

  _openSearchbar() {
    // console.log('open sidebar')
    $('.ui.top.sidebar')
      .sidebar({
        dimPage: false,
        exclusive: true,
        scrollLock: true,
        transition: 'overlay',
        mobileTransition: 'overlay'
      }).sidebar('toggle')
  }

  _renderMenu() {
    let status = this.state.isScrolledOver ? 'fixed top' : 'hidden'
    const { sectionList } = this.props
    let sortedList = _.sortBy(sectionList.sections, (o)=>{ return o.sortOrder } )

    return (
      <div>
        <div className={ classNames('ui borderless main menu mobile-hide', status) }>
          <div className="ui text container" style={{ maxWidth: 100 +'% !important', width: 100 +'%' }}>
            <Link to="/" className="header item" style={{ marginLeft: '42px' }}>        
              <img className="logo small" src={logo} style={{ width:'96px !important' }} />
            </Link>
              { _.map(sortedList, (s)=>{
                return (
                  <Link to={'/section/' + s.name} key={s.id} className="item">{s.title}</Link>
                )
              })}
            <div className="right menu">
              <div className="item" style={{ marginTop: '10px', paddingRight: '42px' }}>
                <a onClick={this._openSearchbar} style={{ cursor: 'pointer' }}><img src="/asset/icon/search@2x.png"    style={{ width: '24px!important', height: '24px' }}/></a>
              </div>
            </div>
          </div>
        </div>
        <div className={ classNames('ui borderless main menu mobile-only', status) }>
          <div className="ui text container" style={{ maxWidth: 100 +'% !important', width: 100 +'%' }}>
            <div className="item" >
              <a onClick={this._openSidebar} style={{ cursor: 'pointer' }}><img src="/asset/icon/hamburger@2x.png" style={{ width: '24px', height: '24px' }}/></a>
            </div>            
            <div className="right menu">
              <Link to="/" className="item">        
                <img className="logo" src="/asset/icon/logo@2x.png" style={{ width: '24px', height: '24px' }} />
              </Link>
              <div className="item">
                <a onClick={this._openSearchbar} style={{ cursor: 'pointer' }}><img src="/asset/icon/search@2x.png" style={{ width: '24px', height: '24px' }}/></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { sectionList } = this.props
    let sortedList = _.sortBy(sectionList.sections, (o)=>{ return o.sortOrder } )

    return (
      <div ref="headerbox">
        <div className="ui borderless header main menu">

          <div className="ui text container" style={{ maxWidth: 1024 +'px !important' }}>
            <Link to="/" className="header item" style={{ marginLeft: '122px' }}>        
              <img className="logo" src={logo} />
            </Link>
            <div className="right menu">
              <div className="item share" style={{ fontFamily: 'Noto Sans TC, sans-serif', fontSize: '15px', letterSpacing: '0.7px', color: 'rgba(0, 0, 0, 0.3)', marginTop: '10px' }}>
                <span>訂閱：</span>
                <a href={SOCIAL_LINK.LINE}><img src="/asset/icon/line@2x.png"      style={{ width: '45px!important', height: '20px' }}/></a>
                <a href={SOCIAL_LINK.WEIBO}><img src="/asset/icon/weibo@2x.png"     style={{ width: '23px!important', height: '20px' }}/></a>
                <a href={SOCIAL_LINK.FACEBOOK}><img src="/asset/icon/facebook@2x.png"  style={{ width: '20x!important', height: '20px' }}/></a>
                <a href={SOCIAL_LINK.INSTAGRAM}><img src="/asset/icon/instagram@2x.png"    style={{ width: '20px!important', height: '20px' }}/></a>
                <div className="vertical line" ></div>
                <a href="#" onClick={this._openSearchbar} ><img src="/asset/icon/search@2x.png"    style={{ width: '24px!important', height: '24px' }}/></a>
              </div>
              <div className="item mobile-only" style={{ marginTop: '25px' }}>
                <a href="#" onClick={this._openSearchbar} ><img src="/asset/icon/search@2x.png"    style={{ width: '24px!important', height: '24px' }}/></a>
              </div>
            </div>
          </div>
        </div>
        <div className="sections mobile-only">
          <div className="line mobile-only" />
          { _.map(sortedList, (s)=>{
            return (
              <div className="section-item" key={s.id}>
                <Link to={'/section/' + s.name}>{s.title}</Link>
              </div>
            )
          })}
        </div>
        {this._renderMenu()}
      </div>
    )
  }
}

export { Header }
