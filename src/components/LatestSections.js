import _ from 'lodash'
import React, { Component } from 'react'
import classNames from 'classnames'
import { imageComposer } from '../utils/index'

if (process.env.BROWSER) {
  require('./LatestSections.css')
}

export default class LatestSections extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { entities, sectionList } = this.props
    let sortedList = _.sortBy(sectionList.sections, (o)=>{ return o.sortOrder } )
    let styles = [
      'ui',
      'centered',
      { 'three column': false },
      'grid'
    ]

    return (
      <div className="container">
        <div className={classNames(styles)}>

          { _.map(_.slice(sortedList, 0, 2), (s) => { 
            let sectionTop = []
            let topicList = []
            let articles = _.filter(entities.articles, function (a) { return _.indexOf(a.sections, s.id) > -1 })
            sectionTop = articles.slice(0, 1) //fetch first one
            topicList = articles.splice(0, 2) //fetch rest
            let image = imageComposer(_.get(sectionTop, '[0]', {})).mobileImage
            return (
              <div className="ui column" key={'section-'+s.id}>
                <a href={ '/story/'+_.get(sectionTop, '[0].slug', '/')+'/' }>
                  <div className="sectionBlock">
                    <div className="section-cat">
                      { _.get(entities.categories, [ _.first(_.get(sectionTop, '[0].categories', '')), 'title' ], '　　') }
                    </div>
                    <div className="gradient labelBlock">
                      { s.title }
                    </div>
                    <div className="sectionImg" style={{ background: 'url('+image+') no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
                    <div className="sectionTopic">
                      { _.get(sectionTop, '[0].title', '　') }
                    </div>
                  </div>
                </a>
                <ul className="sectionList">
                { _.map(topicList, (a, idx) => {
                  return (
                    <li key={a.id || idx}><a href={ '/story/' + a.slug + '/' }>{a.title}</a></li>
                  )
                })}
                </ul>
              </div>
            )
          })}

          <div className="ui column" style={{ backgroundColor: 'rgba(0, 77, 162, 0.1)', marginTop: '-10px', marginBottom: '10px' }}>
            <div className="sectionBlock" style={{ marginTop: '10px' }}>
              <div className="sectionImg" style={{ background: 'url(https://placekitten.com/g/300/250) no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
              <div className="sectionTopic">
                Advertisement
              </div>
            </div>
          </div>

          { _.map(_.slice(sortedList, 2), (s) => { 
            let sectionTop = []
            let topicList = []
            let articles = _.filter(entities.articles, function (a) { return _.indexOf(a.sections, s.id) > -1 })
            sectionTop = articles.slice(0, 1) //fetch first one
            topicList = articles.splice(0, 2) //fetch rest
            let image = imageComposer(_.get(sectionTop, '[0]', {})).mobileImage
            return (
              <div className="ui column" key={'section-'+s.id}>
                <a href={ '/story/'+_.get(sectionTop, '[0].slug', '/')+'/' }>
                  <div className="sectionBlock">
                    <div className="section-cat">
                      { _.get(entities.categories, [ _.first(_.get(sectionTop, '[0].categories', '')), 'title' ], '　　') }
                    </div>
                    <div className="gradient labelBlock">
                      { s.title }
                    </div>
                    <div className="sectionImg" style={{ background: 'url('+image+') no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
                    <div className="sectionTopic">
                      { _.get(sectionTop, '[0].title', '　') }
                    </div>
                  </div>
                </a>
                <ul className="sectionList">
                { _.map(topicList, (a, idx) => {
                  return (
                    <li key={a.id || idx}><a href={ '/story/' + a.slug + '/' }>{a.title}</a></li>
                  )
                })}
                </ul>
              </div>
            )
          })}

        </div>
      </div>
    )
  }
}

export { LatestSections }
