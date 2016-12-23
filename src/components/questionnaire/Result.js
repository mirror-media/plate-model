import _ from 'lodash'
import Leading from '../Leading'
import React, { Component } from 'react'

class Result extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { results, questions, answers } = this.props
    const score = _.chain(questions)
                    .map((itm, idx) => {
                      let { options } = itm
                      let s = _.find(options, { id: answers[ idx ] })[ 'score' ]
                      return s
                    }).reduce((t, n) => (t + n)).value()
    const rs = _.chain(results)
                .filter((itm) => {
                  return (score >= itm.range.from && score < itm.range.to)
                }).first().value()
    const mediaSource = {
      heroImage: { image: _.get(rs, [ 'image' ] , null) },
      heroVideo: { video: _.get(rs, [ 'video' ] , null) },
      audio: { audio: _.get(rs, [ 'audio' ] , null) }
    }
    return (
      <div className="result-container" >
        <Leading leading="image" mediaSource={ mediaSource }/>
        <h3>{ rs.title }</h3>
        <div className="result-comment">{ rs.comment }</div>
      </div>
    )
  }
}

export default Result
