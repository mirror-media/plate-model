import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('./WorkingProcessBar.css')
}

class WorkingProcessBar extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { processTitle } = this.props
    return (
      <div className="workingProcessBar">
        <div className="workingProcessBar_bar">
          <span style={{ width: '25%' }}></span>
        </div>
        <div className="workingProcessBar_title">{ processTitle }</div>
      </div>
    )
  }
}

export default WorkingProcessBar
