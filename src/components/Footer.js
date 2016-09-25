import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'

if (process.env.BROWSER) {
  require('./Footer.css')
}

export default class Footer extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { sectionList } = this.props

    return (
      <footer className="gradient">
        <div className="container footer">
          <div className="ui left aligned grid">
            <div className="five column row" style={{ color: '#FFF' }}>

            { _.map(sectionList.response, (s)=>{
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
          <div className="ui center aligned grid" style={{ margin:0, marginTop: '70px!important' }}>
            <div className="sixteen wide column">
              <div className="line"></div>
              <div className="subscribe" style={{ fontSize: '17px', letterSpacing: '1.1px', color: 'rgba(0, 0, 0, 0.5)' }}>訂閱鏡週刊</div>
              <div className="line-pc"></div>
              <div className="ui share">
                <a className="item" href="#" ><img src="/asset/icon/line@2x.png" style={{ width: '56px!important', height: '25px' }}/></a>
                <a className="item" href="#" ><img src="/asset/icon/weibo@2x.png" style={{ width: '29px!important', height: '25px' }}/></a>
                <a className="item" href="#" ><img src="/asset/icon/facebook@2x.png" style={{ width: '25px!important', height: '25px' }}/></a>
                <a className="item" href="#" ><img src="/asset/icon/wechat@2x.png" style={{ width: '29px!important', height: '25px' }}/></a>
                <a className="item" href="#" ><img src="/asset/icon/instagram@2x.png" style={{ width: '25px!important', height: '25px' }}/></a>
                <a className="item" href="#" ><img src="/asset/icon/feed@2x.png" style={{ width: '25px!important', height: '25px' }}/></a>
                <a className="item" href="#" ><img src="/asset/icon/mail@2x.png" style={{ width: '26px!important', height: '25px' }}/></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}
