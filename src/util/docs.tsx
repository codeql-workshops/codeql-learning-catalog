import {compareDesc} from 'date-fns'
// @ts-ignore
import docsTree from '../../docsTree.json'
// @ts-ignore
export {default as docsTree} from '../../docsTree.json'

export type Slug = string[]

export interface Item {
  path: string
  filePath: string
  name: string
  type: string
  slug: Slug
  size: number
}

export interface Doc extends Item {
  extension: string
  frontmatter: {
    [key: string]: any
    search_exclude?: boolean
  }
  children?: string[]
}

export type DocKeyPair = [string, Doc]

export type RedirectKeyPair = [string, string]

export interface Dir extends Item {
  children: (Doc | Dir)[]
}

//  Filters out directories as it maps
export const flatMapChildren = (child: Doc | Dir, parent?: Dir): Doc[] => {
  if (child.name.startsWith('index.md')) {
    child.children = parent?.children
      .filter(({name}) => !name.startsWith('index.md'))
      .map(({slug}) => JSON.stringify(slug))
  }

  if (child.type === 'file') return [child as Doc]

  const dir = child as Dir
  const children = dir.children.flatMap(c => flatMapChildren(c, dir))
  return [...children]
}

export const allDocsFlat: Doc[] = [docsTree].flatMap(c => flatMapChildren(c))

//  All news/ posts sorted in descending order (newest posts first)
export const allNews: Doc[] = (
  docsTree.children
    .find((doc: Doc | Dir) => doc.name === 'news')
    ?.children?.flatMap((c: Doc | Dir) => flatMapChildren(c)) || []
).sort((a: Doc, b: Doc) =>
  compareDesc(
    new Date(a.frontmatter.date_published),
    new Date(b.frontmatter.date_published)
  )
)

export const docsBySlug = new Map<string, Doc>(allDocsFlat.map(treeToKeyPairs))

export function treeToKeyPairs(doc: Doc): DocKeyPair {
  return [JSON.stringify(doc.slug), doc]
}

function isIndex(path: string): boolean {
  return path.endsWith('index.md')
}

function isSupportedLanguage(lang: string): boolean {
  return (
    lang === 'cpp' ||
    lang === 'python' ||
    lang === 'ruby' ||
    lang === 'javascript' ||
    lang === 'java' ||
    lang === 'c-sharp' ||
    lang === 'go'
  )
}

export function availableLanguagesForCourse(course: string): Doc[] {
  var courseLanguageIndexes = allDocsFlat.filter(e => {
    return (
      isIndex(e.filePath) &&
      e.filePath.startsWith('docs' + course) &&
      e.slug.length == 3 &&
      isSupportedLanguage(e.slug[2])
    )
  })

  // the slug will contain [PREFIX, NUMBER, LANGUAGE]
  return courseLanguageIndexes
}
export function childrenOfPath(path: string): Doc[] {
  var docs = allDocsFlat.filter(e => {
    return e.filePath.startsWith('docs' + path)
  })

  return docs
}
export function getFirstLexicographicalChildOfPath(path: string): Doc {
  const children = childrenOfPath(path)

  const docs = children
    .filter(doc => {
      if (doc?.frontmatter) return !doc.frontmatter.nav_exclude
      else return true
    })
    .filter((doc): doc is Doc => !!doc)
    .sort((a, b) => {
      const titleA = a.name.toUpperCase()
      const titleB = b.name.toUpperCase()

      if (titleA < titleB) return -1
      if (titleA > titleB) return 1
      return 0
    })

  // the slug will contain [PREFIX, NUMBER, LANGUAGE]
  if (docs) {
    return docs[0]
  }

  return docs
}

export function metadataForCoursePage(course: string): Doc[] {
  var courseLanguageIndexes = allDocsFlat.filter(e => {
    return (
      isIndex(e.filePath) &&
      e.filePath.startsWith('docs' + course) &&
      ((e.slug.length == 3 && isSupportedLanguage(e.slug[2])) || // language specific
        e.slug.length == 2) // not language specific
    )
  })

  // the slug will contain [PREFIX, NUMBER, LANGUAGE]
  return courseLanguageIndexes
}

export const redirectsBySlug = new Map<string, string>(
  allDocsFlat.flatMap(redirectsToKeyPairs)
)

export function redirectsToKeyPairs(doc: Doc): RedirectKeyPair[] {
  if (doc.frontmatter.redirect_from) {
    const redirectFrom = doc.frontmatter.redirect_from
    if (typeof redirectFrom === 'string')
      return [
        [JSON.stringify(pathToSlug(redirectFrom)), JSON.stringify(doc.slug)]
      ]

    if (Array.isArray(redirectFrom))
      return redirectFrom.map(redirect => [
        JSON.stringify(pathToSlug(redirect)),
        JSON.stringify(doc.slug)
      ])
  }

  return []
}

function pathToSlug(path: string): Slug {
  return path
    .replace(/(^\/)|(\/$)/g, '') // Remove leading/trailing slashes
    .split('/')
}
