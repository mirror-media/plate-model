import _ from 'lodash'
import React, { Component } from 'react'
import classNames from 'classnames'
import { imageComposer } from '../utils/index'
import { camelize } from 'humps'
import ga from 'react-ga'

if (process.env.BROWSER) {
  require('./LatestSections.css')
}

export default class LatestSections extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick() {
    ga.event({
      category: 'home',
      action: 'click',
      label: 'latestSections'
    })
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
                <a href={ linkStyle+_.get(sectionTop, 'slug', '')+'/' } onClick={ this._handleClick }>
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
                    <li key={a.id || idx}><a href={ linkStyle + a.slug + '/' } onClick={ this._handleClick }>{a.title}</a></li>
                  )
                })}
                </ul>
              </div>
            )
          })}

          <div className="ui column" style={{ backgroundColor: 'rgba(0, 77, 162, 0.1)', marginTop: '-10px', marginBottom: '20px' }}>
            <a href="https://goo.gl/yqJaVY"  target="_blank">
              <div className="sectionBlock" style={{ marginTop: '10px', marginBottom: '10px' }}>
                <div className="sectionImg AD" style={{ background: 'url(/asset/ads/subscribe1130.jpg) no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
              </div>
            </a>
            <ul className="sectionList">
              <li><a href={'https://goo.gl/6Taigi'} target="_blank">全新視野 訂閱最勁爆的鏡週刊</a></li>
              <li><a href={'https://goo.gl/U55PFt'} target="_blank">現在就訂閱 創刊超優惠 即日起至11/30止</a></li>
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
                <a href={ linkStyle+_.get(sectionTop, 'slug', '')+'/' } onClick={ this._handleClick }>
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
                    <li key={a.id || idx}><a href={ linkStyle + a.slug + '/' } onClick={ this._handleClick }>{a.title}</a></li>
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
