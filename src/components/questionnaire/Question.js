// import _ from 'lodash'
// import React, { Component } from 'react'
import React from 'react'

const Question = (props) => (
  <div className="question">
    <div className="question-container">
      <h3>{ props.questionTitle }</h3>
    </div>
  </div>
)

// class Question extends Component {
//   constructor(props, context) {
//     super(props, context)
//   }
//   render() {
//     console.log('get the question, ', this.props)
//     const title = _.get(this.props.question, [ 'title' ])
//     return (
//       <div className="quesiton">
//         <div className="question-container">
//           { title }
//         </div>
//       </div>
//     )
//   }
// }

export default Question
