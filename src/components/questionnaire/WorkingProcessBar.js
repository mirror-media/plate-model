import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('./WorkingProcessBar.css')
}

class WorkingProcessBar extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { width } = this.props
    return (
      <div className="workingProcessBar">
        <div className="workingProcessBar_bar">
          <span style={{ width: width }}></span>
        </div>
      </div>
    )
  }
}

export default WorkingProcessBar
