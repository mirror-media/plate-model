import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('./MoreFull.css')
}

export default class MoreFull extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { loadMore } = this.props

    return (
      <div className="moreFull-articles" onClick={loadMore}>
        更多文章
      </div>
    )
  }
}

export { MoreFull }
