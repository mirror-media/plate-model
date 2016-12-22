/*eslint no-unused-vars:0, no-console:0 */
/* global __DEVELOPMENT__, $ */
'use strict'
import { GAID, QUESTIONNAIRE, SITE_META } from '../constants/index'
import { connect } from 'react-redux'
import { fetchQuestionnaire, goNextQuestion, passAnswer, resetQuestionnaire } from '../actions/questionnaire.js'
import { setPageType, setPageTitle } from '../actions/header'
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
import ga from 'react-ga'

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
    this._goCheckNextQuestClick = this._goCheckNextQuestClick.bind(this)
    this._shareResultClick = this._shareResultClick.bind(this)
    this._closeShareToolBox = this._closeShareToolBox.bind(this)
    this._getResultTitle = this._getResultTitle.bind(this)
  }

  componentDidMount() {
    ga.initialize(GAID, { debug: __DEVELOPMENT__ })
    ga.pageview(this.props.location.pathname)

    const questionnaireTitle = _.get(this.props, [ 'questSetting', 'setting', 'title' ])
    this.props.setPageType(QUESTIONNAIRE)
    this.props.setPageTitle('', questionnaireTitle)

  }

  componentWillMount() {
    if(!_.get(this.props, [ 'questSetting' ], null) || !_.get(this.props, [ 'questSetting', 'setting' ], null)) {
      this.props.fetchQuestionnaire(_.get(this.props.params, [ 'questionnaireId' ], ''))
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      ga.pageview(nextProps.location.pathname)
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
    const { ans: answerSheet = [] } = this.props
    const gameFlow = _.get(this.props, [ 'questSetting', 'setting', 'gameFlow' ], 'ONCE')
    let qId = _.get(e, [ 'target', 'attributes', 'data-qId', 'value' ])
    let nextQId = _.get(e, [ 'target', 'attributes', 'data-nextQId', 'value' ])
    let ans = _.get(e, [ 'target', 'attributes', 'data-ans', 'value' ])

    if(answerSheet.length === 0) {
      ga.event({
        category: 'questionnaire',
        action: 'click',
        label: 'play'
      })
    }

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
    const { '0': countWrong = 0 } = _.countBy(scoreArr)
    return {
      correct: (questions.length - countWrong),
      wrong: countWrong
    }
  }

  _getResultTitle() {
    const {
      ans: answers = [],
      questSetting: {
        setting: {
          questions = [],
          results = []
        }
      }
    } = this.props
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
    return rs
  }

  _closeShareToolBox() {
    this.setState({
      openShareBtn : false
    })
  }

  _shareResultClick() {
    const rs = this._getResultTitle()
    window.addthis.update('share', 'url', `${SITE_META.URL}q/${_.get(this.props, [ 'params', 'questionnaireId' ])}/${rs.id}`)
    window.addthis.update('share', 'description', rs.title)
    window.addthis.update('share', 'picture', 'https:' + _.get(rs, [ 'image', 'url' ], ''))
    window.addthis.update('share', 'image', 'https:' + _.get(rs, [ 'image', 'url' ], ''))
    window.addthis.url = `${SITE_META.URL}q/${_.get(this.props, [ 'params', 'questionnaireId' ])}/${rs.id}`
    window.addthis.picture = 'https:' + _.get(rs, [ 'image', 'url' ])
    window.addthis.image = 'https:' + _.get(rs, [ 'image', 'url' ])
    this.setState({
      openShareBtn : true,
      dataUrl : `${SITE_META.URL}q/${_.get(this.props, [ 'params', 'questionnaireId' ])}/${rs.id}`
    })
  }

  render() {
    const {
      ans: answers = null,
      finished,
      params: {
        questionnaireId = '',
        resultIdForOg = ''
      },
      questSetting: {
        setting: {
          description: questionnaireDesc = '',
          image: questionnaireImg = null,
          leading: leadingType = 'image',
          questions = [],
          results = [],
          subtitle: questionnaireSubTitle = '',
          title: questionnaireTitle = '',
          titleCustomized: questionnaireTitleCust = '',
          type: questionnaireType = 'quiz'
        }
      },
      showExplanation
    } = this.props
    const currQuestionId = this.props.currQuestionId ? this.props.currQuestionId : _.get(questions, [ 0, 'id' ])
    const currQuestion = _.find(questions, { id : currQuestionId })
    const currQuestionIdx = _.findIndex(questions, { id : currQuestionId })
    const { [ currQuestionIdx ] : ans = null } = answers
    const {
      length: totalQuestions = 0,
      [currQuestionIdx + 1]: {
        id: nextQuestionId
      } = { id: undefined }
    } = questions

    const finishedFlag = ((currQuestionIdx + 1) === totalQuestions) ? true : false
    const {
      designated_option: designatedAnsId = '',
      options: currOption = [],
      title: currQuestionTitle = ''
    } = currQuestion

    const mediaSource = {
      audio: { audio: _.get(currQuestion, [ 'audio' ] , null) },
      heroImage: { image: _.get(currQuestion, [ 'image' ] , null) },
      heroVideo: { video: _.get(currQuestion, [ 'video' ] , null) }
    }
    const meta = {
      auto: { ograph: true },
      canonical: `${SITE_META.URL}q/${questionnaireId}`,
      description: questionnaireDesc? questionnaireDesc : '',
      meta: { property: {
        'og:image' : (resultIdForOg.length > 0) ? _.get(_.find(results, { id : resultIdForOg }), [ 'image', 'url' ], '') : (questionnaireImg? questionnaireImg.url : '')
      } },
      title: questionnaireTitle ? questionnaireTitle : ''
    }

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      cssEase: 'linear',
      draggable: (questionnaireType !== 'quiz') ? false : true,
      swipeToSlide : (questionnaireType !== 'quiz') ? false : true,
      touchMove : (questionnaireType !== 'quiz') ? false : true,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />
    }
    return (
      <DocumentMeta {...meta}>

        <div id="main" className="pusher middle">
          <div className="Questionnaire" ref="questionnaire"
          data-questionnaireId={ questionnaireId }
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
                  return (
                    <div className="question-set">
                      <div className="question-top">
                        <div className="question-index">
                          <h3>Ｑ{ (currQuestionIdx + 1) }</h3>
                        </div>
                        <div className="question-content">
                          <div className="question-content--alignbox">
                            <Question questionTitle={ currQuestionTitle } />
                            <div style={{ minHeight: '20px' }}>
                              <Leading leading={ leadingType } mediaSource={ mediaSource }/>
                            </div>
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
                                  <span className="option-index" data-qId={ currQuestionId } data-nextQId={ nextQuestionId } data-ans={ _.get(opt, [ 'id' ], '') }>{ (idx + 1) }</span>
                                  <div className="option-content" data-qId={ currQuestionId } data-nextQId={ nextQuestionId } data-ans={ _.get(opt, [ 'id' ], '') }>
                                    <span data-qId={ currQuestionId } data-nextQId={ nextQuestionId } data-ans={ _.get(opt, [ 'id' ], '') }>{ _.get(opt, [ 'title' ], '') }</span>
                                  </div>
                                  { (!showExplanation) ? '' : <Correcting /> }
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
                            <ShowResultDetail answerState={ answerState } ifShow={ (questionnaireType === 'quiz') ? true : false }/>
                          </div>
                          <div className="result">
                            <Result results={ results }
                                      questions={ questions } answers={ answers } />
                            <div className="button-set">
                              <div className="button-container" onClick={ this._playAgainClick } style={{ cursor: 'pointer' }} >
                                <div className="renew" style={ { backgroundImage: 'url(/asset/icon02_1.svg)' } }></div>
                                <Button value="再玩一次" />
                              </div>　
                              { (questionnaireType === 'quiz') ? (
                                <div className="button-container" onClick={ this._checkAnsClick } style={{ cursor: 'pointer', marginBottom: '20px' }} >
                                  <div className="check" style={ { backgroundImage: 'url(/asset/icon02_1.svg)' } }></div>
                                  <Button value="看答案" />
                                </div>
                              ) : (<div style={{ display: 'inline-block' }}></div>) }
                              <div className="button-container share" onClick={ this._shareResultClick } style={{ cursor: 'pointer' }}>
                                <Button value="分享結果" />
                              </div>
                            </div>
                          </div>
                        </div>
                        { (questionnaireType === 'quiz') ? _.map(questions, (quest, idx) => {
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
                                          <span className="option-index">{ (i + 1) }</span>
                                          <div className="option-content"><span>{ _.get(opt, [ 'title' ], '') }</span></div>
                                          <Correcting />
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
                        }) : null }
                      </Slider>
                    </div>
                  )
                }
              })()}
              <div className="shareToolBox" style={ !(_.get(this.state, [ 'openShareBtn' ], false)) ? { display: 'none' } : {} } onClick={ this._closeShareToolBox }>
                <div className="addthis_inline_share_toolbox"></div>
              </div>
            </div>
          </div>
          <script src="https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-584ebe7679d47dc7"></script>
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

const ShowResultDetail = (props) => (
  (props.ifShow) ? (
    <div style={ { display: 'inline-block' } }>
      <div className="correcting" >
        <img src="/asset/circle.svg"/> { props.answerState.correct } 題
      </div>
      <div className="wrong">
        <img src="/asset/cross.svg"/> { props.answerState.wrong } 題
      </div>
    </div>
  ) : (<div></div>)
)

ShowResultDetail.defaultProps = {
  ifShow: true
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
