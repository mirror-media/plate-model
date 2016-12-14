'use strict'
import { Schema, arrayOf } from 'normalizr'

const author = new Schema('authors')
const category = new Schema('categories')
const tag = new Schema('tags')
const topic = new Schema('topics')
const section = new Schema('section')

const article = new Schema('articles')

article.define({
  categories: arrayOf(category),
  designers: arrayOf(author),
  engineers: arrayOf(author),
  photographers: arrayOf(author),
  writers: arrayOf(author),
  sections: arrayOf(section),
  tags: arrayOf(tag),
  topics: topic,
  relateds: arrayOf(article)
})

export { article }
export { tag }
export { category }
export { section }
