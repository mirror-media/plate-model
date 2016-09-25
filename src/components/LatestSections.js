import { SECTION_NAME } from '../constants/index'
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
    const { sections, entities } = this.props

    let styles = [
      'ui',
      'centered',
      { 'three column': false },
      'grid'
    ]

    return sections ? (
      <div className="container">
        <div className={classNames(styles)}>

          { _.map(sections.items, (value, key) => { 

            let sectionTop = []
            let sectionList = []
            if ( value ) { 
              let articles = _.filter(entities.articles, (v,k)=>{ return _.indexOf(value, k) > -1 })
              sectionTop = articles.slice(0, 1) //fetch first one
              sectionList = articles.splice(0, 1) //fetch rest
            }
            let image = imageComposer(_.get(sectionTop, '[0]', {})).mobileImage
            return (
              <div className="ui column" key={'section-'+key}>
                <a href={ '/news/'+_.get(sectionTop, '[0].slug', '/') }>
                  <div className="sectionBlock">
                    <div className="gradient labelBlock">
                      { _.get(_.find(SECTION_NAME, { 'name': key }), 'title', '') }
                    </div>
                    <div className="sectionImg" style={{ background: 'url('+image+') no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
                    <div className="sectionTopic">
                      { _.get(sectionTop, '[0].title', '') }
                    </div>
                  </div>
                </a>
                <ul className="sectionList">
                { _.map(sectionList, (a, idx) => {
                  return (
                    <li key={a.id || idx}><a href={ '/news/' + a.slug }>{a.title}</a></li>
                  )
                })}
                </ul>
              </div>
            )
          })}

          <div className="ui column" style={{ backgroundColor: 'rgba(0, 77, 162, 0.1)', marginTop: '-10px' }}>
            <div className="sectionBlock" style={{ marginTop: '10px' }}>
              <div className="sectionImg" style={{ background: 'url(https://placekitten.com/g/300/250) no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
              <div className="sectionTopic">
                Advertisement
              </div>
            </div>
          </div>

        </div>
      </div>
    ) : null
  }
}

export { LatestSections }
