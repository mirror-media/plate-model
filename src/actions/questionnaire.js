'use strict'
import * as types from '../constants/action-types'
import { formatUrl } from '../utils/index'
import { InternalServerError, NotFoundError } from '../lib/custom-error'


function requestPassAnswer(qId, ans, nextQId, finished, showExplanation) {
  return {
    type: types.PASS_ANSWER_REQUEST,
    qId: qId,
    nextQId: nextQId,
    finished: finished,
    showExplanation: showExplanation,
    ans: ans
  }
}
function requestFetchQuestionnaire(questionnaireId) {
  return {
    type: types.FETCH_QUESTIONNAIRE_REQUEST,
    questionnaireId: questionnaireId
  }
}
function requestResetQuestionnaire(questionnaireId) {
  return {
    type: types.RESET_QUESTIONNAIRE_REQUEST,
    questionnaireId: questionnaireId
  }
}
function requestGoNextQuestion(nextQId, finished) {
  return {
    type: types.GO_NEXT_QUESTION_REQUEST,
    nextQId: nextQId,
    finished: finished
  }
}

function completePassAnswer(qId, ans, nextQId, finished, showExplanation) {
  return {
    type: types.PASS_ANSWER_SUCCESS,
    nextQId: nextQId,
    ans: ans,
    finished: finished,
    showExplanation: showExplanation,
    succAt: Date.now()
  }
}
function completeFetchQuestionnaire(questionnaireId, questSetting) {
  return {
    type: types.FETCH_QUESTIONNAIRE_SUCCESS,
    questionnaireId: questionnaireId,
    questSetting: questSetting,
    succAt: Date.now()
  }
}
function completeResetQuestionnaire(questionnaireId, qId) {
  return {
    type: types.RESET_QUESTIONNAIRE_SUCCESS,
    questionnaireId: questionnaireId,
    qId: qId,
    finished: false,
    succAt: Date.now()
  }
}
function completeGoNextQuestion(nextQId, finished) {
  return {
    type: types.GO_NEXT_QUESTION_SUCCESS,
    nextQId: nextQId,
    finished: finished,
    showExplanation: false,
    succAt: Date.now()
  }
}

function failToPassAnswer(error) {
  return {
    type: types.PASS_ANSWER_FAILURE,
    error,
    failedAt: Date.now()
  }
}
function failToFetchQuestionnaire(error) {
  return {
    type: types.FETCH_QUESTIONNAIRE_FAILURE,
    error,
    failedAt: Date.now()
  }
}
function failToResetQuestionnaire(error) {
  return {
    type: types.RESET_QUESTIONNAIRE_FAILURE,
    error,
    failedAt: Date.now()
  }
}
function failToGoNextQuestion(error) {
  return {
    type: types.GO_NEXT_QUESTION_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function _passAnswer(qId, ans, nextQId, finished, showExplanation) {
  let tmpFinished = ((finished) && (finished === 'true')) ? true : false
  return ((qId && ans && finished) || (qId && ans && nextQId)) ? (new Promise((resolve) => (
    resolve({
      qId: qId,
      ans: ans,
      finished: tmpFinished,
      showExplanation: showExplanation,
      nextQId: nextQId
    })
  ))) : (new Promise((resolve, reject) => (
    reject('[ qId, ans, nextQId ] got bad values supposed to be checked.')
  )))
}
function _fetchQuestionnaire(url) {
  return fetch(url)
    .then((response) => {
      let status = response.status
      if (status === 404) {
        throw new NotFoundError('Resource are not found by url: ', url)
      } else if (status >= 400) {
        throw new InternalServerError('Bad response from API, response: ' + JSON.stringify(response))
      }
      return response.json()
    })
}
function _resetQuestionnaire(questionnaireId, qId) {
  return (questionnaireId && qId) ? (new Promise((resolve) => {
    resolve({
      qId: qId,
      questionnaireId: questionnaireId
    })
  })) : (new Promise((resolve, reject) => (
    reject('got a bad questionnaireId(' + questionnaireId + ') or qId(' + qId + ') supposed to be checked')
  )))
}
function _goNextQuestion(nextQId, finished) {
  let tmpFinished = ((finished) && (finished === 'true')) ? true : false
  return (finished || nextQId) ? (new Promise((resolve) => (
    resolve({
      finished: tmpFinished,
      nextQId: nextQId
    })
  ))) : (new Promise((resolve, reject) => (
    reject('[ nextQId, finished ] got bad values supposed to be checked.')
  )))

}

export function passAnswer(qId, ans, nextQId, finished, showExplanation = false) {
  return (dispatch) => {
    dispatch(requestPassAnswer(qId, ans, nextQId, finished, showExplanation))
    return _passAnswer(qId, ans, nextQId, finished, showExplanation)
      .then((response) => {
        dispatch(completePassAnswer(response.qId, response.ans, response.nextQId, response.finished, response.showExplanation))
      }, (error) => {
        return dispatch(failToPassAnswer(error))
      })
  }
}
export function fetchQuestionnaire(questionnaireId) {
  let url = _buildQuestionnaireQueryUrl(questionnaireId)
  return (dispatch) => {
    dispatch(requestFetchQuestionnaire(questionnaireId))
    return _fetchQuestionnaire(url)
      .then((response) => {
        dispatch(completeFetchQuestionnaire(questionnaireId, response))
      }, (error) => {
        return dispatch(failToFetchQuestionnaire(error))
      })
  }
}
export function resetQuestionnaire(questionnaireId, qId) {
  return (dispatch) => {
    dispatch(requestResetQuestionnaire(questionnaireId))
    return _resetQuestionnaire(questionnaireId, qId)
      .then((response) => {
        dispatch(completeResetQuestionnaire(response.questionnaireId, response.qId))
      }, (error) => {
        return dispatch(failToResetQuestionnaire(error))
      })
  }
}
export function goNextQuestion(nextQId, finished) {
  return (dispatch) => {
    dispatch(requestGoNextQuestion(nextQId, finished))
    return _goNextQuestion(nextQId, finished)
      .then((response) => {
        dispatch(completeGoNextQuestion(response.nextQId, response.finished))
      }, (error) => {
        return dispatch(failToGoNextQuestion(error))
      })
  }
}

function _buildQuestionnaireQueryUrl(questionnaireId) {
  return formatUrl('questionnaire/' + questionnaireId)
}
