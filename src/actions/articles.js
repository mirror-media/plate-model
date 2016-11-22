'use strict'
import { CATEGORY, SECTION, TAG, TOPIC } from '../constants/index'
import { InternalServerError, NotFoundError } from '../lib/custom-error'
import { arrayOf, normalize } from 'normalizr'
import { article as articleSchema } from '../schemas/index'
import { camelizeKeys } from 'humps'
import { formatUrl, getArticleEmbeddedQuery } from '../utils/index'
import _ from 'lodash'
import * as types from '../constants/action-types'
import fetch from 'isomorphic-fetch'
import qs from 'qs'

function requestArticlesByUuid(id, url) {
  return {
    type: types.FETCH_ARTICLES_BY_GROUP_UUID_REQUEST,
    id,
    url
  }
}

function failToReceiveArticlesByUuid(id, error) {
  return {
    type: types.FETCH_ARTICLES_BY_GROUP_UUID_FAILURE,
    id,
    error,
    failedAt: Date.now()
  }
}

function receiveArticlesByUuid(response, id) {
  return {
    type: types.FETCH_ARTICLES_BY_GROUP_UUID_SUCCESS,
    id,
    response,
    receivedAt: Date.now()
  }
}

function requestRelatedArticles(id, relatedIds, url) {
  return {
    type: types.FETCH_RELATED_ARTICLES_REQUEST,
    id,
    relatedIds,
    url
  }
}

function failToReceiveRelatedArticles(id, relatedIds, error) {
  return {
    type: types.FETCH_RELATED_ARTICLES_FAILURE,
    id,
    relatedIds,
    error,
    failedAt: Date.now()
  }
}

function receiveRelatedArticles(response, id, relatedIds) {
  return {
    type: types.FETCH_RELATED_ARTICLES_SUCCESS,
    id,
    relatedIds,
    response,
    receivedAt: Date.now()
  }
}

function requestFeatureArticles(url) {
  return {
    type: types.FETCH_FEATURE_ARTICLES_REQUEST,
    url
  }
}

function failToReceiveFeatureArticles(error) {
  return {
    type: types.FETCH_FEATURE_ARTICLES_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function receiveFeaturedArticles(response) {
  return {
    type: types.FETCH_FEATURE_ARTICLES_SUCCESS,
    response,
    receivedAt: Date.now()
  }
}

function requestIndexArticles(url) {
  return {
    type: types.FETCH_INDEX_ARTICLES_REQUEST,
    url
  }
}

function requestEvent(url) {
  return {
    type: types.FETCH_EVENT_REQUEST,
    url
  }
}

function requestTopics(url) {
  return {
    type: types.FETCH_TOPICS_REQUEST,
    url
  }
}

function requestTopic(url) {
  return {
    type: types.FETCH_TOPIC_REQUEST,
    url
  }
}

function requestImages(url) {
  return {
    type: types.FETCH_IMAGES_REQUEST,
    url
  }
}

function failToReceiveIndexArticles(error) {
  return {
    type: types.FETCH_INDEX_ARTICLES_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function failToReceiveLatestPosts(error) {
  return {
    type: types.FETCH_LATEST_POSTS_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function failToReceiveEvent(error) {
  return {
    type: types.FETCH_EVENT_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function failToReceiveTopics(error) {
  return {
    type: types.FETCH_TOPICS_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function failToReceiveTopic(error) {
  return {
    type: types.FETCH_TOPIC_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function failToReceiveImages(error) {
  return {
    type: types.FETCH_IMAGES_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function receiveSectionFeatured(response) {
  return {
    type: types.FETCH_SECTIONS_FEATURED_SUCCESS,
    response,
    receivedAt: Date.now()
  }
}

function failToReceiveSectionFeatured(error) {
  return {
    type: types.FETCH_SECTIONS_FEATURED_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function receiveChoices(response) {
  return {
    type: types.FETCH_CHOICES_SUCCESS,
    response,
    receivedAt: Date.now()
  }
}

function failToReceiveChoices(error) {
  return {
    type: types.FETCH_CHOICES_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function receiveLatestPosts(response, meta, links) {
  return {
    type: types.FETCH_LATEST_POSTS_SUCCESS,
    response,
    meta,
    links,
    receivedAt: Date.now()
  }
}

function receiveEvent(response, meta, links) {
  return {
    type: types.FETCH_EVENT_SUCCESS,
    response,
    meta,
    links,
    receivedAt: Date.now()
  }
}

function receiveTopics(response, meta, links) {
  return {
    type: types.FETCH_TOPICS_SUCCESS,
    response,
    meta,
    links,
    receivedAt: Date.now()
  }
}

function receiveTopic(response) {
  return {
    type: types.FETCH_TOPIC_SUCCESS,
    response,
    receivedAt: Date.now()
  }
}

function receiveImages(response) {
  return {
    type: types.FETCH_IMAGES_SUCCESS,
    response,
    receivedAt: Date.now()
  }
}

function receivedSectionList(response) {
  return {
    type: types.FETCH_SECTION_LIST_SUCCESS,
    response,
    receivedAt: Date.now()
  }
}

function failToReceiveSectionList(error) {
  return {
    type: types.FETCH_SECTION_LIST_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function requestSearchResult(url) {
  return {
    type: types.FETCH_SEARCH_RESULT_REQUEST,
    url,
    requestAt: Date.now()
  }
}

function receiveSearchResult(response) {
  return {
    type: types.FETCH_SEARCH_RESULT_SUCCESS,
    response,
    receivedAt: Date.now()
  }
}

function failToReceiveSearchResult(error) {
  return {
    type: types.FETCH_SEARCH_RESULT_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function requestYoutubePlaylist(url) {
  return {
    type: types.FETCH_YOUTUBE_PLAYLIST_REQUEST,
    url,
    requestAt: Date.now()
  }
}

function receiveYoutubePlaylist(response) {
  return {
    type: types.FETCH_YOUTUBE_PLAYLIST_SUCCESS,
    response,
    receivedAt: Date.now()
  }
}

function failToReceiveYoutubePlaylist(error) {
  return {
    type: types.FETCH_YOUTUBE_PLAYLIST_FAILURE,
    error,
    failedAt: Date.now()
  }
}

function _buildQuery(params = {}) {
  let query = {}
  let whitelist = [ 'where', 'embedded', 'max_results', 'page', 'sort' ]
  _.forEach(whitelist, (ele) => {
    if (params.hasOwnProperty(ele)) {
      if (ele === 'where' || ele === 'embedded') {
        query[ele] = JSON.stringify(params[ele])
      } else {
        query[ele] = params[ele]
      }
    }
  })
  query = qs.stringify(query)
  return query
}

function _buildPostQueryUrl(params = {}) {
  let query = _buildQuery(params)
  return formatUrl(`posts?${query}`)
}

function _buildMetaQueryUrl(params = {}) {
  let query = _buildQuery(params)
  return formatUrl(`meta?${query}`)
}

function _buildTopicQueryUrl(params = {}, slug= '') {
  let query = _buildQuery(params)
  return formatUrl(`topics/${slug}?${query}`)
}

function _buildEventQueryUrl(params = {}, slug= '') {
  let query = _buildQuery(params)
  return formatUrl(`event/${slug}?${query}`)
}

function _buildImageQueryUrl(params = {}) {
  let query = _buildQuery(params)
  return formatUrl(`images?${query}`)
}

function _buildUrl(params = {}, target) {
  params = params || {}
  params.sort = params.sort || '-publishedDate'
  if (target === 'meta') {
    return _buildMetaQueryUrl(params)
  }
  return _buildPostQueryUrl(params)
}


function _setupWhereInParam(key, value, params={}) {
  params = params || {}
  value = Array.isArray(value) ? value : [ value ]
  let where = {}
  if (value.length > 0) {
    _.merge(where, params.where, {
      [key]: {
        '$in': value
      }
    })
  }
  params.where = where
  return params
}

function _fetchArticles(url) {
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

export function makeSearchQuery(keyword) {
  let url = formatUrl('search?query=' + keyword)
  return (dispatch) => {
    dispatch(requestSearchResult(url))
    return _fetchArticles(url)
      .then((response) => {
        dispatch(receiveSearchResult(response))
      }, (error) => {
        dispatch(failToReceiveSearchResult(error))
      })
  }
}

export function fetchYoutubePlaylist(limit = 10, pageToken = '') {
  let url = formatUrl('playlist?maxResults=' + limit + '&pageToken=' + pageToken)
  return (dispatch) => {
    dispatch(requestYoutubePlaylist(url))
    return _fetchArticles(url)
      .then((response) => {
        dispatch(receiveYoutubePlaylist(response))
      }, (error) => {
        dispatch(failToReceiveYoutubePlaylist(error))
      })
  }
}

export function fetchLatestPosts(params = {}) {
  let url = _buildPostQueryUrl(params)
  return (dispatch) => {
    dispatch(requestIndexArticles('Request Latest Post: ' + url))
    return _fetchArticles(url)
      .then((response) => {
        let meta = response._meta
        let links = response._links
        let camelizedJson = camelizeKeys(response)
        response = normalize(camelizedJson.items, arrayOf(articleSchema))
        dispatch(receiveLatestPosts(response, meta, links))
      }, (error) => {
        return dispatch(failToReceiveLatestPosts(error))
      })
  }
}

export function fetchEvent(params = {}) {
  let url = _buildEventQueryUrl(params)
  return (dispatch) => {
    dispatch(requestEvent('Request Event: ' + url))
    return _fetchArticles(url)
      .then((response) => {
        let meta = response._meta
        let links = response._links
        let camelizedJson = camelizeKeys(response)
        dispatch(receiveEvent(camelizedJson.items, meta, links))
      }, (error) => {
        return dispatch(failToReceiveEvent(error))
      })
  }
}

export function fetchTopics(params = {}) {
  let url = _buildTopicQueryUrl(params)
  return (dispatch) => {
    dispatch(requestTopics('Request Topics: ' + url))
    return _fetchArticles(url)
      .then((response) => {
        let meta = response._meta
        let links = response._links
        let camelizedJson = camelizeKeys(response)
        dispatch(receiveTopics(camelizedJson.items, meta, links))
      }, (error) => {
        return dispatch(failToReceiveTopics(error))
      })
  }
}

export function fetchTopic(slug) {
  let url = _buildTopicQueryUrl({}, slug)
  return (dispatch) => {
    dispatch(requestTopic('Request Topic: ' + url))
    return _fetchArticles(url)
      .then((response) => {
        let camelizedJson = camelizeKeys(response)
        dispatch(receiveTopic(camelizedJson))
      }, (error) => {
        return dispatch(failToReceiveTopic(error))
      })
  }
}

export function fetchImages(type = '', uuid, params = {}) {
  switch (type) {
    case SECTION:
      params = _setupWhereInParam('sections', [ uuid ], params)
      break
    case CATEGORY:
      params = _setupWhereInParam('categories', [ uuid ], params)
      break
    case TAG:
      params = _setupWhereInParam('tags', [ uuid ], params)
      break
    case TOPIC:
      params = _setupWhereInParam('topics', [ uuid ], params)
      break
    default:
      return Promise.resolve()
  }
  let url = _buildImageQueryUrl(params)
  return (dispatch) => {
    dispatch(requestImages('Request Images: ' + url))
    return _fetchArticles(url)
      .then((response) => {
        let camelizedJson = camelizeKeys(response)
        dispatch(receiveImages(camelizedJson))
      }, (error) => {
        return dispatch(failToReceiveImages(error))
      })
  }
}

export function fetchIndexArticles(endpoints = []) {
  let mapped = _.map(endpoints, (n) => { return 'endpoint=' + n })
  let combo_params = mapped.join('&')
  let url = formatUrl('combo?' + combo_params)
  return (dispatch) => {
    dispatch(requestIndexArticles(url))
    return _fetchArticles(url)
      .then((response) => {
        let resp_data = response['_endpoints']
        for (let e in resp_data) {
          if (e == 'posts') {
            if (resp_data.hasOwnProperty(e)) {
              let meta = resp_data[e]['_meta']
              let links = resp_data[e]['_links']
              let camelizedJson = camelizeKeys(resp_data[e])
              resp_data[e] = normalize(camelizedJson.items, arrayOf(articleSchema))
              dispatch(receiveLatestPosts(resp_data['posts'], meta, links))
            } else {
              dispatch(failToReceiveLatestPosts('There is no such key in indexArticles'))
            }
          } else if (e == 'choices') {
            if (resp_data.hasOwnProperty(e)) {
              let camelizedJson = camelizeKeys(resp_data[e])
              resp_data[e] = normalize(camelizedJson.items, arrayOf(articleSchema))
              dispatch(receiveChoices(resp_data['choices']))
            } else {
              dispatch(failToReceiveChoices('There is no such key in indexArticles'))
            }
          } else if (e == 'sectionfeatured') {
            if (resp_data.hasOwnProperty(e)) {
              let camelizedJson = camelizeKeys(resp_data[e])
              resp_data[e] = {}
              for (let section in camelizedJson.items) {
                if (camelizedJson.items[section] != undefined) {
                  resp_data[e][section] = normalize(camelizedJson.items[section], arrayOf(articleSchema))
                }
              }
              dispatch(receiveSectionFeatured(resp_data['sectionfeatured']))
            } else {
              dispatch(failToReceiveSectionFeatured('There is no such key in indexArticles'))
            }
          } else if (e == 'sections') {
            if (resp_data.hasOwnProperty(e)) {
              let camelizedJson = camelizeKeys(resp_data[e])
              let dispatch_data = {}
              dispatch_data['sections'] = camelizedJson['items']
              dispatch_data['categories'] = {}
              for (let c in camelizedJson['items']) {
                for (let i in camelizedJson['items'][c]['categories']) {
                  if( _.get( camelizedJson, [ 'items', c, 'categories', i, 'name' ], undefined) )
                    dispatch_data['categories'][ _.get( camelizedJson, [ 'items', c, 'categories', i, 'name' ], undefined) ] = camelizedJson['items'][c]['categories'][i]
                }
              }
              dispatch(receivedSectionList(dispatch_data))
            } else {
              dispatch(failToReceiveSectionList('Fetching section list failed'))
            }
          }
        }
      }, (error) => {
        return dispatch(failToReceiveIndexArticles(error))
      })
  }
}

/* Fetch related articles' meta of one certain article
 * properties of meta: subtitle, name, heroImage, title, topics, publishedDate, slug, links, created and id
 * @param {string} articleId
 * @param {string[]} relatedIds - related article ids
 * @param {object} params - params for composing query param of api
 * @param {string} [params.sort=-publishedDate] -the way returned articles are sorted by
 * @param {object} params.where - where query param
 * @param {object} params.embedded - embedded query param
 * @param {boolean} isOnlyMeta - if true, only get metadata of articles. Otherwise, get full articles.
 */
export function fetchRelatedArticlesIfNeeded(articleId, relatedIds, params = {}, isOnlyMeta = true) {
  return (dispatch, getState) => {
    if (!articleId) {
      return Promise.resolve()
    }
    let articles = _.get(getState(), [ 'entities', 'articles' ], {})
    let idsToFetch = []

    _.forEach(relatedIds, (id) => {
      if (!_.has(articles, id)) {
        idsToFetch.push(id)
      }
    })

    if (_.get(idsToFetch, 'length', 0) === 0) {
      return Promise.resolve()
    }

    params = _setupWhereInParam('_id', idsToFetch, params)

    if (!isOnlyMeta) {
      // add default embedded
      params.embedded = params.embedded ? params.embedded : getArticleEmbeddedQuery()
    }

    let url = _buildUrl(params, isOnlyMeta ? 'meta' : 'article')
    dispatch(requestRelatedArticles(articleId, idsToFetch, url))
    return _fetchArticles(url)
      .then((response) => {
        let camelizedJson = camelizeKeys(response)
        let normalized = normalize(camelizedJson.items, arrayOf(articleSchema))
        return dispatch(receiveRelatedArticles(normalized, articleId, idsToFetch))
      }, (error) => {
        return dispatch(failToReceiveRelatedArticles(articleId, idsToFetch, error))
      })
  }
}

/* Fetch meta of articles according to one group uuid.
 * Group uuid could be Category, Tag or Topic uuid.
 * properties of meta: subtitle, name, heroImage, title, topics, publishedDate, slug, links, created and id
 * @param {string} uuid - Category, Tag or Topic uuid
 * @param {string} type - CATEGORY, TAG or TOPIC
 * @param {object} params - params for composing query param of api
 * @param {string} [params.sort=-publishedDate] -the way returned articles are sorted by
 * @param {object} params.where - where query param
 * @param {object} params.embedded - embedded query param
 * @param {boolean} isOnlyMeta - if true, only get metadata of articles. Otherwise, get full articles.
 */
export function fetchArticlesByUuidIfNeeded(uuid = '', type = '', params = {}, isOnlyMeta = true) {
  return (dispatch, getState) => {
    if (!uuid || _.get(getState(), [ 'articlesByUuids', uuid, 'hasMore' ]) === false) {
      return Promise.resolve()
    }

    switch (type) {
      case SECTION:
        params = _setupWhereInParam('sections', [ uuid ], params)
        break
      case CATEGORY:
        params = _setupWhereInParam('categories', [ uuid ], params)
        break
      case TAG:
        params = _setupWhereInParam('tags', [ uuid ], params)
        break
      case TOPIC:
        params = _setupWhereInParam('topics', [ uuid ], params)
        break
      default:
        return Promise.resolve()
    }

    if (!isOnlyMeta) {
      // add default embedded
      params.embedded = params.embedded ? params.embedded : getArticleEmbeddedQuery()
    }

    let url = _buildUrl(params, isOnlyMeta ? 'meta' : 'article')
    dispatch(requestArticlesByUuid(uuid, url))
    return _fetchArticles(url)
      .then((response) => {
        let camelizedJson = camelizeKeys(response)
        let normalized = normalize(camelizedJson.items, arrayOf(articleSchema))
        _.merge(normalized, { links: camelizedJson.links, meta: camelizedJson.meta })
        return dispatch(receiveArticlesByUuid(normalized, uuid))
      }, (error) => {
        return dispatch(failToReceiveArticlesByUuid(uuid, error))
      })

  }
}

/* Fetch meta of articles whose 'isFeature' field is true
 * properties of meta: subtitle, name, heroImage, title, topics, publishedDate, slug, links, created and id
 * @param {object} params - params for composing query param of api
 * @param {string} [params.sort=-publishedDate] -the way returned articles are sorted by
 * @param {object} params.where - where query param
 * @param {object} params.embedded - embedded query param
 * @param {boolean} isOnlyMeta - if true, only get metadata of articles. Otherwise, get full articles.
 */
export function fetchFeatureArticles(params = {}, isOnlyMeta = true) {
  const limit = 6
  const page = 1

  return (dispatch) => {
    params = params || {}
    params.where = _.merge({}, params.where, {
      isFeatured: true
    })
    params.max_results = params.max_results || limit
    params.page = params.page || page

    let url = _buildUrl(params, isOnlyMeta ? 'meta' : 'article')
    dispatch(requestFeatureArticles(url))
    return _fetchArticles(url)
      .then((response) => {
        let camelizedJson = camelizeKeys(response)
        let normalized = normalize(camelizedJson.items, arrayOf(articleSchema))
        return dispatch(receiveFeaturedArticles(normalized))
      }, (error) => {
        return dispatch(failToReceiveFeatureArticles(error))
      })
  }
}

// no need temporarily
/*
function _getListId(target = 'category') {
  if (__DEVELOPMENT__) { // eslint-disable-line
    return target === 'category' ? devCatListId : devTopicListId
  }
  return target === 'category' ? prodCatListId : prodTopicListId
}

export function fetchArticlesByTopicIdNameIfNeeded(topicName = '', params = {} , isOnlyMeta = true) {
  let listId = _getListId('topic')
  let topicId = listId[topicName]
  return fetchArticlesByTopicIdIfNeeded(topicId, params, isOnlyMeta)
}

function _fetchArticlesByListName(name = '', params = {}, isOnlyMeta = true, target) {
  let listId = _getListId(target)
  let id = listId[name]
  params = params || {}
  params.max_results = params.max_results || 10
  params.page = params.page || 1
  return target === 'category' ? fetchArticlesByCatIdIfNeeded(id, params, isOnlyMeta) : fetchArticlesByTagIdIfNeeded(id, params, isOnlyMeta)
}

export function fetchArticlesByCatNameIfNeeded(catName = '', params = {}, isOnlyMeta = true) {
  return _fetchArticlesByListName(catName, params, isOnlyMeta, 'category')
}

export function fetchArticlesByTagNameIfNeeded(tagName = '', params = {}, isOnlyMeta = true) {
  return _fetchArticlesByListName(tagName, params, isOnlyMeta, 'tag')
}

*/
