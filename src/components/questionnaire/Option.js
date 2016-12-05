import _ from 'lodash'
import React, { Component } from 'react'

class Option extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      style: {},
      animateInterval: null,
      currOpacity: 1
    }
    this._optionClick = this._optionClick.bind(this)
  }
  _optionClick() {
    let { animateInterval } = this.state
    if(!animateInterval) {
      animateInterval = setInterval(
        () => {
          let { animateInterval, currOpacity, style } = this.state
          let thisOpacity = currOpacity
          if(thisOpacity > 0) {
            thisOpacity = (thisOpacity - 0.02)
            style = { background: 'linear-gradient(to right, rgba(16, 95, 166,0), rgba(16, 95, 166, ' + (thisOpacity - 0.2) + '), rgba(16, 95, 166, ' + thisOpacity + '), rgba(16, 95, 166, ' + (thisOpacity - 0.2) + '), rgba(16, 95, 166,0))' }
          } else {
            clearInterval(animateInterval)
            animateInterval = null
            style = {}
          }
          this.setState({
            style: style,
            animateInterval: animateInterval,
            currOpacity: thisOpacity
          })
        },
        10
      )
    }
    this.setState({
      animateInterval: animateInterval,
      currOpacity: 1
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.animateInterval)
  }

  render() {
    const child = _.get(this.props, [ 'children' ])
    const designatedAnsId = _.get(child, [ 'props', 'data-designatedAnsId' ], null)
    const ans = _.get(child, [ 'props', 'data-ans' ], null)
    const optionId = _.get(child, [ 'props', 'data-qId' ], null)
    // const className = (designatedAnsId === optionId)? 'option option--right' : ((ans === optionId) ? 'option option--wrong' : 'option option--left')
    const className = (designatedAnsId === optionId)? 'option' : ((ans === optionId) ? 'option' : 'option')
    return (
      <div className={ className } onClick={ ((designatedAnsId === optionId) || (ans === optionId)) ? null : this._optionClick } style={ this.state.style }>
          { this.props.children }
      </div>
    )
  }
}

export default Option
