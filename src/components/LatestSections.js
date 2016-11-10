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
            let linkStyle = (_.get(sectionTop, 'style', '')=='projects') ? '/projects/' : '/story/'
            return (
              <div className="ui column" key={'section-'+s.id}>
                <a href={ linkStyle+_.get(sectionTop, 'slug', '')+'/' }>
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
                  let linkStyle = (_.get(a, 'style', '')=='projects') ? '/projects/' : '/story/'
                  return (
                    <li key={a.id || idx}><a href={ linkStyle + a.slug + '/' }>{a.title}</a></li>
                  )
                })}
                </ul>
              </div>
            )
          })}

          <div className="ui column" style={{ backgroundColor: 'rgba(0, 77, 162, 0.1)', marginTop: '-10px', marginBottom: '20px' }}>
            <a href="https://goo.gl/beHg3g"  target="_blank">
              <div className="sectionBlock" style={{ marginTop: '10px', marginBottom: '10px' }}>
                <div className="sectionImg AD" style={{ background: 'url(/asset/ads/beverage.jpg) no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
              </div>
            </a>
            <ul className="sectionList">
              <li><a href={'https://goo.gl/loHXob'} target="_blank">好評大贈送，買鏡週刊免費喝飲料！解你新聞慾望的渴</a></li>
              <li><a href={'https://goo.gl/T80Sug'} target="_blank">想隨時掌握獨家火熱觀點，創刊訂戶優惠只到11/30</a></li>
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
            let linkStyle = (_.get(sectionTop, 'style', '')=='projects') ? '/projects/' : '/story/'
            return (
              <div className="ui column" key={'section-'+s.id}>
                <a href={ linkStyle+_.get(sectionTop, 'slug', '')+'/' }>
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
                  let linkStyle = (_.get(a, 'style', '')=='projects') ? '/projects/' : '/story/'
                  return (
                    <li key={a.id || idx}><a href={ linkStyle + a.slug + '/' }>{a.title}</a></li>
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
