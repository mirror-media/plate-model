import _ from 'lodash'
import { connect } from 'react-redux'
import { setReadProgress } from '../actions/header'
import { ARTICLE, PHOTOGRAPHY_ARTICLE } from '../constants/index'
// import NavMenu from '../components/navigation/NavMenu'
import HeaderProgress from '../components/navigation/HeaderProgress'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import logo from '../../static/asset/logo.svg'

const DEFAULT_HEIGHT = 80

class NaviBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: DEFAULT_HEIGHT,
      isScrolledOver: false
    }
    this._getHeaderHeight = this._getHeaderHeight.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
  }

  componentDidMount() {
    this._getHeaderHeight()
    window.addEventListener('resize', this._getHeaderHeight)

    // detect sroll position
    window.addEventListener('scroll', this._handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._getHeaderHeight)
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
      height: _.get(rect, 'height', DEFAULT_HEIGHT)
    })
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line
    // if(nextState.height !== this.state.height ||
    //    nextProps.header.readPercent !== this.props.header.readPercent ||
    //    nextState.isScrolledOver !== this.state.isScrolledOver) {
    //   return true
    // }
    // if (nextProps.path === this.props.path) {
    //   return false
    // }
    return true
  }

  _renderDesktop() {
    // return (
    //   <div>
    //     <NavMenu {...this.props}
    //       isScrolledOver={this.state.isScrolledOver}
    //       pageTitle={this.props.header.pageTitle}
    //       pageTopic={this.props.header.pageTopic}
    //       articleId={this.props.header.articleId}
    //       />
    //   </div>
    // )
    return (
      <div className="ui borderless menu" style={{ backgroundColor: '#F5F5F5', border: 'none', boxShadow: 'none', margin:'0' }}>
        <div className="ui text container" style={{ maxWidth: 1024 +'px !important' }}>
          <a href="/" className="header item">
            <img className="logo small" src={logo} style={{ width:'128px' }} />
          </a>

          <div className="right menu">
            <div className="item">
              訂閱：
              <a href="#" ><img src="/asset/icon/line@2x.png"      style={{ width: '56px!important', height: '25px' }}/></a>
              <a href="#" ><img src="/asset/icon/weibo@2x.png"     style={{ width: '29px!important', height: '25px' }}/></a>
              <a href="#" ><img src="/asset/icon/facebook@2x.png"  style={{ width: '25px!important', height: '25px' }}/></a>
              <a href="#" ><img src="/asset/icon/wechat@2x.png"    style={{ width: '29px!important', height: '25px' }}/></a>
            </div>
            <div className="item">
              <div className="ui transparent icon input">
                <i className="search icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { height } = this.state
    const { header } = this.props
    const percent = header.readPercent || 0
    
    let progressBar = (header.pageType === ARTICLE || header.pageType === PHOTOGRAPHY_ARTICLE) ? <HeaderProgress percent={percent}/> : null

    return (
      <div style={{ height: height+'px' }}>
        <div ref="headerbox" className="fixTop">
          {this._renderDesktop()}
          {progressBar}
        </div>
      </div>
    )
  }
}

NaviBar.contextTypes = {
  device: PropTypes.string
}

function mapStateToProps(state) {
  return {
    header: state.header || {}
  }
}

export default connect(mapStateToProps, { setReadProgress })(NaviBar)
