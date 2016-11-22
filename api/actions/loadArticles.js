/*eslint no-console: 0*/

import _ from 'lodash'
import superAgent from 'superagent'
import config from '../config'
import constants from '../constants'
import querystring from 'qs'

function rewriteAliasUrl(query, content) {
  const { API_PROTOCOL, API_PORT, API_HOST, WHERE_REWRITE } = config
  let url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/meta`
  if (_.has(query, 'where')) {
    let where_obj = JSON.parse(query.where)
    for (let collection in where_obj) {
      if (_.indexOf(WHERE_REWRITE, collection)) {
        if  (_.has(where_obj[collection], '$in')) {
          url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/posts-alias`
          query['collection'] = collection
          query['name'] = where_obj[collection]['$in'][0]
          query['where'] = undefined
          if (content == 'meta') { query['content'] = 'meta' }
        }
      }
    }
  }
  return { 'url': url, 'query': query }
}

export function loadMetaOfArticles(req) {
  return new Promise((resolve, reject) => {
    let request = rewriteAliasUrl(req.query, 'meta')
    superAgent['get'](request.url)
      .timeout(constants.timeout)
      .query(request.query)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      })
  })
}

export function loadSearch(req) {
  return new Promise((resolve, reject) => {
    let query = req.query
    const { SEARCH_PROTOCOL, SEARCH_HOST, SEARCH_ENDPOINT, SEARCH_API_KEY, SEARCH_API_APPID } = config
    let url = `${SEARCH_PROTOCOL}://${SEARCH_HOST}${SEARCH_ENDPOINT}`
    superAgent['get'](url)
      .timeout(2000)
      .set('X-Algolia-API-Key', SEARCH_API_KEY)
      .set('X-Algolia-Application-Id', SEARCH_API_APPID)
      .query(query)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      })
  })
}

export function loadPlaylist(req) {
  return new Promise((resolve, reject) => {
    let query = req.query
    const { YOUTUBE_PLAYLIST_ID, YOUTUBE_API_KEY } = config
    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
    superAgent['get'](url)
      .timeout(2000)
      .query(query)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      })
  })
}

export function loadCombo(req) {
  return new Promise((resolve, reject) => {
    const query = req.query
    const { API_PROTOCOL, API_PORT, API_HOST } = config
    let url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/combo`
    superAgent['get'](url)
      .timeout(constants.timeout)
      .query(query)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      })
  })
}

export function loadSectionList(req) {
  return new Promise((resolve, reject) => {
    const query = req.query
    const { API_PROTOCOL, API_PORT, API_HOST } = config
    let url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/sections`
    superAgent['get'](url)
      .timeout(constants.timeout)
      .query(query)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      })
  })
}

export function loadTopicList(req, params = []) {
  return new Promise((resolve, reject) => {
    const query = req.query
    const { API_PROTOCOL, API_PORT, API_HOST } = config
    let url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/topics`
    let slug = typeof params[0] === 'string' ? params[0] : null
    url = slug ? `${url}/${slug}` : url
    superAgent['get'](url)
      .timeout(constants.timeout)
      .query(query)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      })
  })
}

export function loadEventList(req, params = []) {
  return new Promise((resolve, reject) => {
    const query = req.query
    const { API_PROTOCOL, API_PORT, API_HOST } = config
    let url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/event`
    let slug = typeof params[0] === 'string' ? params[0] : null
    url = slug ? `${url}/${slug}` : url
    superAgent['get'](url)
      .timeout(constants.timeout)
      .query(query)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      })
  })
}

export function loadImages(req, params = []) {
  return new Promise((resolve, reject) => {
    const query = req.query
    const { API_PROTOCOL, API_PORT, API_HOST } = config
    let url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/images`
    let slug = typeof params[0] === 'string' ? params[0] : null
    url = slug ? `${url}/${slug}` : url
    superAgent['get'](url)
      .timeout(constants.timeout)
      .query(query)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body)
        }
      })
  })
}

export function loadArticles(req, params = []) {
  return new Promise((resolve, reject) => {
    const query = req.query
    const { API_PROTOCOL, API_PORT, API_HOST } = config
    let url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/posts`
    let slug = typeof params[0] === 'string' ? params[0] : null
    url = slug ? `${url}/${slug}` : url
    superAgent['get'](url).timeout(constants.timeout)
    .query(query)
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        const embedded = JSON.parse(_.get(query, 'embedded', null))
        let aricleRes = res.body
        let writers =  []
        const list = [ 'writters', 'photographers', 'designers', 'engineers' ]
        list.forEach((item) => {
          let aArr = _.get(aricleRes, item, [])
          aArr.forEach((author) => {
            if(author.image) {
              writers.push(author.image)
            }
          })
        })

        // combine author images data if the query contains 'authorImages'
        if(_.get(embedded, 'authorImages')) {
          const imgIds = _.uniq(writers)
          const imgQuery = querystring.stringify({ where: JSON.stringify({ _id: { '$in': imgIds } } ) })
          const imgUrl = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/images?${imgQuery}`

          superAgent['get'](imgUrl).timeout(constants.timeout)
          .end(function (err, res) {
            if (err) {
              console.warning('AUTHOR IMAGE LOADING FAILED:', err)
            } else {
              const imgItems = _.get(res.body, '_items')

              list.forEach((item) => {
                let authors = _.get(aricleRes, item, [])
                addImage(authors, imgItems)
              })
            }
            resolve(aricleRes)
          })
        } else {
          resolve(aricleRes)
        }
      }
    })
  })
}

function addImage(authors, imgItems) {
  authors.forEach((author) => {
    if(author.image) {
      let match = _.filter(imgItems, '_id', author.image)
      const wImg = _.get(match, [ 0, 'image' ])
      author.image = wImg
    }
  })
}
