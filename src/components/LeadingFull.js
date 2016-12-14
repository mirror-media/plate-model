import { imageComposer } from '../utils/index'
import _ from 'lodash'
import dateformat from 'dateformat'
import entities from 'entities'
// import ga from 'react-ga'
import React, { Component } from 'react'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

if (process.env.BROWSER) {
  require('./LeadingFull.css')
}

export default class LeadingFull extends Component {
	constructor(props, context) {
		super(props, context)
	}

	render() {
		const { articles } = this.props
		let sortedArticles = _.sortBy(articles, function (o) { return new Date(o.publishedDate) }).reverse()

		return (
			<div>
				<div className="leadingFull__gradient"></div>
				{ _.map(_.take(sortedArticles, 2), (a)=>{

					let image = imageComposer(a).desktopImage
					let title = sanitizeHtml( _.get(a, [ 'title' ], ''), { allowedTags: [ ] })
					let hasRelated = a.relateds.length !== 0 ? 'static' : 'none' 
					// let linkStyle = (_.get(a, 'style', '') == 'projects') ? '/projects/' : '/story/'

					let brief = sanitizeHtml( _.get(a, [ 'brief','html' ], ''), { allowedTags: [ ] })
					let content = sanitizeHtml( _.get(a, [ 'content','html' ], ''), { allowedTags: [ ] })
					let briefContent = (brief.length >0) ? brief : content

					let writers = '文｜' + _.map(a.writers, 'name').join('、')

					return (
						<section className="" key={'choiceFull' + a.id}>
							<figure className="post-image" style={{ background: 'url('+ image +') no-repeat center center', backgroundSize: 'cover' }}></figure>
							<div className="post-block">
								<div className="post meta">
									<div className="author">
										{ (_.get(a, [ 'writers', 'length' ], 0) > 0) ? writers+' ' : null }
									</div>
									<div className="date">{ dateformat(a.publishedDate, 'yyyy.mm.dd') }</div>
								</div>
								<div className="post content">
									<div className="post title">
										<h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
									</div>
									<div className="post brief">
										{ truncate(entities.decodeHTML(briefContent), 200) }
									</div>
								</div>
								<div className="post dfp">
								</div>
							</div>
							<div className="related-post-block" style={{ display: hasRelated }} >
								<div className="related-post-container">
									<span>相關文章 Related Stories</span>
									<div className="related-divider"></div>
										{ _.map(_.take(a.relateds, 2), ()=>{
											<div className="related-post">
												<div className="related-post__img"></div>
												<div className="related-post__content">
													<div className="related-post__title"></div>
													<div className="related-post__meta">
														<div className="related-post__author"></div>
														<div className="related-post__date"></div>
													</div>
												</div>
											</div>
										})}
								</div>
							</div>
						</section>
					)
				})}
			</div>
		)
	}
}

export { LeadingFull }
