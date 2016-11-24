'use strict'
import * as types from '../constants/action-types'
import _ from 'lodash'

function articles(state = {}, action = {}) {
  let _state = {}
  let id = action.id
  switch (action.type) {
    case types.FETCH_ARTICLES_BY_GROUP_UUID_REQUEST:
    case types.FETCH_RELATED_ARTICLES_REQUEST:
      if (state.hasOwnProperty(id)) {
        _.merge(_state, {
          isFetching: true
        })
      } else {
        _.merge(_state, {
          isFetching: true,
          error: null,
          hasMore: false,
          items: []
        })
      }
      return _.merge({}, state, {
        [ id ]: _state
      })

    case types.FETCH_ARTICLES_BY_GROUP_UUID_FAILURE:
    case types.FETCH_RELATED_ARTICLES_FAILURE:
      _.merge(_state, {
        isFetching: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
      return _.merge({}, state, {
        [ id ]: _state
      })

    case types.FETCH_RELATED_ARTICLES_SUCCESS:
      return _.merge({}, state, {
        [ id ]: {
          isFetching: false,
          hasMore: false,
          error: null,
          items: _.get(action, 'relatedIds'),
          total: _.get(action, 'relatedIds.length'),
          lastUpdated: action.receivedAt
        }
      })

    case types.FETCH_ARTICLES_BY_GROUP_UUID_SUCCESS:
      _state = _.get(state, id)
      let total = _.get(_state, 'total') || _.get(action, 'response.meta.total')
      let items = _.get(_state, 'items')
      let hasMore = _.get(_state, 'hasMore')

      // dedup items
      items = _.uniq(items.concat(_.get(action, 'response.result')))

      if (items.length >= total) {
        hasMore = false
      } else {
        hasMore = true
      }

      return _.merge({}, state, {
        [ id ]: {
          isFetching: false,
          hasMore,
          error: null,
          items,
          total,
          lastUpdated: action.receivedAt
        }
      })
    default:
      return state
  }
}

export function relatedArticles(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_RELATED_ARTICLES_REQUEST:
    case types.FETCH_RELATED_ARTICLES_FAILURE:
    case types.FETCH_RELATED_ARTICLES_SUCCESS:
      return articles(state, action)
    default:
      return state
  }
}

export function articlesByUuids(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_ARTICLES_BY_GROUP_UUID_REQUEST:
    case types.FETCH_ARTICLES_BY_GROUP_UUID_FAILURE:
    case types.FETCH_ARTICLES_BY_GROUP_UUID_SUCCESS:
    case types.FETCH_INDEX_ARTICLES_REQUEST:
    case types.FETCH_INDEX_ARTICLES_FAILURE:
    case types.FETCH_INDEX_ARTICLES_SUCCESS:
      return articles(state, action)
    default:
      return state
  }
}

export function sectionFeatured(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_SECTIONS_FEATURED_SUCCESS:
      let res = {}
      for (let section in action.response) {
        res[section] = action['response'][section]['result']
      }
      return _.merge({}, state, {
        isFetching: false,
        fetched: true,
        error: null,
        items: res,
        lastUpdated: action.receivedAt
      })
    case types.FETCH_SECTION_FEATURED_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        fetched: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function choices(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_CHOICES_SUCCESS:
      return {
        isFetching: false,
        fetched: true,
        error: null,
        items: _.get(action, 'response.result'),
        lastUpdated: action.receivedAt
      }
    case types.FETCH_CHOICES_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        fetched: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function latestPosts(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_LATEST_POSTS_SUCCESS:
      let orig = _.values(state['items'])
      let new_array = _.values(_.get(action, 'response.result'))
      return _.merge({}, state, {
        isFetching: false,
        fetched: true,
        error: null,
        items: new_array.concat(orig),
        meta: action.meta,
        links: action.links,
        lastUpdated: action.receivedAt
      })
    case types.FETCH_LATEST_POSTS_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        fetched: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function event(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_EVENT_SUCCESS:
      return _.merge({}, state, {
        isFetching: false,
        fetched: true,
        error: null,
        items: (action.response.length > 0) ? action.response : {},
        meta: action.meta,
        links: action.links,
        lastUpdated: action.receivedAt
      })
    case types.FETCH_EVENT_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        fetched: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function topics(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_TOPICS_SUCCESS:
      let res = {}
      for (let topic in action.response) {
        res[ action['response'][topic]['id'] ] = action['response'][topic]
      }
      return _.merge({}, state, {
        isFetching: false,
        fetched: true,
        error: null,
        items: res,
        meta: action.meta,
        links: action.links,
        lastUpdated: action.receivedAt
      })
    case types.FETCH_TOPICS_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        fetched: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function topic(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_TOPIC_SUCCESS:
      return _.merge({}, state, {
        isFetching: false,
        fetched: true,
        error: null,
        items: action.response,
        lastUpdated: action.receivedAt
      })
    case types.FETCH_TOPIC_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        fetched: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function images(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_IMAGES_SUCCESS:
      return _.merge({}, state, {
        isFetching: false,
        fetched: true,
        error: null,
        items: action.response,
        lastUpdated: action.receivedAt
      })
    case types.FETCH_IMAGES_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        fetched: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function audios(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_AUDIOS_SUCCESS:
      return _.merge({}, state, {
        isFetching: false,
        fetched: true,
        error: null,
        items: action.response,
        meta: action.meta,
        links: action.links,
        lastUpdated: action.receivedAt
      })
    case types.FETCH_AUDIOS_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        fetched: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function sectionList(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_SECTION_LIST_REQUEST:
      return _.merge({}, state, {
        url: action.url,
        lastUpdated: action.requestAt
      })
    case types.FETCH_SECTION_LIST_SUCCESS:
      return _.merge({}, state, {
        error: null,
        fetched: true,
        response: action.response,
        lastUpdated: action.receivedAt
      })
    case types.FETCH_SECTION_LIST_FAILURE:
      return _.merge({}, state, {
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function indexArticles(state = {}, action = {})  {
  switch (action.type) {
    case types.FETCH_INDEX_ARTICLES_REQUEST:
      return _.merge({}, state, {
        isFetching: true,
        error: null
      })
    case types.FETCH_INDEX_ARTICLES_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    default:
      return state
  }
}

export function searchResult(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_SEARCH_RESULT_REQUEST:
      return _.merge({}, state, {
        isFetching: true,
        url: action.url,
        requestAt: action.requestAt
      })
    case types.FETCH_SEARCH_RESULT_SUCCESS:
      return _.merge({}, state, {
        isFetching: false,
        response: action.response,
        receivedAt: action.receivedAt
      })
    case types.FETCH_SEARCH_RESULT_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        error: action.error,
        failedAt: action.failedAt
      })
    default:
      return state
  }
}

export function youtubePlaylist(state = {}, action = {}) {
  switch (action.type) {
    case types.FETCH_YOUTUBE_PLAYLIST_REQUEST:
      return _.merge({}, state, {
        isFetching: true,
        url: action.url,
        requestAt: action.requestAt
      })
    case types.FETCH_YOUTUBE_PLAYLIST_SUCCESS:
      let orig = _.values(state['items'])
      let new_array = _.values(_.get(action, [ 'response', 'items' ], []))
      return _.merge({}, state, {
        isFetching: false,
        items: orig.concat(new_array),
        pageInfo: _.get(action, [ 'response', 'pageInfo' ], {}),
        nextPageToken: _.get(action, [ 'response', 'nextPageToken' ], ''),
        receivedAt: action.receivedAt
      })
    case types.FETCH_YOUTUBE_PLAYLIST_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        error: action.error,
        failedAt: action.failedAt
      })
    default:
      return state
  }
}

export function featureArticles(state = {}, action = {})  {
  switch (action.type) {
    case types.FETCH_FEATURE_ARTICLES_REQUEST:
      return _.merge({}, state, {
        isFetching: true,
        error: null
      })
    case types.FETCH_FEATURE_ARTICLES_FAILURE:
      return _.merge({}, state, {
        isFetching: false,
        error: action.error,
        lastUpdated: action.failedAt
      })
    case types.FETCH_FEATURE_ARTICLES_SUCCESS:
      return {
        isFetching: false,
        error: null,
        items: _.get(action, 'response.result'),
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}
