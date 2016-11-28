import React, { Component } from 'react'

class Option extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { designatedAnsId, optionId, ans } = this.props
    const style = {
      color: (designatedAnsId === optionId)? 'GREEN' : ((ans === optionId) ? 'RED' : 'BLACK')
    }
    return (
      <div className="option" data-qId={ this.props.qId } data-nextQId={ this.props.nextQId } data-ans={ this.props.optionId }
            style={ style }>
          { (Number(this.props.optionIndex) + 1) + ', ' + this.props.optionTitle }
      </div>
    )
  }
}

export default Option
