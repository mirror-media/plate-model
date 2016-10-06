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
  LOGO: 'https://www.mirrormedia.mg/asset/logo.png',
  KEYWORDS: '鏡傳媒,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說'
}

export const SOCIAL_LINK = {
  LINE: 'https://line.me/R/ti/p/%40cuk1273e',
  WEIBO: 'http://www.weibo.com/u/6030041924?is_all=1',
  FACEBOOK: 'https://www.facebook.com/mirrormediamg/',
  WECHAT: '#',
  INSTAGRAM: 'https://www.instagram.com/mirror_media/',
  FEED: '/story/index.xml',
  EMAIL: 'mailto:mirror885@mirrormedia.mg'
}

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
    string: 'Copyright © 2015-2016 鏡傳媒',
    link: null,
    image: null
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

export const ARTICLE = 'ARTICLE'

export const HOME = 'HOME'

export const CATEGORY = 'CATEGORY'

export const SECTION = 'SECTION'

export const TAG = 'TAG'

export const SEARCH = 'SEARCH'

export const TOPIC = 'TOPIC'

export const basePath = 'https://www.mirrormedia.mg'

export const GAID = 'UA-69336956-1'

export const appId = 962589903815787

export const colors = {
  whiteBg: '#F1F1F1',
  superWhite: '#FFFFFF',
  darkBg: '#08192d'
}
