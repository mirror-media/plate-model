import { SECTION_NAME } from '../constants/index'
import _ from 'lodash'
import React, { Component } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

if (process.env.BROWSER) {
  require('./LatestSections.css')
}

export default class LatestSections extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { sections } = this.props

    let styles = [
      'ui',
      'centered',
      { 'three column': false },
      'grid'
    ]

    return sections ? (
      <div className="container">
        <div className={classNames(styles)}>

          { _.map(sections, (value, key) => { 
            let sectionTop = []
            let sectionList = []
            if ( value ) { 
              let articles = _.values( _.get(value, 'entities.articles', {}))
              sectionTop = articles.slice(0, 1) //fetch first one
              sectionList = articles.splice(0, 1) //fetch rest
            }
            // console.log(key)
            // console.log(sectionTop)
            // console.log(sectionList)
            return (
              <div className="ui column" key={'section-'+key}>
                <Link to={ '/news/'+_.get(sectionTop, '[0].slug', '/') }>
                  <div className="sectionBlock">
                    <div className="gradient labelBlock">
                      { _.get(_.find(SECTION_NAME, { 'name': key }), 'title', '') }
                    </div>
                    <div className="sectionImg" style={{ background: 'url(https://placekitten.com/300/250?image='+_.uniqueId()+') no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
                    <div className="sectionTopic">
                      { _.get(sectionTop, '[0].title', '') }
                    </div>
                  </div>
                </Link>
                <ul className="sectionList">
                { _.map(sectionList, (a, idx) => {
                  return (
                    <li key={a.id || idx}><Link to={ '/news/' + a.slug }>{a.title}</Link></li>
                  )
                })}
                </ul>
              </div>
            )
          })}

          <div className="ui column" style={{ backgroundColor: 'rgba(0, 77, 162, 0.1)', marginTop: '-10px', paddingTop: '10px!important' }}>
            <div className="sectionBlock">
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
