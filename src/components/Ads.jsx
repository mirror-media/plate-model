/* global $ */
import React, { Component } from 'react'
import { DFPSlotsProvider, AdSlot } from 'react-dfp';

// if (process.env.BROWSER) {
//   require('./More.css')
// }

export default class Ads extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      adUnit: props.adUnit
    }
  }

  componentDidMount() {
    const { adUnit, dimensions, sizeMapping } = this.props

    console.log('componentDidMount')

    $('div[data-adunit="'+adUnit+'"]').each(function(){
        $(this).html('<div class="adunit" \
        data-adunit="'+adUnit+'" \
        data-dimensions="'+dimensions+'" \
        data-size-mapping="'+sizeMapping+'" \
        style="margin-bottom: 20px;" \
      ></div>')
    });
    $.dfp({
      'dfpID': '40175602',
      'enableSingleRequest': true,
      'collapseEmptyDivs': true,
      'setCentering': true,
      'sizeMapping': {
        'default': [
          { browser: [    0,   0 ], ad_sizes: [] },
          { browser: [  970, 200 ], ad_sizes: [ [ 970, 90 ], [ 970, 250 ], [ 300, 250 ] ] }
        ],
        'mobile-only': [
          { browser: [    1,   1 ], ad_sizes: [ [ 320, 100 ], [ 300, 250 ] ] },
          { browser: [  970, 200 ], ad_sizes: [] }
        ]
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if( this.props.adUnit != nextProps.adUnit ){
      this.setState({
        adUnit: nextProps.adUnit
      })
    }
  }

  shouldComponentUpdate(nextProps) {
    console.log(this.props.adUnit != nextProps.adUnit)
    return this.props.adUnit != nextProps.adUnit
  }

  componentDidUpdate() {
    const { adUnit, dimensions, sizeMapping } = this.props

    console.log('componentDidUpdate')

    $('#'+adUnit).each(function(){
        $(this).html('<div class="adunit" \
        data-adunit="'+adUnit+'" \
        data-dimensions="'+dimensions+'" \
        data-size-mapping="'+sizeMapping+'" \
        style="margin-bottom: 20px;" \
      ></div>')
    });
    $.dfp({
      'dfpID': '40175602',
      'enableSingleRequest': true,
      'disableInitialLoad': true,
      'collapseEmptyDivs': true,
      'setCentering': true,
      'sizeMapping': {
        'default': [
          { browser: [    0,   0 ], ad_sizes: [] },
          { browser: [  970, 200 ], ad_sizes: [ [ 970, 90 ], [ 970, 250 ], [ 300, 250 ] ] }
        ],
        'mobile-only': [
          { browser: [    1,   1 ], ad_sizes: [ [ 320, 100 ], [ 300, 250 ] ] },
          { browser: [  970, 200 ], ad_sizes: [] }
        ]
      }
    })
  }

  render() {
    const { adUnit } = this.state
    return (
        <div 
          data-adunit={adUnit}
          className="promote"
        />
    )
  }
}

export { Ads }
