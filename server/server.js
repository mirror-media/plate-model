/*eslint no-console: 0*/
/*global __DEVELOPMENT__ webpackIsomorphicTools */
import 'babel-polyfill'
import Compression from 'compression'
import Express from 'express'
import path from 'path'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
//import ReactDOMStream from 'react-dom-stream/server'
import createLocation from 'history/lib/createLocation'
//import DocumentMeta from 'react-document-meta'
import { RouterContext, match, createMemoryHistory } from 'react-router'
import Promise from 'bluebird'
import httpProxy from 'http-proxy'

import configureStore from '../src/store/configureStore'
import crateRoutes from '../src/routes/index'

import { Provider } from 'react-redux'
import config from './config'

import { NotFoundError } from '../src/lib/custom-error'
import { SITE_NAME, SITE_META, FBPageId } from '../src/constants/'
import _ from 'lodash'

const server = new Express()
const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort
// create a proxy server to serve the API requests
const proxy = httpProxy.createProxyServer({
  target: targetUrl
})

server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'ejs')
server.use(Compression())
server.use(Express.static(path.join(__dirname, '../static')))
server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://www.mirrormedia.mg/')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('content-type', 'text/html')
  next()
})


// mock apis
//server.get('/questions', (req, res)=> {
//  let { questions } = require('./mock_api');
//  res.send(questions);
//});
//
server.get('/robots.txt', (req, res) => {
  res.format({
    'text/plain': function () {
      res.status(200).render('robots')
    }
  })
})
// proxy to the API server
server.use('/api', (req, res) => {
  proxy.web(req, res)
})

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error)
  }
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' })
  }
  json = { error: 'proxy_error', reason: error.message }
  res.end(JSON.stringify(json))
})

server.get('/status', function (req, res) {
  res.send('OK')
})

server.get('*', async function (req, res) {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh()
  }
  let history = createMemoryHistory()
  let store = configureStore()

  let routes = crateRoutes(history)

  let location = createLocation(req.url)

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search)
    } else if (error) {
      res.status(500).render('500', error)
    } else if (renderProps == null) {
      res.status(404).render('404')
    } else {
      let [ getCurrentUrl, unsubscribe ] = subscribeUrl()
      let reqUrl = location.pathname + location.search
      store.dispatch({
        type: 'DETECT_DEVICE',
        headers: _.get(req, [ 'headers', 'user-agent' ])
      })

      const getReduxPromise = function () {
        let { query, params } = renderProps
        let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent
        let promise = comp.fetchData ?
          comp.fetchData({ query, params, store, history }) :
          Promise.resolve()
        return promise
      }

      getReduxPromise().then(()=> {
        let fatalError = store.getState().fatalError
        if (fatalError) {
          throw fatalError
        }
        let assets = webpackIsomorphicTools.assets()
        {/* styles (will be present only in production with webpack extract text plugin) */}
        let styles = ''
        {
          Object.keys(assets.styles).map((style, key) => {
            styles += ReactDOMServer.renderToString(<link async href={assets.styles[style]} key={key} media="screen, projection" rel="stylesheet" type="text/css" charSet="UTF-8"/>)
          })
        }
        let pageState = store.getState()
        let ogImage = SITE_META.LOGO
        let title = SITE_NAME.FULL
        let canonical = SITE_META.URL + getCurrentUrl().substr(1)
        let desc = SITE_META.DESC
        let ogType = 'website'

        /* Sections */
        if ( _.includes(getCurrentUrl(), 'section') ) {
          let sectionName = _.get(getCurrentUrl().split('/'), '2')
          let sectionList = _.get(pageState, [ 'sectionList', 'response', 'sections' ], [])
          let section = _.find(sectionList, { name: sectionName } )
          desc = _.get(section, 'description', desc)
          if ( !section ) {
            res.status(404).render('404')
          }
        }
        /* Categories */
        // if ( _.includes(getCurrentUrl(), 'category') ) {
        //   let categoryName = _.get(getCurrentUrl().split('/'), '2')
        //   let category = _.get(pageState, [ 'sectionList', 'response', 'categories', categoryName ])
        //   if ( !category && categoryName != 'videohub' && categoryName != 'audio' ) {
        //     res.status(404).render('404')
        //   }
        // }
        /* Topics */
        if ( _.includes(getCurrentUrl(), 'topic') ) {
          let topicId = _.get(getCurrentUrl().split('/'), '2')
          let topic = _.get(pageState, [ 'entities', 'topics', topicId ])
          title = _.get(pageState, [ 'entities', 'topics', topicId, 'ogTitle' ]) ? _.get(pageState, [ 'entities', 'topics', topicId, 'ogTitle' ]) + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL
          desc = _.get(pageState, [ 'entities', 'topics', topicId, 'ogDescription' ], SITE_META.DESC)
          ogImage = _.get(pageState, [ 'topics', 'items', topicId, 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ]) ? _.get(pageState, [ 'topics', 'items', topicId, 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ]) : _.get(pageState, [ 'topics', 'items', topicId, 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ], SITE_META.LOGO)
          if ( !topic ) {
            res.status(404).render('404')
          }
        }
        /* Questionnaire */
        if ( _.includes(getCurrentUrl(), '/q/') ) {
          let resultIdForOg = _.get(getCurrentUrl().split('/'), '3')
          const setting = _.get(pageState, [ 'questSetting', 'setting' ])
          title = _.get(setting, [ 'title' ]) ? _.get(setting, [ 'title' ]) + SITE_NAME.SEPARATOR + SITE_NAME.FULL : SITE_NAME.FULL
          desc = _.get(_.find(_.get(setting, [ 'results' ], []), { id : resultIdForOg }), [ 'title' ], SITE_META.DESC)
          ogImage = _.get(_.find(_.get(setting, [ 'results' ], []), { id : resultIdForOg }), [ 'image', 'url' ]) ? _.get(_.find(_.get(setting, [ 'results' ], []), { id : resultIdForOg }), [ 'image', 'url' ]) : _.get(setting, [ 'image', 'url' ], SITE_META.LOGO)
        }

        // let expGA = ''
        // if ( location.pathname == '/' ) {
        //   expGA = '<!-- Google Analytics Content Experiment code --><script>function utmx_section(){}function utmx(){}(function(){var k=\'129051472-1\',d=document,l=d.location,c=d.cookie;if(l.search.indexOf(\'utm_expid=\'+k)>0)return;function f(n){if(c){var i=c.indexOf(n+\'=\');if(i>-1){var j=c.indexOf(\';\',i);return escape(c.substring(i+n.length+1,j<0?c.length:j))}}}var x=f(\'__utmx\'),xx=f(\'__utmxx\'),h=l.hash;d.write(\'<sc\'+\'ript src="\'+\'http\'+(l.protocol==\'https:\'?\'s://ssl\':\'://www\')+\'.google-analytics.com/ga_exp.js?\'+\'utmxkey=\'+k+\'&utmx=\'+(x?x:\'\')+\'&utmxx=\'+(xx?xx:\'\')+\'&utmxtime=\'+new Date().valueOf()+(h?\'&utmxhash=\'+escape(h.substr(1)):\'\')+\'" type="text/javascript" charset="utf-8"><\/sc\'+\'ript>\')})();</script><script>utmx(\'url\',\'A/B\');</script><!-- End of Google Analytics Content Experiment code -->'
        // }

        // if (pageState['selectedArticle']['id']) {
        //   let currentArticle = _.get(pageState, [ 'entities', 'articles', _.get(pageState, 'selectedArticle.id') ], null)
        //   if (currentArticle) {
        //     canonical = SITE_META.URL + LINK_PREFIX.ARTICLE + _.get(currentArticle, 'slug', '')
        //     title = _.get(currentArticle, 'title', title)
        //     desc = _.get(currentArticle, 'ogDescription', desc)
        //     ogType = 'article'
        //     if (currentArticle['heroImage']) {
        //       ogImage = _.get(currentArticle, 'heroImage.image.url', '')
        //     }
        //   } else {
        //     res.status(500).render('500')
        //   }
        // }

        if ( getCurrentUrl() === reqUrl ) {
          if (!res.headersSent) {
            res.header('Cache-Control', 'public, max-age=900')
          }
          let reduxState = escape(JSON.stringify(store.getState()))
          let html = ReactDOMServer.renderToString(
              <Provider store={store} >
                { <RouterContext {...renderProps} /> }
              </Provider>
          )
          res.write(`
            <!DOCTYPE html>
            <html lang="zh-Hant-TW">
              <head>
                  <title>${title}</title>
                  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                  <meta http-equiv="Cache-control" content="public">
                  <meta name='viewport' content='width=device-width, user-scalable=no, maximum-scale=1, initial-scale=1'/>
                  <meta name="apple-mobile-web-app-capable" content="yes"/>
                  <meta name="keywords" content="${SITE_META.KEYWORDS}"/>
                  <meta name="description" content="${desc}" data-rdm/>
                  <meta property="article:author" content="https://www.facebook.com/mirrormediamg/">
                  <meta property="article:publisher" content="https://www.facebook.com/mirrormediamg/">
                  <meta property="og:rich_attachment" content="true"/>
                  <meta property="og:type" content="${ogType}" />
                  <meta property="og:title" content="${title}" data-rdm/>
                  <meta property="og:description" content="${desc}" data-rdm/>
                  <meta property="og:site_name" content="${SITE_NAME.SHORT}" />
                  <meta property="og:image" content="${ogImage}" data-rdm/>
                  <meta property="og:image:type" content="image/png" />
                  <meta property="og:image:width" content="960" />
                  <meta property="og:image:height" content="720" />
                  <meta property="fb:pages" content="${FBPageId}" />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:image" content="${ogImage}" />
                  <meta name="twitter:title" content="${title}" data-rdm/>
                  <meta name="twitter:description" content="${desc}" data-rdm/>
                  <link rel="canonical" href="${canonical}" data-rdm/>
                  <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="${SITE_META.URL}story/rss.xml" />
                  <!-- reset css for cross browser-->
                  <link rel="stylesheet" async type="text/css" href="/asset/reset.css" >
                  <link rel="stylesheet" async type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.4/semantic.min.css" >

                  <link rel="icon" type="image/png" href="/asset/favicon-32x32.png" sizes="32x32">
                  <link rel="icon" type="image/png" href="/asset/favicon-16x16.png" sizes="16x16">
                  <link rel="shortcut icon" href="/asset/favicon.ico">

                  <link rel="icon" sizes="192x192" href="/asset/android-chrome-192x192.png">
                  <link rel="apple-touch-icon" sizes="180x180" href="/asset/apple-touch-icon-180x180.png">

                  <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.css"/>
                  <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick-theme.css"/>

                  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.4/semantic.min.js"></script>
                  ${styles}
                  <!-- Facebook Pixel Code -->
                  <script>
                    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                    document,'script','https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '1166112616809497'); // Insert your pixel ID here.
                    fbq('track', 'PageView');
                  </script>
                  <noscript><img height="1" width="1" style="display:none"
                  src="https://www.facebook.com/tr?id=1166112616809497&ev=PageView&noscript=1"
                  /></noscript>
                  <!-- DO NOT MODIFY -->
                  <!-- End Facebook Pixel Code -->
              </head>
              <body>
                <div id="root">${html}</div>
                <!-- Load Intl Polyfill -->
                <script async src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.zh-Hant-TW"></script>

                <script type="text/javascript" charset="utf-8">
                  window.__REDUX_STATE__ = '${reduxState}';
                </script>
                <script async type="text/javascript" charset="utf-8" src='${assets.javascript.main}'></script>
              </body>
            </html>
          `)
          res.end()
          //DocumentMeta.rewind()   // render custom ducument title
        } else {
          res.redirect(302, getCurrentUrl())
        }
        unsubscribe()
      }).catch((err) => {
        console.log(err.stack)
        if (err instanceof NotFoundError) {
          res.status(404)
          res.render('404')
          return
        }
        res.status(500)
        let errStack = err.stack.split('\n')
        res.render('500', { error: errStack })
      })
    }
  })

  function subscribeUrl() {
    let currentUrl = location.pathname + location.search
    let unsubscribe = history.listen((newLoc) => {
      if (newLoc.action === 'PUSH') {
        currentUrl = newLoc.pathname + newLoc.search
      }
    })
    return [
      ()=> currentUrl,
      unsubscribe
    ]
  }
})

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err)
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort)
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port)
  })
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified')
}

module.exports = server
