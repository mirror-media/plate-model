import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import { SOCIAL_LINK } from '../constants/index'

if (process.env.BROWSER) {
  require('./Footer.css')
}

export default class Footer extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { sectionList } = this.props
    let sortedList = _.sortBy(sectionList.sections, (o)=>{ return o.sortOrder } )

    return (
      <footer className="gradient">
        <div className="container footer">
          <div className="ui left aligned grid">
            <div className="five column row" style={{ color: '#FFF' }}>

            { _.map(sortedList, (s)=>{
              return (

                <div className="column" key={ 'nav-' + s.name }>
                  <div className="ui list">
                    <Link to={ '/section/' + s.name } className="item section" style={{ color: '#FFF' }}>{s.title}</Link>
                    { _.map(s.categories, (c)=>{
                      return (
                        <Link to={ '/category/' + c.name }  className="item" style={{ color: '#FFF' }} key={ 'nav-' + s.name + '-' + c.name }>{c.title}</Link>
                      )
                    })}
                  </div>
                </div>

              )
            })}

            </div>
          </div>
          <div className="ui center aligned grid">
            <div className="sixteen wide column">
              <div className="divider-line"></div>
              <div className="subscribe" style={{ fontSize: '17px', letterSpacing: '1.1px', color: 'rgba(0, 0, 0, 0.5)' }}><a href={SOCIAL_LINK.SUBSCRIBE}>訂閱鏡週刊</a> - <a href={'https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam'}>廣告合作</a> - <a href={'https://www.mirrormedia.mg/category/campaign'}>活動專區</a></div>
              <div className="divider-line-pc"></div>
              <div className="ui share">
                <a className="item" href={SOCIAL_LINK.LINE} ><img src="/asset/icon/line@2x.png" className="footer-icon line" /></a>
                <a className="item" href={SOCIAL_LINK.WEIBO} ><img src="/asset/icon/weibo@2x.png" className="footer-icon weibo" /></a>
                <a className="item" href={SOCIAL_LINK.FACEBOOK} ><img src="/asset/icon/facebook@2x.png" className="footer-icon facebook" /></a>
                <a className="item" href={SOCIAL_LINK.INSTAGRAM} ><img src="/asset/icon/instagram@2x.png" className="footer-icon instagram" /></a>
                <a className="item" href={SOCIAL_LINK.FEED} ><img src="/asset/icon/feed@2x.png" className="footer-icon feed" /></a>
                <a className="item" href={SOCIAL_LINK.EMAIL} ><img src="/asset/icon/mail@2x.png" className="footer-icon mail" /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export { Footer }
