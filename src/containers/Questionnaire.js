'use strict'
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Question from '../components/questionnaire/Question'
import Option from '../components/questionnaire/Option'
import Button from '../components/questionnaire/Button'
import Result from '../components/questionnaire/Result'
import { fetchQuestionnaire, goNextQuestion, passAnswer, resetQuestionnaire } from '../actions/questionnaire.js'
import Slider from 'react-slick'


if (process.env.BROWSER) {
  require('./questionnaire.css')
}

class Questionnaire extends Component {
  static fetchData({ params, store }) {
    return store.dispatch(fetchQuestionnaire(_.get(params, [ 'questionnaireId' ], '')))
  }


  constructor(props, context) {
    super(props, context)
    this._optionClick = this._optionClick.bind(this)
    this._playAgainClick = this._playAgainClick.bind(this)
    this._checkAnsClick = this._checkAnsClick.bind(this)
    this._nextQuestionClick = this._nextQuestionClick.bind(this)
  }

  _optionClick(e) {
    const gameFlow = _.get(this.props, [ 'questSetting', 'setting', 'gameFlow' ], 'ONCE')
    let qId = _.get(e, [ 'target', 'attributes', 'data-qId', 'value' ])
    let nextQId = _.get(e, [ 'target', 'attributes', 'data-nextQId', 'value' ])
    let ans = _.get(e, [ 'target', 'attributes', 'data-ans', 'value' ])
    if(gameFlow === 'QA') {
      this.props.passAnswer(qId, ans, qId, _.get(this.refs, [ 'questionnaire', 'attributes', 'data-finished', 'value' ]), true)
    } else {
      this.props.passAnswer(qId, ans, nextQId, _.get(this.refs, [ 'questionnaire', 'attributes', 'data-finished', 'value' ]), false)
    }
  }

  _playAgainClick() {
    this.props.resetQuestionnaire(_.get(this.refs, [ 'questionnaire', 'attributes', 'data-questionnaireId', 'value' ])
                                  , _.get(this.refs, [ 'questionnaire', 'attributes', 'data-firstQId', 'value' ], ''))
  }

  _checkAnsClick() {
    let answerSheet = _.get(this.refs, [ 'answer-sheet' ], {})
    answerSheet && answerSheet.slickGoTo(1)
  }

  _nextQuestionClick() {
    let nextQId = _.get(this.refs, [ 'questionnaire', 'attributes', 'data-nextQId', 'value' ], '')
    this.props.goNextQuestion(nextQId, _.get(this.refs, [ 'questionnaire', 'attributes', 'data-finished', 'value' ]))
  }

  render() {
    const { finished, showExplanation } = this.props
    const answers = _.get(this.props, [ 'ans' ], null)
    const questions = _.get(this.props, [ 'questSetting', 'setting', 'questions' ], [])
    const currQuestionId = this.props.currQuestionId ? this.props.currQuestionId : _.get(questions, [ 0, 'id' ])
    const currQuestion = _.find(questions, { id : currQuestionId })
    const currQuestionTitle = _.get(currQuestion, [ 'title' ], '')
    const currQuestionIdx = _.findIndex(questions, { id : currQuestionId })
    const currOption = _.get(currQuestion, [ 'options' ], [])
    const nextQuestionId = _.get(questions, [ (currQuestionIdx + 1), 'id' ])

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      // autoplay: true,
      // autoplaySpeed: 3000,
      cssEase: 'linear',
      fade: (this.props.device === 'desktop') ? true : false,
      draggable: (this.props.device === 'desktop') ? false : true
      // prevArrow: <PrevArrow src="/asset/icon/golden_Horse_arrow_left.png" />,
      // nextArrow: <NextArrow src="/asset/icon/golden_Horse_arrow_right.png" />
    }


    return (
      <div className="Questionnaire" ref="questionnaire"
      data-questionnaireId={ _.get(this.props.params, [ 'questionnaireId' ], '') }
      data-firstQId={ _.get(questions, [ 0, 'id' ]) }
      data-finished={ ((currQuestionIdx + 1) === questions.length) ? true : false }
      data-nextQId={ nextQuestionId }>

        {(() => {
          if(!finished) {
            const extraProps = (!showExplanation) ? {} : {
              ans: _.get(this.props, [ 'ans', currQuestionIdx ], null),
              designatedAnsId: _.get(currQuestion, [ 'designated_option' ])
            }
            const BtnNextQuestion = (!showExplanation) ? (() => (<div></div>)) : (() => (
              <div className="button-container" style={{ cursor: 'pointer' }} onClick={ this._nextQuestionClick }>
                <Button value="下一題" />
              </div>
            ))
            const Explanation = (!showExplanation) ? (() => (<div></div>)) : (() => (
              <div className="Explanation">
                <div className="Explanation-container">
                  { _.get(currQuestion, [ 'explanation' ]) }
                </div>
              </div>
            ))
            return (
              <div className="question-set">
                <Question questionTitle={ currQuestionTitle } />
                { _.map(currOption, (opt, idx) => {
                  return (
                    <div className="option-container" onClick={ (!showExplanation) ? this._optionClick : null } style={{ cursor: 'pointer' }} key={ _.get(opt, [ 'id' ], '') }>
                      <Option optionTitle={ _.get(opt, [ 'title' ], '') } optionIndex={ idx } {...extraProps}
                      qId={ currQuestionId } nextQId={ nextQuestionId } optionId={ _.get(opt, [ 'id' ], '') }/>
                    </div>
                  )
                })}
                <Explanation />
                <BtnNextQuestion />
              </div>
            )
          } else {
            return (
              <div className="answer-sheet">
                <Slider ref="answer-sheet" {...settings}>
                  <div className="result-set">
                    <div className="result-container">
                      <Result results={ _.get(this.props, [ 'questSetting', 'setting', 'results' ], []) }
                                questions={ questions } answers={ answers } />
                    </div>
                    <div className="button-set">
                      <div className="button-container" onClick={ this._playAgainClick } style={{ cursor: 'pointer' }} >
                        <Button value="play again" />
                      </div>
                      <div className="button-container" onClick={ this._checkAnsClick } style={{ cursor: 'pointer' }} >
                        <Button value="看答案" />
                      </div>
                    </div>
                  </div>

                  { _.map(questions, (quest, idx) => {
                    const designatedAnsId = _.get(quest, [ 'designated_option' ])
                    const ans = _.get(this.props, [ 'ans', idx ], null)
                    return (
                      <div className="question-set" key={ _.get(quest, [ 'id' ]) }>
                        <Question questionTitle={ _.get(quest, [ 'title' ]) } />
                        { _.map(_.get(quest, [ 'options' ]), (opt, i) => {
                          return (
                            <div className="option-container" key={ _.get(opt, [ 'id' ], '') }>
                            <Option optionTitle={ _.get(opt, [ 'title' ], '') }  optionIndex={ i } ans={ ans }
                              designatedAnsId={ designatedAnsId } optionId={ _.get(opt, [ 'id' ], '') }/>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </Slider>
              </div>

            )
          }
        })()}
      </div>
    )

  }
}

function mapStateToProps(state) {
  return {
    ans: state.questionnaire.ans || [],
    currQuestionId: state.questionnaire.currQuestionId || null,
    finished: state.questionnaire.finished || false,
    questSetting: state.questSetting || {},
    showExplanation: state.questionnaire.showExplanation || false
  }
}

Questionnaire.contextTypes = {
  device: React.PropTypes.string
}

export { Questionnaire }

export default connect(mapStateToProps, {
  fetchQuestionnaire,
  goNextQuestion,
  passAnswer,
  resetQuestionnaire
})(Questionnaire)
