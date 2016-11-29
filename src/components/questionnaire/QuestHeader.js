import _ from 'lodash'
import React, { Component } from 'react'

class QuestHeader extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { questionnaireTitle, imageSource } = this.props
    const url = _.get(imageSource, [ 'url' ], '')
    return (
      <div className="questionnaire-title" style={{ background: 'url(' + url + ') no-repeat center center', backgroundSize: 'cover' }}>
        <div className="questionnaire-title-container">
          <h2>{ questionnaireTitle }</h2>
        </div>
      </div>
    )
  }
}

export default QuestHeader
