/*eslint no-console: 0*/

import { mapUrl } from './utils/url.js'
import * as actions from './actions/index'
import apiConfig from '../api/config'
import config from '../server/config'
import express from 'express'
import PrettyError from 'pretty-error'

const { REDIS_PORT, REDIS_HOST, REDIS_AUTH } = apiConfig
const pretty = new PrettyError()
const app = express()

let redis = require('redis')
let redisClient = redis.createClient(REDIS_PORT, REDIS_HOST, { no_ready_check: true, password: REDIS_AUTH })

redisClient.on('connect', function () {
  console.log('Connected to Redis')
})

app.use((req, res) => {
  console.log(req.url)
  redisClient.get(req.url, function (err, reply) {
    if (!err && reply) {
      res.json(reply)
    }
  })
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1)

  const { action, params } = mapUrl(actions, splittedUrlPath)

  if (action) {
    action(req, params)
      .then((result) => {
        if (result instanceof Function) {
          result(res)
        } else {
          res.json(result)
        }
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect)
        } else {
          console.error('API ERROR:', pretty.render(reason))
          res.status(reason.status || 500).json(reason)
        }
      })
  } else {
    res.status(404).end('NOT FOUND')
  }
})

if (config.apiPort) {
  app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err)
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort)
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort)
  })
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified')
}
