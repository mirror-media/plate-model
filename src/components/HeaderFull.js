/* global $ */
import { SOCIAL_LINK } from '../constants/index'
import _ from 'lodash'
import React, { Component } from 'react'
import ga from 'react-ga'

if (process.env.BROWSER) {
  require('./HeaderFull.css')
}

export default class HeaderFull extends Component {
  constructor(props, context) {
    super(props, context)

    this._handleClick = this._handleClick.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
    this._openSearchbar = this._openSearchbar.bind(this)
    this._openSidebar = this._openSidebar.bind(this)
  }

  componentDidMount() {
    // detect sroll position
    window.addEventListener('scroll', this._handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll)
  }

  _handleClick() {
    ga.event({
      category: this.props.pathName,
      action: 'click',
      label: 'header'
    })
  }

  _handleScroll() {
    // Navigation Animation
    $(window).bind('scroll', function () {
      $('#Header').css('opacity', 1 - window.scrollY/60 )
      $('#HeaderBlack').css('opacity', window.scrollY/60 )
      if ($('#Header').css('opacity') == 0) { 
        $('#Header').hide() 
      }
      if ($('#Header').css('opacity') != 0) { 
        $('#Header').show() 
      }
    })
  }

  _openSearchbar() {
    $('.ui.top.sidebar')
      .sidebar({
        exclusive: true,
        scrollLock: true,
        transition: 'overlay',
        mobileTransition: 'overlay'
      }).sidebar('toggle')
  }

  _openSidebar() {
    // console.log('open sidebar')
    $('.ui.left.sidebar')
      .sidebar({
        exclusive: true,
        scrollLock: true,
        transition: 'overlay',
        mobileTransition: 'overlay'
      }).sidebar('toggle')
  }

  render() {
    const { pathName, sectionLogo } = this.props
    let logoUrl = _.get(sectionLogo, [ 'image', 'url' ]) ? _.get(sectionLogo, [ 'image', 'url' ]) : '/asset/icon/logo@3x.png'
    
    return (
      <header>
        <nav id="Header" className="nav-full">
          <div className="nav-full__hamburger">
            <a>
              <img src="/asset/icon/hamburger_white.png" className="headerFull-icon hamburger" onClick={this._openSidebar}/>
            </a>
          </div>
          <div className="nav-full__logo">
            <a href={ pathName } >
              <img src={ logoUrl } />
            </a>
          </div>
          <div className="nav-full__socialMedia">
            <a href="/" className="desktop-only">
              <img src="/asset/icon/logo_black@2x.png" className="headerFull-icon logo" />
            </a>
            <a href={SOCIAL_LINK.FACEBOOK} className="desktop-only">
              <img src="/asset/icon/facebook_white.png" className="headerFull-icon facebook" />
            </a>
            <a href={SOCIAL_LINK.LINE} className="desktop-only">
              <img src="/asset/icon/line_white.png" className="headerFull-icon line" />
            </a>
            <a href={SOCIAL_LINK.WEIBO} className="desktop-only">
              <img src="/asset/icon/weibo_white.png" className="headerFull-icon weibo" />
            </a>
            <a onClick={this._openSearchbar}>
              <img src="/asset/icon/search_white.png" className="headerFull-icon search" />
            </a>
          </div>
        </nav>
        <nav id="HeaderBlack" className="nav-full black">
          <div className="nav-full__hamburger">
            <a>
              <img src="/asset/icon/hamburger_white.png" className="headerFull-icon hamburger" onClick={this._openSidebar}/>
            </a>
          </div>
          <div className="nav-full__logo">
            <a href={ pathName } >
              <img src={ logoUrl } />
            </a>
          </div>
          <div className="nav-full__socialMedia">
            <a href="/" className="desktop-only">
              <img src="/asset/icon/logo_black@2x.png" className="headerFull-icon logo" />
            </a>
            <a href={SOCIAL_LINK.FACEBOOK} className="desktop-only">
              <img src="/asset/icon/facebook_white.png" className="headerFull-icon facebook" />
            </a>
            <a href={SOCIAL_LINK.LINE} className="desktop-only">
              <img src="/asset/icon/line_white.png" className="headerFull-icon line" />
            </a>
            <a href={SOCIAL_LINK.WEIBO} className="desktop-only">
              <img src="/asset/icon/weibo_white.png" className="headerFull-icon weibo" />
            </a>
            <a onClick={this._openSearchbar}>
              <img src="/asset/icon/search_white.png" className="headerFull-icon search" />
            </a>
          </div>
        </nav>
      </header>
		)
  }
}

export { HeaderFull }
