'use strict'
import * as types from '../constants/action-types'
import _ from 'lodash'


export function questionnaire(state = {}, action = {}) {
  switch (action.type) {
    case types.PASS_ANSWER_REQUEST:
      return _.merge({}, state, {
        currQuestionId: action.nextQId,
        error: null
      })
    case types.PASS_ANSWER_SUCCESS:
      let tmpAns = state.ans ? state.ans : []
      tmpAns.push(action.ans)
      return _.merge({}, state, {
        currQuestionId: action.nextQId,
        error: null,
        ans: tmpAns,
        finished: action.finished,
        showExplanation: action.showExplanation,
        lastUpdated: action.succAt
      })
    case types.PASS_ANSWER_FAILURE:
      return _.merge({}, state, {
        error: action.error,
        lastUpdated: action.failedAt
      })
    case types.RESET_QUESTIONNAIRE_SUCCESS:
      return _.merge({}, state, {
        questionnaireId: action.questionnaireId,
        currQuestionId: action.qId,
        error: null,
        finished: action.finished,
        ans: null,
        showExplanation: false,
        lastUpdated: action.succAt
      })
    case types.RESET_QUESTIONNAIRE_FAILURE:
      return _.merge({}, state, {
        error: action.error,
        lastUpdated: action.failedAt
      })
    case types.RESET_QUESTIONNAIRE_REQUEST:
      return _.merge({}, state, {
        questionnaireId: action.questionnaireId,
        error: null
      })
    case types.GO_NEXT_QUESTION_SUCCESS:
      return _.merge({}, state, {
        currQuestionId: action.nextQId,
        error: null,
        finished: action.finished,
        showExplanation: action.showExplanation,
        lastUpdated: action.succAt
      })
    case types.GO_NEXT_QUESTION_FAILURE:
      return _.merge({}, state, {
        error: action.error,
        lastUpdated: action.failedAt
      })
    case types.GO_NEXT_QUESTION_REQUEST:
      return _.merge({}, state, {
        currQuestionId: action.nextQId,
        error: null
      })
    default:
      return state
  }
}
export function questSetting(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_QUESTIONNAIRE_SUCCESS:
      return _.merge({}, state, {
        questionnaireId: action.questionnaireId,
        error: null,
        lastUpdated: action.succAt,
        setting: action.questSetting
      })
    case types.FETCH_QUESTIONNAIRE_REQUEST:
      return _.merge({}, state, {
        questionnaireId: action.questionnaireId,
        error: null
      })
    case types.FETCH_QUESTIONNAIRE_FAILURE:
      return _.merge({}, state, {
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}
