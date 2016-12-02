/* global $ */
import React, { Component } from 'react'

export default class AudioBox extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      playing: false,
      currentTime: 0,
      duration: 0
    }
    this.togglePlay = this.togglePlay.bind(this)
  }

  componentDidMount() {
    const audio = this.audioEl

    audio.addEventListener('error', (e) => {
      this.props.onError && this.props.onError(e)
    })

    // When audio play starts
    audio.addEventListener('play', (e) => {
      this.props.onPlay && this.props.onPlay(e)
    })

    // When unloading the audio player (switching to another src)
    audio.addEventListener('abort', (e) => {
      this.props.onAbort && this.props.onAbort(e)
    })

    // When the file has finished playing to the end
    audio.addEventListener('ended', (e) => {
      this.props.onEnded && this.props.onEnded(e)
    })

    // When the user pauses playback
    audio.addEventListener('pause', (e) => {
      this.props.onPause && this.props.onPause(e)
    })

    audio.addEventListener('loadedmetadata', () => {
      this.setState({
        duration: audio.duration
      })
    })

    this.setState({
      duration: audio.duration
    })

    // When the audio time update
    audio.addEventListener('timeupdate', () => {
      let pos = (audio.currentTime / audio.duration) * 100

      $(this.audioProgress).width(pos + '%')

      this.setState({
        currentTime: audio.currentTime
      })
    })
  }

  togglePlay() {
    if(this.state.playing) {
      this.audioEl.pause()
      $(this.audioBtn).removeClass('play')
      $(this.audioBtn).addClass('pause')
      this.setState({
        playing: false
      })
    } else {
      this.audioEl.play()
      $(this.audioBtn).removeClass('pause')
      $(this.audioBtn).addClass('play')
      this.setState({
        playing: true
      })
    }
  }

  toMMSS(seconds) {
    seconds = parseInt(seconds, 10)
    let minutes = parseInt(seconds / 60) % 60
    seconds = seconds % 60

    return (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
  }

  render() {
    const { id, title, url } = this.props
    return  (
      <div className="audio-box">
        <div className="audio-container ">
          <div className="audio-time"><span className="left">{this.toMMSS(this.state.currentTime)}</span> / {this.toMMSS(this.state.duration)}</div>
          <div className="audio-progress">
              <div className="bar" ref={(ref) => { this.audioProgress = ref }}></div>
          </div>
          <div className="audio-cover">
              <div className="audio-btn pause" ref={(ref) => { this.audioBtn = ref }} onClick={()=> this.togglePlay(id)}></div>
          </div>
          <div className="audio-title"><span dangerouslySetInnerHTML={{ __html: title }}/></div>
          <div className="audio-desc"></div>
          <audio ref={(ref) => { this.audioEl = ref }} src={url}></audio>
        </div>
      </div>
    )
  }
}

export { AudioBox }
