/* global $ */
import { Link } from 'react-router'
import { SOCIAL_LINK } from '../constants/index'
import ga from 'react-ga'
import React, { Component } from 'react'

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
    const { pathName } = this.props
    let currentSection = pathName.split('/')[2]

    return (
      <header>
        <nav id="Header" className="HeaderFull ui menu borderless fixed top">
          <div className="left item">
            <Link>
              <img src="/asset/icon/hamburger_white.png" className="headerFull-icon hamburger" onClick={this._openSidebar}/>
            </Link>
          </div>
          <div className="item logo">
            <Link to={ '/section/' + currentSection } >
              <img src={ '/asset/icon/section-' + 'watch' + '_b.png' } />
            </Link>
          </div>
          <div className="right item">
            <Link to="/" className="desktop-only">
              <img src="/asset/icon/logo_black@2x.png" className="headerFull-icon logo" />
            </Link>
            <Link to={SOCIAL_LINK.FACEBOOK} className="desktop-only">
              <img src="/asset/icon/facebook_white.png" className="headerFull-icon facebook" />
            </Link>
            <Link to={SOCIAL_LINK.LINE} className="desktop-only">
              <img src="/asset/icon/line_white.png" className="headerFull-icon line" />
            </Link>
            <Link to={SOCIAL_LINK.WEIBO} className="desktop-only">
              <img src="/asset/icon/weibo_white.png" className="headerFull-icon weibo" />
            </Link>
            <Link onClick={this._openSearchbar} style={{ paddingLeft: '1.2em' }}>
              <img src="/asset/icon/search_white.png" className="headerFull-icon search" />
            </Link>
          </div>
        </nav>
        <nav id="HeaderBlack" className="HeaderFull ui menu borderless fixed top black">
            <div className="left item">
              <Link >
                <img src="/asset/icon/hamburger_white.png" className="headerFull-icon hamburger" onClick={this._openSidebar}/>
              </Link>
            </div>
            <div className="item logo logo--s">
              <Link to={ '/section/' + currentSection } >
                <img src={ '/asset/icon/section-' + 'watch' + '_s.png' } />
              </Link>
            </div>
            <div className="right item">
              <Link to="/" className="desktop-only">
                <img src="/asset/icon/logo_black@2x.png" className="headerFull-icon logo" />
              </Link>
              <Link to={SOCIAL_LINK.FACEBOOK} className="desktop-only">
                <img src="/asset/icon/facebook_white.png" className="headerFull-icon facebook" />
              </Link>
              <Link to={SOCIAL_LINK.LINE} className="desktop-only">
                <img src="/asset/icon/line_white.png" className="headerFull-icon line" />
              </Link>
              <Link to={SOCIAL_LINK.WEIBO} className="desktop-only">
                <img src="/asset/icon/weibo_white.png" className="headerFull-icon weibo" />
              </Link>
              <Link onClick={this._openSearchbar} style={{ paddingLeft: '1.2em' }}>
                <img src="/asset/icon/search_white.png" className="headerFull-icon search" />
              </Link>
            </div>
        </nav>
      </header>
		)
  }
}

export { HeaderFull }
