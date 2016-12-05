import _ from 'lodash'
import React, { Component } from 'react'

class QuestHeader extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { questionnaireTitle, imageSource } = this.props
    const url = _.get(imageSource, [ 'url' ], '')
    const style = { backgroundImage: 'url(' + url + ')'
                  , backgroundRepeat: 'no-repeat'
                  , backgroundPosition: 'center center'
                  , backgroundSize: 'cover' }
    return (
      <div className="questionnaire-title" style={ style }>
        <div className="questionnaire-title-container">
          <h2 dangerouslySetInnerHTML={{ __html: questionnaireTitle }}></h2>
        </div>
        { this.props.children }
      </div>
    )
  }
}

export default QuestHeader
