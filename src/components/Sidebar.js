/* global $ */
import { SOCIAL_LINK } from '../constants/index'
import _ from 'lodash'
import ga from 'react-ga'
import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('./Sidebar.css')
}

export default class Sidebar extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
  }

  componentDidMount() {
    // console.log('componentDidMount')
    $.site('change setting', 'silent', true)  
    
    $('.ui.left.sidebar').sidebar('hide')
    $('.closeSidebar').click( function () { 
      $('.ui.left.sidebar').sidebar('hide')
    })
    
    $('input.search').parent().submit( function ( event ) {
      $(location).attr('href', '/search/'+$('input.search').val())
      event.preventDefault()
    })
    $('.closeSearchSidebar').click( function () { 
      $('.ui.top.sidebar').sidebar('hide')
    })
  }

  _closeSidebar() {
    // console.log('close sidebar')
    $('.ui.left.sidebar').sidebar('toggle')
  }

  _handleClick() {
    ga.event({
      category: this.props.pathName,
      action: 'click',
      label: 'sidebar'
    })
  }

  render() {
    const { sectionList, topics } = this.props

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
      <div>
      <div className="ui top sidebar">
        <div className="ui transparent input searchbar" style={{ maxWidth: '100%', paddingRight: '60px', width: '100%' }}>
          <div className="close closeSearchSidebar"><img src="/asset/icon/blue@2x.png" className="sidebar-icon blue" /></div>
          <form style={{ width: '100%' }}>
            <input className="search" type="text" style={{ textAlign: 'right' }} placeholder="搜尋" />
          </form>
        </div>
      </div>
        <div className="ui gradient-transparent-vertical backdrop left sidebar" style={{ width:'274px' }}>
          <div className="ui left" style={{ position: 'absolute', color: '#fff', fontSize: '3em', marginTop: '18px', marginLeft: '10px' }}>
            <a className="item closeSidebar" onClick={this._closeSidebar}><img src="/asset/icon/white@2x.png" className="sidebar-icon white" /></a>
          </div>
          <div className="ui borderless vertical menu" style={{ marginLeft: '40px', marginTop: '70px !important', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            { _.map(itemsForHeader.topics, (i)=>{
              return (
                <a href={'/topic/' + i.id} key={i.id} className="item" onClick={ this._handleClick } style={{ color: '#FFF', marginBottom: '30px', fontWeight: 'normal !important' }}>{i.name}</a>
              )
            })}
            { _.map(itemsForHeader.sections, (i)=>{
              return (
                <a href={'/section/' + i.name} key={i.id} className="item" onClick={ this._handleClick } style={{ color: '#FFF', marginBottom: '30px', fontWeight: 'normal !important' }}>{i.title}</a>
              )
            })}
            { _.map(itemsForHeader.categories, (i)=>{
              return (
                <a href={'/category/' + i.name} key={i.id} className="item" onClick={ this._handleClick } style={{ color: '#FFF', marginBottom: '30px', fontWeight: 'normal !important' }}>{i.title}</a>
              )
            })}
          </div>
          <div style={{ marginLeft: '40px', marginTop: '90px' }}>
            <div style={{ fontFamily: 'Noto Sans TC', fontSize: '17px', letterSpacing: '1.1px', color: 'rgba(0, 0, 0, 0.5)' }}>訂閱鏡週刊</div>
            <div style={{ width: '195px', height: '2px', border: 'solid 1px rgba(0, 0, 0, 0.5)', margin: '10px 0' }}></div>
            <div className="ui" style={{ lineHeight: '40px' }}>
              <a href={SOCIAL_LINK.LINE} className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/line@2x.png" className="sidebar-icon line" /></a>
              <a href={SOCIAL_LINK.WEIBO} className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/weibo@2x.png" className="sidebar-icon weibo" /></a>
              <a href={SOCIAL_LINK.FACEBOOK} className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/facebook@2x.png" className="sidebar-icon facebook" /></a>
              <a href={SOCIAL_LINK.INSTAGRAM} className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/instagram@2x.png" className="sidebar-icon instagram" /></a>
              <a href={SOCIAL_LINK.FEED} className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/feed@2x.png" className="sidebar-icon feed" /></a>
              <a href={SOCIAL_LINK.EMAIL} className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/mail@2x.png" className="sidebar-icon mail" /></a>
              <a href={SOCIAL_LINK.SUBSCRIBE} className="item" style={{ marginRight: '25px' }}><img src="/asset/icon/book@2x.png" className="sidebar-icon book" /></a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export { Sidebar }
