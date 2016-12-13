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
import WorkingProcessBar from '../components/questionnaire/WorkingProcessBar'
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
    this._computeResult = this._computeResult.bind(this)
    this._nextQuestionClick = this._nextQuestionClick.bind(this)
    this._optionClick = this._optionClick.bind(this)
    this._playAgainClick = this._playAgainClick.bind(this)
    // this.optionListner = document.addEventListener('click', this._optionClick)
    this._goCheckNextQuestClick =this._goCheckNextQuestClick.bind(this)
  }

  componentDidMount() {
    const questionnaireTitle = _.get(this.props, [ 'questSetting', 'setting', 'title' ])
    this.props.setPageType(QUESTIONNAIRE)
    this.props.setPageTitle('', questionnaireTitle)
  }

  componentWillMount() {
    if(!_.get(this.props, [ 'questSetting' ], null) || !_.get(this.props, [ 'questSetting', 'setting' ], null)) {
      this.props.fetchQuestionnaire(_.get(this.props.params, [ 'questionnaireId' ], ''))
    }
  }

  _checkAnsClick() {
    let answerSheet = _.get(this.refs, [ 'answer-sheet' ], {})
    answerSheet && answerSheet.slickGoTo(1)
  }

  _goCheckNextQuestClick() {
    let answerSheet = _.get(this.refs, [ 'answer-sheet' ], {})
    answerSheet && answerSheet.slickNext()
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

  _computeResult() {
    const {
      ans: answers = [],
      questSetting: {
        setting: {
          questions = []
        }
      }
    } = this.props
    const scoreArr = _.map(answers, (aid, idx) => {
      const { score } = _.find(_.get(questions, [ idx, 'options' ]), { id: aid })
      return score
    })
    return {
      correct: (questions.length - _.countBy(scoreArr)[ '0' ]),
      wrong: _.countBy(scoreArr)[ '0' ]
    }
  }


  render() {
    const {
      ans: answers = null,
      finished,
      params: questionnaireId = '',
      questSetting: {
        setting: {
          description: questionnaireDesc = '',
          image: questionnaireImg = null,
          leading: leadingType = 'image',
          title: questionnaireTitle = '',
          titleCustomized: questionnaireTitleCust = '',
          questions = [],
          subtitle: questionnaireSubTitle = ''
        }
      },
      showExplanation
     } = this.props
    const currQuestionId = this.props.currQuestionId ? this.props.currQuestionId : _.get(questions, [ 0, 'id' ])
    const currQuestion = _.find(questions, { id : currQuestionId })

    const {
      designated_option: designatedAnsId = '',
      title: currQuestionTitle = '',
      options: currOption = []
    } = currQuestion
    const currQuestionIdx = _.findIndex(questions, { id : currQuestionId })
    const finishedFlag = ((currQuestionIdx + 1) === questions.length) ? true : false
    const nextQuestionId = _.get(questions, [ (currQuestionIdx + 1), 'id' ])
    const totalQuestions = _.get(questions, [ 'length' ], 0)

    const ans = _.get(answers, [ currQuestionIdx ], null)

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
              <QuestHeader questionnaireTitle={ (questionnaireTitleCust && questionnaireTitleCust.trim().length > 0) ? questionnaireTitleCust : questionnaireTitle } imageSource={ questionnaireImg }>
                <div className="questionnaire-info">
                  <div className="mm-mark">
                    <div>MirrorMedia</div>
                  </div>
                  <div className="process-hint-title">
                    <div>
                      { ((!finishedFlag || (answers.length !== totalQuestions))  && !finished) ? ('' + (currQuestionIdx + 1) + '／' +  totalQuestions + '　' + questionnaireSubTitle) : ('作答完成　'  + questionnaireSubTitle) }
                    </div>
                  </div>
                </div>
              </QuestHeader>
              <WorkingProcessBar width={ ((!finishedFlag || (answers.length !== totalQuestions)) && !finished) ? ((currQuestionIdx/totalQuestions) * 100 + '%') : '100%' }/>
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
                  //
                  return (
                    <div className="question-set">
                      <div className="question-top">
                        <div className="question-index">
                          <h3>Ｑ{ (currQuestionIdx + 1) }</h3>
                        </div>
                        <div className="question-content">
                          <div className="question-content--alignbox">
                            <Question questionTitle={ currQuestionTitle } />
                            <Leading leading={ leadingType } mediaSource={ mediaSource }/>
                          </div>
                        </div>
                      </div>
                      <div className="options">
                        { _.map(currOption, (opt, idx) => {
                          const Correcting = (() => (
                            (designatedAnsId === _.get(opt, [ 'id' ], '')) ? (<img className="correcting" src="/asset/circle.svg"/>) : ((ans === _.get(opt, [ 'id' ], '')) ? (<img className="correcting" src="/asset/cross.svg"/>) : (<span></span>))
                          ))
                          return (
                            <div className={ 'option-container' + (((idx + 1) !== currOption.length) ? ' border--bottom' : '') } onClick={ (!showExplanation) ? this._optionClick : null } style={{ cursor: 'pointer' }} key={ _.get(opt, [ 'id' ], '') }>
                              <Option optionIndex={ idx } {...extraProps}>
                                <div data-qId={ currQuestionId } data-nextQId={ nextQuestionId } data-ans={ _.get(opt, [ 'id' ], '') }>
                                  <span className="option-index">{ (idx + 1) }</span>{ _.get(opt, [ 'title' ], '') }{ (!showExplanation) ? '' : <Correcting /> }
                                </div>
                              </Option>
                            </div>
                          )
                        })}
                      </div>
                      <Explanation />
                      <BtnNextQuestion />
                    </div>
                  )
                } else {
                  const answerState = this._computeResult()
                  return (
                    <div className="answer-sheet">
                      <Slider ref="answer-sheet" {...settings}>
                        <div className="result-set">
                          <div className="result-detail">
                            你的測驗結果
                            <div className="correcting" >
                              <img src="/asset/circle.svg"/> { answerState.correct } 題
                            </div>
                            <div className="wrong">
                              <img src="/asset/cross.svg"/> { answerState.wrong } 題
                            </div>
                          </div>
                          <div className="result">
                            <Result results={ _.get(this.props, [ 'questSetting', 'setting', 'results' ], []) }
                                      questions={ questions } answers={ answers } />
                            <div className="button-set">
                              <div className="button-container" onClick={ this._playAgainClick } style={{ cursor: 'pointer' }} >
                                <div className="renew" style={ { backgroundImage: 'url(/asset/icon02_1.svg)' } }></div>
                                <Button value="再玩一次" />
                              </div>　
                              <div className="button-container" onClick={ this._checkAnsClick } style={{ cursor: 'pointer' }} >
                                <div className="check" style={ { backgroundImage: 'url(/asset/icon02_1.svg)' } }></div>
                                <Button value="看答案" />
                              </div>
                            </div>
                          </div>
                        </div>

                        { _.map(questions, (quest, idx) => {
                          const thisDesignatedAnsId = _.get(quest, [ 'designated_option' ])
                          const thisAns = _.get(answers, [ idx ], null)
                          const this_mediaSource = {
                            heroImage: { image: _.get(quest, [ 'image' ] , null) },
                            heroVideo: { video: _.get(quest, [ 'video' ] , null) },
                            audio: { audio: _.get(quest, [ 'audio' ] , null) }
                          }
                          return (
                            <div className="question-set" key={ _.get(quest, [ 'id' ]) }>
                              <div className="question-top">
                                <div className="question-index">
                                  <h3>Ｑ{ (idx + 1) }</h3>
                                </div>
                                <div className="question-content">
                                  <div className="question-content--alignbox">
                                    <Question questionTitle={ _.get(quest, [ 'title' ]) } />
                                    <Leading leading={ leadingType } mediaSource={ this_mediaSource }/>
                                  </div>
                                </div>
                              </div>
                              <div className="options">
                                { _.map(_.get(quest, [ 'options' ]), (opt, i) => {
                                  const Correcting = (() => (
                                    (thisDesignatedAnsId === _.get(opt, [ 'id' ], '')) ? (<img className="correcting" src="/asset/circle.svg"/>) : ((thisAns === _.get(opt, [ 'id' ], '')) ? (<img className="correcting" src="/asset/cross.svg"/>) : (<span></span>))
                                  ))
                                  return (
                                    <div className={ 'option-container' + (((i + 1) !== currOption.length) ? ' border--bottom' : '') } key={ _.get(opt, [ 'id' ], '') }>
                                      <Option optionIndex={ i }>
                                        <div data-qId={ _.get(opt, [ 'id' ], '') } data-designatedAnsId={ thisDesignatedAnsId } data-ans={ thisAns }>
                                          <span className="option-index">{ (i + 1) }</span>{ _.get(opt, [ 'title' ], '') }<Correcting />
                                        </div>
                                      </Option>
                                    </div>
                                  )
                                })}
                              </div>
                              <div className="explanation explanation--check-answer">
                                <div className="explanation-container">
                                  { _.get(quest, [ 'explanation' ]) }
                                </div>
                              </div>
                              <div className="button-set">
                                <div className="button-container" style={{ cursor: 'pointer' }} onClick={ this._goCheckNextQuestClick }>
                                  <Button value="下一題" />
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
    questSetting: state.questSetting || null,
    showExplanation: state.questionnaire.showExplanation || false
  }
}

Questionnaire.contextTypes = {
  device: React.PropTypes.string
}

const PrevArrow = (props) => (
  <div {...props} style={{ background: 'url(' + props.src + ') no-repeat center center', height: '50px', width: '50px', left: '-50px', backgroundSize: 'cover', backgroundColor: { value: 'rgba(255,255,255,0)', important: 'true' } }}></div>
)

PrevArrow.defaultProps = {
  src: '/asset/icon/arrow_left.png'
}

const NextArrow = (props) => (
  <div {...props} style={{ background: 'url(' + props.src + ') no-repeat center center', height: '50px', width: '50px', right: '-50px', backgroundSize: 'cover', backgroundColor: { value: 'rgba(255,255,255,0)', important: 'true' } }}></div>
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
