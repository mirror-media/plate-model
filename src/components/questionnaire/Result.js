import _ from 'lodash'
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
    return (
      <div className="result" >
        { rs.title }
      </div>
    )
  }
}

export default Result
