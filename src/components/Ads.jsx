/* global $ */
import React, { Component } from 'react'
import {AdSlot, DFPManager} from 'react-dfp';

// if (process.env.BROWSER) {
//   require('./More.css')
// }

export default class Ads extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { adUnit, dimensions, sizeMapping, position } = this.props
    DFPManager.load();
  }

  render() {
    const { adUnit, dimensions } = this.props
    return (
      <AdSlot sizes={dimensions}
        dfpNetworkId='40175602'
        adUnit={adUnit}
        sizeMapping={
          [ 
            {viewport: [  0,   0], sizes: [ ] },
            {viewport: [970, 200], sizes: [ [ 970, 90 ], [ 970, 250 ], [ 300, 250 ] ]  }
          ] 
        }
      />
    )
  }
}

export { Ads }
