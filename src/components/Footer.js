import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('./Footer.css')
}

export default class Footer extends Component {
  constructor(props) {
    super(props)
  }
  render() {

    return (
      <footer className="gradient">
        <div className="container footer">
          <div className="ui left aligned grid">
            <div className="five column row" style={{ color: '#FFF' }}>

            
              <div className="column">
                <div className="ui list">
                  <a href="/section/popular" className="item section" style={{ color: '#FFF' }}>漫熱遊</a>
                    <a href="/category/news"  className="item" style={{ color: '#FFF' }}>新聞</a>
                    <a href="/category/financial"  className="item" style={{ color: '#FFF' }}>財經</a>
                    <a href="/category/people"  className="item" style={{ color: '#FFF' }}>人物</a>
                    <a href="/category/livestream"  className="item" style={{ color: '#FFF' }}>直播</a>
                </div>
              </div>
            
              <div className="column">
                <div className="ui list">
                  <a href="/section/News" className="item section" style={{ color: '#FFF' }}>新聞/人物</a>
                    <a href="/category/news"  className="item" style={{ color: '#FFF' }}>新聞</a>
                    <a href="/category/financial"  className="item" style={{ color: '#FFF' }}>財經</a>
                    <a href="/category/people"  className="item" style={{ color: '#FFF' }}>人物</a>
                    <a href="/category/livestream"  className="item" style={{ color: '#FFF' }}>直播</a>
                    <a href="/category/culture"  className="item" style={{ color: '#FFF' }}>文化</a>
                    <a href="/category/reading"  className="item" style={{ color: '#FFF' }}>說書人</a>
                    <a href="/category/literial"  className="item" style={{ color: '#FFF' }}>小說連載</a>
                </div>
              </div>
            
              <div className="column">
                <div className="ui list">
                  <a href="/section/foodtravel" className="item section" style={{ color: '#FFF' }}>美食/旅遊</a>                  
                    <a href="/category/wonderful_food"  className="item" style={{ color: '#FFF' }}>美食觀點</a>
                    <a href="/category/taiwan_travel"  className="item" style={{ color: '#FFF' }}>旅行台灣</a>
                    <a href="/category/world-travel"  className="item" style={{ color: '#FFF' }}>看見世界</a>
                    <a href="/category/cooking"  className="item" style={{ color: '#FFF' }}>料理廚房</a>
                    <a href="/category/download"  className="item" style={{ color: '#FFF' }}>好康下載</a>
                </div>
              </div>
            
              <div className="column">
                <div className="ui list">
                  <a href="/section/entertainment" className="item section" style={{ color: '#FFF' }}>娛樂</a>
                    <a href="/category/people"  className="item" style={{ color: '#FFF' }}>人物</a>
                    <a href="/category/livestream"  className="item" style={{ color: '#FFF' }}>直播</a>
                    <a href="/category/column"  className="item" style={{ color: '#FFF' }}>專欄</a>
                    <a href="/category/viideo"  className="item" style={{ color: '#FFF' }}>影視活動</a>
                    <a href="/category/script"  className="item" style={{ color: '#FFF' }}>劇本創作</a>
                </div>
              </div>
            
              <div className="column">
                <div className="ui list">
                  <a href="/section/fashion" className="item section" style={{ color: '#FFF' }}>鏡鐘錶</a>
                    <a href="/category/news"  className="item" style={{ color: '#FFF' }}>新聞</a>
                    <a href="/category/financial"  className="item" style={{ color: '#FFF' }}>財經</a>
                    <a href="/category/people"  className="item" style={{ color: '#FFF' }}>人物</a>
                    <a href="/category/livestream"  className="item" style={{ color: '#FFF' }}>直播</a>
                    <a href="/category/culture"  className="item" style={{ color: '#FFF' }}>文化</a>
                </div>
              </div>
            </div>
          </div>

          <div className="ui center aligned grid" style={{ margin:0, marginTop: '70px!important' }}>
            <div className="sixteen wide column">
              <div style={{ fontSize: '17px', letterSpacing: '1.1px', color: 'rgba(0, 0, 0, 0.5)' }}>訂閱鏡週刊</div>
              <div className="line"></div>
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
