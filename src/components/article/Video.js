/* eslint no-unused-vars:0 */
'use strict'
import _ from 'lodash'
import React from 'react' // eslint-disable-line
import classNames from 'classnames'
import styles from './Video.scss'

class Video extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {}

  render() {
    const { content, device } = this.props
    const { url, coverPhoto, title, description } = _.get(content, 0, {})

    return (
      <div className={classNames(styles['video-container'], { [styles['mobile']]: device === 'mobile' ? true : false })}>
        <video style={{ width: '100%' }} controls ref="video">
          <source src={url} />
        </video>
        <div className={classNames(styles['video-info-container'], styles['without-cp'])}>
          <div style={{ display: 'inline-block' }}>
            <h4>{title}</h4>
          </div>
          <div className={styles['html']} dangerouslySetInnerHTML={{ __html: description }} style={{ marginTop: '16px' }}/>
        </div>
      </div>
    )
  }
}

Video.propTypes = {
  content: React.PropTypes.array.isRequired,
  device: React.PropTypes.string,
  styles: React.PropTypes.object
}

Video.defaultProps = {
  content: [],
  device: '',
  styles: {}
}

export { Video }
