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
      // autoplay: true,
      // autoplaySpeed: 500,
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
    console.log('leading:', leading)
    console.log('mediaSource:', mediaSource)
    const heroImage = _.get(mediaSource.heroImage, ['image'], {})
    // const video = {
    //   'filetype' : 'video/mp4',
    //   'url' : '/asset/SampleVideo_1280x720_5mb.mp4',
    //   'width' : '720',
    //   'height' : '1280'
    //
    const video = _.get(mediaSource.heroVideo, ['video'], {})

    switch(leading) {
      case 'slideshow':
        if(imageInfo.length > 0) {
          return (
            <div className = "container">
            <div className = "leading-container">
            <Slider {...settings}>
            {_.map(imageInfo, (img) => {
              return (
                <div className="slide" key={ img.filename } style={{ background: 'url(' + img.url + ') no-repeat center center', backgroundSize: 'cover', height: img.height + 'px', maxHeight: '400px' }}></div>
                // <div className="slide" key={idx} style={{ background: 'url(' + img + ') no-repeat center center', backgroundSize: 'cover', height: '500px', maxHeight: '500px' }}></div>
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
      default:
        return (
          <div></div>
        )
    }
  }
}
export { Leading }
