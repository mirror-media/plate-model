/* global $ */
import { Link } from 'react-router'
import { SOCIAL_LINK } from '../constants/index'
import _ from 'lodash'
import classNames from 'classnames'
import ga from 'react-ga'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import logo from '../../static/asset/logo.svg'

if (process.env.BROWSER) {
  require('./Header.css')
}

export default class Header extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      height: 110,
      isScrolledOver: false,
      isClickedExpandNav: false
    }
    this._getHeaderHeight = this._getHeaderHeight.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this._renderMenu = this._renderMenu.bind(this)
    this._openSidebar = this._openSidebar.bind(this)
    this._openSearchbar = this._openSearchbar.bind(this)
    this._expandNavigation = this._expandNavigation.bind(this)
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

  _handleClick() {
    ga.event({
      category: this.props.pathName,
      action: 'click',
      label: 'header'
    })
  }

  _getHeaderHeight() {
    if (ReactDOM.findDOMNode(this.refs.headerbox)) {
      const rect = ReactDOM.findDOMNode(this.refs.headerbox).getBoundingClientRect()
      this.setState({
        height: _.get(rect, 'height', 110)
      })
    }
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

  _expandNavigation() {
    if (this.state.isClickedExpandNav) {
      $('.ui.header.main.menu.menu-item')
      .css('height', '52px')
      $('.item.item-navClick')
      .text('》')
      $('.ui.header.main.menu.menu-item.mobile-hide')
      .removeClass('nav-scrolled-clicked')
      this.state.isClickedExpandNav = false
    } else {
      $('.ui.header.main.menu.menu-item')
      .css('height', 'auto')
      $('.item.item-navClick')
      .text('︽')
      $('.ui.header.main.menu.menu-item.mobile-hide')
      .addClass('nav-scrolled-clicked')
      this.state.isClickedExpandNav = true
    }
  }

  _renderMenu() {
    let status = this.state.isScrolledOver ? 'fixed top' : 'hidden'

    return (
      <div>
        <div className={ classNames('ui borderless main menu mobile-only', status) }>
          <div className="ui text container" style={{ maxWidth: 100 +'% !important', width: 100 +'%' }}>
            <div className="item" >
              <a onClick={this._openSidebar} style={{ cursor: 'pointer' }}><img src="/asset/icon/hamburger@2x.png" className="header-icon hamburger" /></a>
            </div>            
            <div className="right menu">
              <Link to="/" className="item">        
                <img className="logo" src="/asset/icon/logo@2x.png" className="header-icon logo" />
              </Link>
              <div className="item">
                <a onClick={this._openSearchbar} style={{ cursor: 'pointer' }}><img src="/asset/icon/search@2x.png" className="header-icon search" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let status = this.state.isScrolledOver ? 'fixed top nav-scrolled' : ''
    const { sectionList, topics } = this.props
    let sortedList = _.sortBy(sectionList.sections, (o)=>{ return o.sortOrder } )
    
    let itemsForHeader = {}
    itemsForHeader.topics = []
    itemsForHeader.sections = []
    itemsForHeader.categories = []

    GenerateNav()

    function GenerateNav() {
      _.each(topics.items, (t)=> { 
        if(t.isFeatured) {
          itemsForHeader.topics.push(t) 
        } 
      })
      _.each(sectionList.sections, (s)=> {
        if(s.isFeatured) {
          itemsForHeader.sections.push(s)
        } 
        _.each(s.categories, (c)=> { 
          if(c.isFeatured) {
            itemsForHeader.categories.push(c)
          } 
        })
      })
    }

    return (
      <div ref="headerbox">
        <div className="ui borderless header main menu">
          <div className="ui text container" style={{ maxWidth: 1024 +'px !important' }}>
            <Link to="/" className="header item" style={{ marginLeft: '122px' }}>        
              <img className="logo main" src={logo} />
            </Link>
            <div className="right menu">
              <div className="item share">
                <span>訂閱：</span>
                <a href={SOCIAL_LINK.LINE}><img src="/asset/icon/line@2x.png" className="header-icon line" /></a>
                <a href={SOCIAL_LINK.WEIBO}><img src="/asset/icon/weibo@2x.png" className="header-icon weibo" /></a>
                <a href={SOCIAL_LINK.FACEBOOK}><img src="/asset/icon/facebook@2x.png" className="header-icon facebook" /></a>
                <a href={SOCIAL_LINK.INSTAGRAM}><img src="/asset/icon/instagram@2x.png" className="header-icon instagram" /></a>
                <a href={SOCIAL_LINK.SUBSCRIBE}><img src="/asset/icon/book@2x.png" className="header-icon book" /></a>
                <div className="vertical line" ></div>
                <a href="#" onClick={this._openSearchbar} ><img src="/asset/icon/search@2x.png" className="header-icon search" /></a>
              </div>
              <div className="item mobile-only" style={{ marginTop: '25px' }}>
                <a href="#" onClick={this._openSearchbar} ><img src="/asset/icon/search@2x.png" className="header-icon search" /></a>
              </div>
            </div>
          </div>
        </div>
        <div className={ classNames('ui borderless header main menu menu-item mobile-hide', status) }>
          <div className="ui text container" style={{ maxWidth: 100 +'% !important', width: 100 +'%' }}>
            <div className="container" style={{ position:'relative', overflow: 'hidden' }}>
              <div className="nav-container">
                { _.map(itemsForHeader.topics, (i)=>{
                  return (
                    <Link to={'/topic/' + i.id} key={i.id} className="item nav-item" onClick={ this._handleClick }>{i.name}</Link>
                  )
                })}
                { _.map(itemsForHeader.sections, (i)=>{
                  return (
                    <Link to={'/section/' + i.name} key={i.id} className="item nav-item" onClick={ this._handleClick }>{i.title}</Link>
                  )
                })}
                { _.map(itemsForHeader.categories, (i)=>{
                  return (
                    <Link to={'/category/' + i.name} key={i.id} className="item nav-item" onClick={ this._handleClick }>{i.title}</Link>
                  )
                })}
              </div>
              <Link className={ classNames('item item-navClick') } onClick={ this._expandNavigation }>》</Link>
            </div>
          </div>
        </div>
        <div className="sections mobile-only">
          <div className="line mobile-only" />
          { _.map(sortedList, (s)=>{
            return (
              <div className="section-item" key={s.id}>
                <Link to={'/section/' + s.name} onClick={ this._handleClick }>{s.title}</Link>
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
