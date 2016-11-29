import React, { Component } from 'react'

class Option extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { designatedAnsId, optionId, ans } = this.props
    const className = (designatedAnsId === optionId)? 'option option--right' : ((ans === optionId) ? 'option option--wrong' : 'option option--left')
    return (
      <div className={ className } data-qId={ this.props.qId } data-nextQId={ this.props.nextQId } data-ans={ this.props.optionId }>
          { this.props.optionTitle }
      </div>
    )
  }
}

export default Option
