import React, { Component } from 'react'

class QuestHeader extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { questionnaireTitle, imageSource } = this.props
    return (
      <div className="questionnaire-title" style={{ background: 'url(' + imageSource.url + ') no-repeat center center', backgroundSize: 'cover' }}>
        <div className="questionnaire-title-container">
          <h2>{ questionnaireTitle }</h2>
        </div>
      </div>
    )
  }
}

export default QuestHeader
