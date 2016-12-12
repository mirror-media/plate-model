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

  componentDidUpdate() {
    if(this.refs.video) {
      this.refs.video.load()
    }
    if(this.refs.audio) {
      this.refs.audio.load()
    }
  }

  render() {
    const { leading, mediaSource } = this.props
    const embed = mediaSource.embed
    const eventPeriod = mediaSource.eventPeriod ? mediaSource.eventPeriod : [ null, null ]
    const flag = mediaSource.flag ? mediaSource.flag : null
    const heroImage = _.get( mediaSource.heroImage, [ 'image' ], {} )
    const imageInfo = _.map(mediaSource.images, (itm) => {
      return {
        'filename' : _.get(itm, [ 'image', 'filename' ]),
        'filetype' : _.get(itm, [ 'image', 'filetype' ]),
        'height' : _.get(itm, [ 'image', 'height' ]),
        'width' : _.get(itm, [ 'image', 'width' ]),
        'url' : _.get(itm, [ 'image', 'url' ])
      }
    })
    const isFeatured = mediaSource.isFeatured ? mediaSource.isFeatured : false
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      cssEase: 'linear',
      fade: (this.props.device === 'desktop') ? true : false,
      draggable: (this.props.device === 'desktop') ? false : true,
      prevArrow: <PrevArrow src="/asset/icon/golden_Horse_arrow_left.png" />,
      nextArrow: <NextArrow src="/asset/icon/golden_Horse_arrow_right.png" />
    }
    const video = _.get(mediaSource.heroVideo, [ 'video' ], {})
    const audio = _.get(mediaSource.audio, [ 'audio' ], {})

    if(EventStuff.ifShowLeading(eventPeriod[0], eventPeriod[1], flag, isFeatured)) {
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
            return (<ShowNothing />)
          }
          break
        case 'image':
          if(heroImage && heroImage.url && heroImage.url.length > 0) {
            return (
              <div className = "container">
                <div className = "leading-container">
                  <div className = "leading-container--fit">
                    <div className="img" style={{ maxHeight: '550px', overflow: 'hidden' }}>
                      <img src={ heroImage.url } style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          } else {
            return (<ShowNothing />)
          }
          break
        case 'video':
          if(video.url && video.url.length > 0) {
            return (
              <div className = "container">
                <div className = "leading-container">
                  <div className = "leading-container--fit">
                    <video style={{ width: '100%' }} controls ref="video">
                      <source src={video.url} type={video.filetype} />
                    </video>
                  </div>
                </div>
              </div>
            )
          } else {
            return (<ShowNothing />)
          }
          break
        case 'audio':
          if(audio.url && audio.url.length > 0) {
            return (
              <div className = "container">
                <div className = "leading-container">
                  <div className = "leading-container--fit">
                    <audio style={{ width: '100%', minWidth: '100%' }} data-file={audio.url} controls ref="audio">
                      <source src={audio.url} type={audio.filetype} />
                    </audio>
                  </div>
                </div>
              </div>
            )
          } else {
            return (<ShowNothing />)
          }
          break
        case 'embedded':
          if(embed && _.trim(embed).length > 0) {
            return (
              <div className = "container">
                <div className = "leading-container">
                  <div className = "leading-container--fit">
                    <div className = "leading-container_embedded" dangerouslySetInnerHTML={{ __html: embed }}></div>
                  </div>
                </div>
              </div>
            )
          } else {
            return (<ShowNothing />)
          }
          break
        default:
          return (<ShowNothing />)
      }
    } else {
      return (<ShowNothing />)
    }
  }
}
export { Leading }

const ShowNothing = () => (
  <div></div>
)

class EventStuff {
  static ifShowLeading(startDate = Date.now(), endDate = Date.now(), flag, isFeatured) {
    let dNow = new Date()
    let sDt = new Date(startDate)
    let eDt = new Date(endDate)
    return ((flag !== 'event' || (isFeatured && flag === 'event' && (dNow <= eDt && dNow >= sDt)))) ? true : false
  }
}
