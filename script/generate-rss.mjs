/**
 * Script to convert docsTree.json to search data for Lunar
 */

import fs from 'fs'
import path from 'path'
import {compareDesc} from 'date-fns'
import RSS from 'rss'

let docsTree
try {
  docsTree = JSON.parse(fs.readFileSync('./docsTree.json'))
} catch (e) {
  console.log(e)
  console.log('Unable to require docsTree. Will retry when it exists.')
  process.exit(0)
}

//  Filters out directories as it maps
const flatMapChildren = (child, parent) => {
  if (child.name.startsWith('index.md')) {
    child.children = parent?.children
      .filter(({name}) => !name.startsWith('index.md'))
      .map(({slug}) => JSON.stringify(slug))
  }

  if (child.type === 'file') return child

  const children = child.children.flatMap(c => flatMapChildren(c, child))
  return [...children]
}

//  All news/ posts sorted in descending order (newest posts first)
export const allNews = (
  docsTree.children
    .find(doc => doc.name === 'news')
    ?.children?.flatMap(c => flatMapChildren(c)) || []
).sort((a, b) =>
  compareDesc(
    new Date(a.frontmatter.date_published),
    new Date(b.frontmatter.date_published)
  )
)

const feed = new RSS({
  title: 'Latest news from The Hub',
  feed_url: 'https://thehub.github.com/news.xml',
  site_url: 'https://thehub.github.com'
})

allNews.forEach(post =>
  feed.item({
    title: post.frontmatter.title,
    url: `https://thehub.github.com/${post.slug.join('/')}/`,
    date: post.frontmatter.date_published,
    author: post.frontmatter.author
  })
)

try {
  fs.writeFileSync(
    path.join(process.cwd(), './public/news.xml'),
    feed.xml({indent: true})
  )
} catch (e) {
  console.error('Failed to generate rss data.')
  console.error(e)
  process.exit()
}

console.log('Generated public/rss.xml')
