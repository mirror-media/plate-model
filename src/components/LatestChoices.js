import _ from 'lodash'
import classNames from 'classnames'
import ga from 'react-ga'
import React, { Component } from 'react'
import { AdSlot } from 'react-dfp'
import { DFPID } from '../constants/index'
import { imageComposer } from '../utils/index'

if (process.env.BROWSER) {
  require('./LatestSections.css')
}

export default class LatestChoices extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick() {
    ga.event({
      category: 'home',
      action: 'click',
      label: 'latestChoices'
    })
  }

  render() {
    const { articles, categories, choices } = this.props

    let styles = [
      'ui',
      'centered',
      { 'three column': false },
      'grid'
    ]

    return (
      <div className="container">
        <div className={classNames(styles)}>
          { _.map(_.take(choices, 2), (c) => {
            let a = _.get(articles, c, {})
            let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'
            let image = imageComposer(a).mobileImage

            return (
              <div className="ui column" key={'choice' + a.id}>
                <a href={linkStyle + a.slug + '/' } onClick={ this._handleClick }>
                  <div className="sectionBlock">
                    <div className="section-cat">
                      { _.get(categories, [ _.first(a.categories), 'title' ]) }
                    </div>
                    <div className="sectionImg" style={{ background: 'url('+image+') no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
                    <div className="sectionTopic">
                      {a.title}
                    </div>
                  </div>
                </a>
              </div>
            )
          })}
          <div className="ui column" style={{ backgroundColor: 'rgba(0, 77, 162, 0.1)', marginTop: '-10px', marginBottom: '20px', height: '270px' }}>
            <a href="https://goo.gl/yqJaVY"  target="_blank">
              <div className="sectionBlock" style={{ marginTop: '10px', marginBottom: '10px' }}>
                <AdSlot sizes={ [ [ 300, 250 ] ] }
                  dfpNetworkId={DFPID}
                  slotId={ 'mm_pc_hp_300x250_1st' }
                  adUnit={ 'mm_pc_hp_300x250_1st' } 
                  sizeMapping={
                    [ 
                      { viewport: [   0,   0 ], sizes: [ ] },
                      { viewport: [ 970, 200 ], sizes: [ [ 970, 90 ], [ 970, 250 ], [ 300, 250 ] ]  }
                    ] 
                  }
                />
                <AdSlot sizes={ [ [ 300, 250 ] ] }
                  dfpNetworkId={DFPID}
                  slotId={ 'mm_mobile_hp_300x250_1st' }
                  adUnit={ 'mm_mobile_hp_300x250_1st' } 
                  sizeMapping={
                    [ 
                      { viewport: [   1,   1 ], sizes: [ [ 300, 250 ] ] },
                      { viewport: [ 970, 200 ], sizes: [ ]  }
                    ] 
                  }
                />
              </div>
            </a>
          </div>
          { _.map(_.slice(choices, 2), (c) => {
            let a = _.get(articles, c, {})
            let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'
            let image = imageComposer(a).mobileImage

            return (
              <div className="ui column" key={'choice' + a.id}>
                <a href={linkStyle + a.slug + '/' } onClick={ this._handleClick }>
                  <div className="sectionBlock">
                    <div className="section-cat">
                    </div>
                    <div className="sectionImg" style={{ background: 'url('+image+') no-repeat center center', backgroundSize: 'cover', width: '300px', height: '250px' }}></div>
                    <div className="sectionTopic">
                      {a.title}
                    </div>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export { LatestChoices }
