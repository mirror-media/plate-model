'use strict'

export * from './action-types'

export const SITE_NAME = {
  FULL: '鏡傳媒 Mirror Media',
  SHORT: '鏡傳媒',
  SEPARATOR: ' - '
}

export const SITE_META = {
  DESC: '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。',
  URL: 'https://www.mirrormedia.mg/',
  LOGO: 'https://www.twreporter.org/asset/logo.png',
  KEYWORDS: '鏡傳媒,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說'
}

export const SOCIAL_LINK = {
  LINE: '#',
  WEIBO: '#',
  FACEBOOK: 'https://www.facebook.com/mirrormediamg/',
  WECHAT: '#',
  INSTAGRAM: '#',
  FEED: '#',
  EMAIL: '#'
}

export const SECTION_NAME = [
  { 'title': '漫熱遊', 'name': 'popular' },
  { 'title': '新聞/人物', 'name': 'news' },
  { 'title': '美食/旅遊', 'name': 'foodtravel' },
  { 'title': '鏡鐘錶', 'name': 'fashion' },
  { 'title': '娛樂', 'name': 'entertainment' }
]

export const LINK_PREFIX = {
  ARTICLE: '/article/',
  CATEGORY: '/category/',
  SECTION: '/section/',
  TAG: '/tag/',
  TOPIC: '/topic/'
}

export const groupEnum = {
  CATEGORY: 'category',
  TAG: 'tag',
  TOPIC: 'topic'
}
export const apiPathEnum = {
  CATEGORY: 'postcategories',
  TAG: 'tags',
  TOPIC: 'topics'
}

export const authorTypes = {
  writter: '文',
  photographer: '攝影',
  designer: '設計',
  engineer: '工程'
}

export const copyrightTypes = {
  default: {
    string: '除另有註明，網站內容皆採用創用CC姓名標示-非商業性-禁止改作授權條款',
    link: 'http://creativecommons.org/licenses/by-nc-nd/3.0/tw/',
    image: 'LOGO_CC'
  },
  copyrighted: {
    string: 'Copyright © 2015-2016 鏡傳媒',
    link: null,
    image: null
  },
  creativeCommons: {
    string: '創用CC姓名標示-非商業性-禁止改作授權條款',
    link: 'http://creativecommons.org/licenses/by-nc-nd/3.0/tw/',
    image: 'LOGO_CC'
  }
}

export const CHARACTERS_LIMIT = {
  TOPIC_DESC: 120,
  BOTTOM_RELATED_DESC: 120
}

export const ITEMS_LIMIT = {
  ARTICLE_RELATED: 3
}

export const RELATED_ARTICLES = '延伸閱讀'

export const CONTINUE_READING = '繼續閱讀'

export const LOAD_MORE_ARTICLES = '載入更多文章'

export const TOPIC_TEXT = '專題'

export const ARTICLE = 'ARTICLE'

export const PHOTOGRAPHY = 'PHOTOGRAPHY'

export const PHOTOGRAPHY_ARTICLE = 'PHOTOGRAPHY_ARTICLE'

export const PHOTOGRAPHY_ARTICLE_STYLE = 'photography'

export const HOME = 'HOME'

export const CATEGORY = 'CATEGORY'

export const SECTION = 'SECTION'

export const TAG = 'TAG'

export const TOPIC = 'TOPIC'

export const basePath = 'https://www.mirrormedia.mg'

export const appId = 962589903815787

export const donatePath = ''

export const categoryPath = {
  taiwanPath: '/category/taiwan',
  reviewPath: '/category/review',
  photographyPath: '/photography',
  intlPath: '/category/intl',
  culturePath: '/category/culture'
}

export const navPath = [ {
  title: '台灣',
  path: '/category/taiwan'
}, {
  title: '國際',
  path: '/category/intl'
}, {
  title: '文化',
  path: '/category/culture'
}, {
  title: '影像',
  path: '/photography'
}, {
  title: '評論',
  path: '/category/review'
} ]

export const subnavPath = [ {
  title: '轉型正義',
  path: '/a/transitional-justice-content'
}, {
  title: '0206地震',
  path: '/a/0206earthquake-content'
}, {
  title: '亞洲森林浩劫',
  path: '/a/asia-forest-content'
}, {
  title: '走入同志家庭',
  path: '/a/homofamily-content'
}, {
  title: '急診人生',
  path: '/a/emergency-content'
} ]

export const colors = {
  whiteBg: '#F1F1F1',
  superWhite: '#FFFFFF',
  darkBg: '#08192d'
}
