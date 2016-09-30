import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('./More.css')
}

export default class More extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { loadMore } = this.props

    return (
      <div className="more-articles" onClick={loadMore}>
        <div>更多文章</div>
      </div>
    )
  }
}

export { More }
