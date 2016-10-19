import _ from 'lodash'
import React, { Component } from 'react'
import classNames from 'classnames'
import { imageComposer } from '../utils/index'
import { camelize } from 'humps'

if (process.env.BROWSER) {
  require('./LatestSections.css')
}

export default class LatestSections extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { entities, sectionList, sections } = this.props
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

          { _.map(_.take(sortedList, 2), (s) => { 
            let featuredList = _.get(sections, [ 'items', camelize(s.name) ], [])
            let sectionTop = _.get(entities.articles, _.first(featuredList), {}) //fetch first one
            let topicList = _.slice(featuredList, 1, 3) //fetch rest
            
            // let articles = _.filter(entities.articles, function (a) { return _.indexOf(_.get(sections, [ 'items', camelize(s.name) ], []), a.id) > -1 })
            // sectionTop = _.take(articles, 1) //fetch first one
            // topicList = articles.splice(1, 2) //fetch rest

            let image = imageComposer(sectionTop).mobileImage
            return (
              <div className="ui column" key={'section-'+s.id}>
                <a href={ '/story/'+_.get(sectionTop, 'slug', '')+'/' }>
                  <div className="sectionBlock">
                    <div className="section-cat">
                      { _.get(entities.categories, [ _.first(_.get(sectionTop, 'categories', [])), 'title' ], '　　') }
                    </div>
                    <div className="gradient labelBlock">
                      { s.title }
                    </div>
                    <div className="sectionImg" style={{ background: 'url('+image+') no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
                    <div className="sectionTopic">
                      { _.get(sectionTop, 'title', '　') }
                    </div>
                  </div>
                </a>
                <ul className="sectionList">
                { _.map(topicList, (t, idx) => {
                  let a = _.get(entities.articles, t, {})
                  return (
                    <li key={a.id || idx}><a href={ '/story/' + a.slug + '/' }>{a.title}</a></li>
                  )
                })}
                </ul>
              </div>
            )
          })}

          <div className="ui column" style={{ backgroundColor: 'rgba(0, 77, 162, 0.1)', marginTop: '-10px', marginBottom: '20px' }}>
            <a href="https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=300250&utm_campaign=salesteam"  target="_blank">
              <div className="sectionBlock" style={{ marginTop: '10px', marginBottom: '10px' }}>
                <div className="sectionImg AD" style={{ background: 'url(/asset/ads/hero.jpg) no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
              </div>
            </a>
            <ul className="sectionList">
              <li><a href={'https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=text1&utm_campaign=salesteam'} target="_blank">「以鏡為名」，反映事實真相，堅守100%原創報導</a></li>
              <li><a href={'https://www.facebook.com/mirrormediamg/?fref=ts&utm_source=mm&utm_medium=text2&utm_campaign=salesteam'} target="_blank">加入好友，隨時掌握獨家觀點、事件真相</a></li>
            </ul>
          </div>

          { _.map(_.slice(sortedList, 2), (s) => { 
            let featuredList = _.get(sections, [ 'items', camelize(s.name) ], [])
            let sectionTop = _.get(entities.articles, _.first(featuredList), {}) //fetch first one
            let topicList = _.slice(featuredList, 1, 3) //fetch rest
            
            // let articles = _.filter(entities.articles, function (a) { return _.indexOf(_.get(sections, [ 'items', camelize(s.name) ], []), a.id) > -1 })
            // sectionTop = _.take(articles, 1) //fetch first one
            // topicList = articles.splice(1, 2) //fetch rest

            let image = imageComposer(sectionTop).mobileImage
            return (
              <div className="ui column" key={'section-'+s.id}>
                <a href={ '/story/'+_.get(sectionTop, 'slug', '')+'/' }>
                  <div className="sectionBlock">
                    <div className="section-cat">
                      { _.get(entities.categories, [ _.first(_.get(sectionTop, 'categories', [])), 'title' ], '　　') }
                    </div>
                    <div className="gradient labelBlock">
                      { s.title }
                    </div>
                    <div className="sectionImg" style={{ background: 'url('+image+') no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
                    <div className="sectionTopic">
                      { _.get(sectionTop, 'title', '　') }
                    </div>
                  </div>
                </a>
                <ul className="sectionList">
                { _.map(topicList, (t, idx) => {
                  let a = _.get(entities.articles, t, {})
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
