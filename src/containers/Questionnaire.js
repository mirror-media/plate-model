'use strict'
import _ from 'lodash'
import Button from '../components/questionnaire/Button'
import DocumentMeta from 'react-document-meta'
import Leading from '../components/Leading'
import Option from '../components/questionnaire/Option'
import Question from '../components/questionnaire/Question'
import QuestHeader from '../components/questionnaire/QuestHeader'
import React, { Component } from 'react'
import Result from '../components/questionnaire/Result'
import Slider from 'react-slick'
import { connect } from 'react-redux'
import { fetchQuestionnaire, goNextQuestion, passAnswer, resetQuestionnaire } from '../actions/questionnaire.js'
import { QUESTIONNAIRE, SITE_META } from '../constants/index'
import { setPageType, setPageTitle } from '../actions/header'


if (process.env.BROWSER) {
  require('./Questionnaire.css')
}

class Questionnaire extends Component {
  static fetchData({ params, store }) {
    return store.dispatch(fetchQuestionnaire(_.get(params, [ 'questionnaireId' ], '')))
  }


  constructor(props, context) {
    super(props, context)
    this._checkAnsClick = this._checkAnsClick.bind(this)
    this._nextQuestionClick = this._nextQuestionClick.bind(this)
    this._optionClick = this._optionClick.bind(this)
    this._playAgainClick = this._playAgainClick.bind(this)
  }

  componentDidMount() {
    const questionnaireTitle = _.get(this.props, [ 'questSetting', 'setting', 'title' ])
    this.props.setPageType(QUESTIONNAIRE)
    this.props.setPageTitle('', questionnaireTitle)
  }

  _checkAnsClick() {
    let answerSheet = _.get(this.refs, [ 'answer-sheet' ], {})
    answerSheet && answerSheet.slickGoTo(1)
  }

  _nextQuestionClick() {
    let nextQId = _.get(this.refs, [ 'questionnaire', 'attributes', 'data-nextQId', 'value' ], '')
    this.props.goNextQuestion(nextQId, _.get(this.refs, [ 'questionnaire', 'attributes', 'data-finished', 'value' ]))
  }

  _optionClick(e) {
    const gameFlow = _.get(this.props, [ 'questSetting', 'setting', 'gameFlow' ], 'ONCE')
    let qId = _.get(e, [ 'target', 'attributes', 'data-qId', 'value' ])
    let nextQId = _.get(e, [ 'target', 'attributes', 'data-nextQId', 'value' ])
    let ans = _.get(e, [ 'target', 'attributes', 'data-ans', 'value' ])
    if(gameFlow === 'QA') {
      this.props.passAnswer(qId, ans, qId, false, true)
    } else {
      this.props.passAnswer(qId, ans, nextQId, _.get(this.refs, [ 'questionnaire', 'attributes', 'data-finished', 'value' ]), false)
    }
  }

  _playAgainClick() {
    this.props.resetQuestionnaire(_.get(this.refs, [ 'questionnaire', 'attributes', 'data-questionnaireId', 'value' ])
                                  , _.get(this.refs, [ 'questionnaire', 'attributes', 'data-firstQId', 'value' ], ''))
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
    const finishedFlag = ((currQuestionIdx + 1) === questions.length) ? true : false
    const nextQuestionId = _.get(questions, [ (currQuestionIdx + 1), 'id' ])
    const questionnaireId = _.get(this.props.params, [ 'questionnaireId' ], '')
    const questionnaireTitle = _.get(this.props, [ 'questSetting', 'setting', 'title' ])
    const questionnaireDesc = _.get(this.props, [ 'questSetting', 'setting', 'description' ])
    const questionnaireImg = _.get(this.props, [ 'questSetting', 'setting', 'image' ], null)

    const leadingType = _.get(this.props, [ 'questSetting', 'setting', 'leading' ], 'image')
    const mediaSource = {
      heroImage: { image: _.get(currQuestion, [ 'image' ] , null) },
      heroVideo: { video: _.get(currQuestion, [ 'video' ] , null) },
      audio: { audio: _.get(currQuestion, [ 'audio' ] , null) }
    }
    const meta = {
      auto: { ograph: true },
      canonical: `${SITE_META.URL}q/${questionnaireId}`,
      description: questionnaireDesc? questionnaireDesc : '',
      meta: { property: { } },
      title: questionnaireTitle ? questionnaireTitle : ''
    }

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
      draggable: (this.props.device === 'desktop') ? false : true,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />
    }

    return (
      <DocumentMeta {...meta}>

        <div id="main" className="pusher middle">
          <div className="Questionnaire" ref="questionnaire"
          data-questionnaireId={ _.get(this.props.params, [ 'questionnaireId' ], '') }
          data-firstQId={ _.get(questions, [ 0, 'id' ]) }
          data-finished={ finishedFlag }
          data-nextQId={ nextQuestionId }>
            <div className="container questionnaire">
              <QuestHeader questionnaireTitle={ questionnaireTitle } imageSource={ questionnaireImg }/>
              {(() => {
                if(!finished) {
                  const extraProps = (!showExplanation) ? {} : {
                    ans: _.get(this.props, [ 'ans', currQuestionIdx ], null),
                    designatedAnsId: _.get(currQuestion, [ 'designated_option' ])
                  }
                  const BtnNextQuestion = (!showExplanation) ? (() => (<div></div>)) : (() => (
                    <div className="button-set">
                      <div className="button-container" style={{ cursor: 'pointer' }} onClick={ this._nextQuestionClick }>
                        <Button value={ (!finishedFlag) ? '下一題' : '完成' } />
                      </div>
                    </div>
                  ))
                  const Explanation = (!showExplanation) ? (() => (<div></div>)) : (() => (
                    <div className="explanation">
                      <div className="explanation-container">
                        { _.get(currQuestion, [ 'explanation' ]) }
                      </div>
                    </div>
                  ))
                  return (
                    <div className="question-set">
                      <Question questionTitle={ currQuestionTitle } />
                      <Leading leading={ leadingType } mediaSource={ mediaSource }/>
                      <div className="options">
                        { _.map(currOption, (opt, idx) => {
                          return (
                            <div className="option-container" onClick={ (!showExplanation) ? this._optionClick : null } style={{ cursor: 'pointer' }} key={ _.get(opt, [ 'id' ], '') }>
                              <Option optionTitle={ _.get(opt, [ 'title' ], '') } optionIndex={ idx } {...extraProps}
                              qId={ currQuestionId } nextQId={ nextQuestionId } optionId={ _.get(opt, [ 'id' ], '') }/>
                            </div>
                          )
                        })}
                      </div>
                      <Explanation />
                      <BtnNextQuestion />
                    </div>
                  )
                } else {
                  return (
                    <div className="answer-sheet">
                      <Slider ref="answer-sheet" {...settings}>
                        <div className="result-set">
                          <div className="result">
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
                          const tmp_mediaSource = {
                            heroImage: { image: _.get(quest, [ 'image' ] , null) },
                            heroVideo: { video: _.get(quest, [ 'video' ] , null) },
                            audio: { audio: _.get(quest, [ 'audio' ] , null) }
                          }
                          return (
                            <div className="question-set" key={ _.get(quest, [ 'id' ]) }>
                              <Question questionTitle={ _.get(quest, [ 'title' ]) } />
                              <Leading leading={ leadingType } mediaSource={ tmp_mediaSource }/>
                              <div className="options">
                                { _.map(_.get(quest, [ 'options' ]), (opt, i) => {
                                  return (
                                    <div className="option-container" key={ _.get(opt, [ 'id' ], '') }>
                                    <Option optionTitle={ _.get(opt, [ 'title' ], '') }  optionIndex={ i } ans={ ans }
                                      designatedAnsId={ designatedAnsId } optionId={ _.get(opt, [ 'id' ], '') }/>
                                    </div>
                                  )
                                })}
                              </div>
                              <div className="explanation">
                                <div className="explanation-container">
                                  { _.get(currQuestion, [ 'explanation' ]) }
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </Slider>
                    </div>

                  )
                }
              })()}

            </div>
          </div>
        </div>
      </DocumentMeta>
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

const PrevArrow = (props) => (
  <div {...props} style={{ background: 'url(' + props.src + ') no-repeat center center', height: '50px', width: '50px', left: '-50px', backgroundSize: 'cover', display: 'block', backgroundColor: { value: 'rgba(255,255,255,0)', important: 'true' } }}></div>
)

PrevArrow.defaultProps = {
  src: '/asset/icon/arrow_left.png'
}

const NextArrow = (props) => (
  <div {...props} style={{ background: 'url(' + props.src + ') no-repeat center center', height: '50px', width: '50px', right: '-50px', backgroundSize: 'cover', display: 'block', backgroundColor: { value: 'rgba(255,255,255,0)', important: 'true' } }}></div>
)

NextArrow.defaultProps = {
  src: '/asset/icon/arrow_right.png'
}

export { Questionnaire }

export default connect(mapStateToProps, {
  fetchQuestionnaire,
  goNextQuestion,
  passAnswer,
  resetQuestionnaire,
  setPageTitle,
  setPageType
})(Questionnaire)
