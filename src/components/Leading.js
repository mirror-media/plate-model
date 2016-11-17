import _ from 'lodash'
import React, { Component } from 'react'
import Slider from 'react-slick'

if (process.env.BROWSER) {
  require('./Leading.css')
}
const PrevArrow = (props) => (
  <div {...props} style={{ background: 'url(' + props.src + ') no-repeat center center', height: '50px', width: '50px', left: '-50px', backgroundSize: 'cover' }}></div>
)

PrevArrow.defaultProps = {
  src: '/asset/icon/arrow_left.png'
}

const NextArrow = (props) => (
  <div {...props} style={{ background: 'url(' + props.src + ') no-repeat center center', height: '50px', width: '50px', right: '-50px', backgroundSize: 'cover' }}></div>
)

NextArrow.defaultProps = {
  src: '/asset/icon/arrow_right.png'
}

export default class Leading extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { leading, mediaSource } = this.props
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      cssEase: 'linear',
      fade: (this.props.device === 'desktop')? true: false,
      draggable: (this.props.device === 'desktop')? false: true,
      prevArrow: <PrevArrow src="/asset/icon/golden_Horse_arrow_left.png" />,
      nextArrow: <NextArrow src="/asset/icon/golden_Horse_arrow_right.png" />
    }
    const imageInfo = _.map(mediaSource.images, (itm) => {
      return {
        'filename' : _.get(itm, [ 'image', 'filename' ]),
        'filetype' : _.get(itm, [ 'image', 'filetype' ]),
        'height' : _.get(itm, [ 'image', 'height' ]),
        'width' : _.get(itm, [ 'image', 'width' ]),
        'url' : _.get(itm, [ 'image', 'url' ])
      }
    })
    const heroImage = _.get( mediaSource.heroImage, [ 'image' ], {} )
    const video = _.get(mediaSource.heroVideo, [ 'video' ], {})

    switch(leading) {
      case 'slideshow':
        if(imageInfo.length > 0) {
          return (
            <div className = "container">
            <div className = "leading-container">
            <Slider {...settings}>
            {_.map(imageInfo, (img) => {
              return (
                <div className = "slide-container" key={ img.filename } style = {{ height: '100%', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="slide" style={{ background: 'url(' + img.url + ') no-repeat center center', backgroundSize: 'contain', height: img.height + 'px', maxHeight: '400px' }}></div>
                </div>
              )
            })}
            </Slider>
            </div>
            </div>
          )
        } else {
          return (<div></div>)
        }
        break
      case 'image':
        if(heroImage.url && heroImage.url.length > 0) {
          return (
            <div className = "container">
              <div className = "leading-container">
                <a href="#"><div className="img" style={{ maxHeight: '550px', overflow: 'hidden' }}>
                  <img src={ heroImage.url } style={{ width: '100%' }} />
                </div></a>
              </div>
            </div>
          )
        } else {
          return (<div></div>)
        }
        break
      case 'video':
        if(video.url && video.url.length > 0) {
          return (
            <div className = "container">
              <div className = "leading-container">
                <video style={{ width: '100%' }}>
                  <source src={video.url} type={video.filetype} />
                </video>
              </div>
            </div>
          )
        } else {
          return (<div></div>)
        }
        break
      default:
        return (
          <div></div>
        )
    }
  }
}
export { Leading }
