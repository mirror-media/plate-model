import { Link } from 'react-router'
import { SOCIAL_LINK } from '../constants/index'
import _ from 'lodash'
import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('./FooterFull.css')
}

export default class FooterFull extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { pathName, sectionList } = this.props
    let currentSection = pathName.split('/')[2]
    let footerMenu = {}
    footerMenu.sections = []
    footerMenu.categories = []

    _.each(sectionList.sections, (s)=> {
      if(s.isFeatured) {
        footerMenu.sections.push(s)
      }
      _.each(s.categories, (c)=> {
        if(c.isFeatured) {
          footerMenu.categories.push(c)
        }
      })
    })

    return (
      <footer className="section-footer section-footer--black">
        <Link to={ '/section/' + currentSection } >
          <figure className="footer-logo" >
          <img className="" src={ '/asset/icon/section-' + 'watch' + '_s.png' } />
          </figure>
        </Link>
        <div className="footer-menu">
          { _.map(footerMenu.sections, (s)=>{
            return (
              <div className="footer-menu__item" key={ 'footer-' + s.name }>
                <Link to={ '/section/' + s.name } >{s.title}</Link>
              </div>
            )
          })}
          { _.map(footerMenu.categories, (c)=>{
            return (
              <div className="footer-menu__item" key={ 'footer-' + c.name }>
                <Link to={ '/category/' + c.name } >{c.title}</Link>
              </div>
            )
          })}
        </div>
        <div className="footer-vertDivider"></div>
        <div className="footer-subscrShare">
          <div className="footer-subscrShare__subscribe" >
            <a href={SOCIAL_LINK.SUBSCRIBE}>訂閱鏡週刊</a> - <a href={'https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam'}>廣告合作</a>
          </div>
          <div className="footer-subscrShare__horizDivider" ></div>
          <div className="footer-subscrShare__share" >
            <a className="" href={SOCIAL_LINK.FACEBOOK} ><img src="/asset/icon/facebook_white.png" className="footerFull-icon facebook" /></a>
            <a className="" href={SOCIAL_LINK.LINE} ><img src="/asset/icon/line_white.png" className="footerFull-icon line" /></a>
            <a className="" href={SOCIAL_LINK.WEIBO} ><img src="/asset/icon/weibo_white.png" className="footerFull-icon weibo" /></a>
          </div>
        </div>
      </footer>
    )
  }
}

export { FooterFull }
