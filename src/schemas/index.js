'use strict'
import { Schema, arrayOf } from 'normalizr'

const article = new Schema('articles')
const author = new Schema('authors')
const category = new Schema('categories')
const section = new Schema('section')
const tag = new Schema('tags')
const topic = new Schema('topics')

article.define({
  categories: arrayOf(category),
  designers: arrayOf(author),
  engineers: arrayOf(author),
  photographers: arrayOf(author),
  sections: arrayOf(section),
  tags: arrayOf(tag),
  topics: topic,
  writers: arrayOf(author)
})

export { article }
export { category }
export { section }
export { tag }
