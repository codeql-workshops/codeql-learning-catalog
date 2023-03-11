import path from 'path'
import {UrlWithStringQuery} from 'node:url'
import {unified, Pluggable, PluggableList, Plugin} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import remarkGithub, {Options as GHOptions} from 'remark-github'
import remarkGemoji from 'remark-gemoji'
import remarkRehype from 'remark-rehype'
import {codeImport} from './codeImport'
//@ts-ignore TODO: Get types for rehyp-urls
import rehypeUrls from 'rehype-urls'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify/lib'
import hastLinkIcon from './hast-link-icon'
import {siteUrl} from '../../codeql-learning-catalog.config.js'

export type Node = {
  properties: any
  tagName: 'a' | 'img'
}

export function getRemarkPlugins(): PluggableList {
  return [
    remarkGfm,
    [
      remarkToc,
      {
        heading: 'On this page|toc|table[ -]of[ -]contents?',
        tight: true,
        skip: 'no_toc_section',
        maxDepth: 3
      }
    ],
    [
      remarkGithub,
      {
        repository: 'codeql-workshops/codeql-learning-catalog',
        // Only format @mentions
        buildUrl: (values, defaultBuildUrl) =>
          values.type === 'mention' ? defaultBuildUrl(values) : false
      } as GHOptions
    ],
    remarkGemoji
  ]
}

export function getRehypePlugins(filePath?: string): PluggableList {
  return [
    [rehypeUrls, (url: URL, node: Node) => removeMD(url, node, filePath)],
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        properties: {ariaHidden: true, tabIndex: -1, class: 'octocat-link'},
        content: hastLinkIcon
      }
    ]
  ]
}

export default function markdownToHtml(
  markdown: string,
  filePath?: string,
  fsHandle?: any
) {
  const compiler = unified()

  const usePlugin = (plugin: Pluggable) => {
    // Handle [plugin, pluginOptions] syntax
    if (Array.isArray(plugin) && plugin.length > 1) {
      compiler.use(plugin[0], plugin[1])
    } else {
      compiler.use(plugin as Plugin)
    }
  }

  if (!fsHandle) {
    ;[
      remarkParse,
      ...getRemarkPlugins(),
      [remarkRehype, {allowDangerousHtml: true}] as Pluggable
    ].forEach(usePlugin)
    ;[
      ...getRehypePlugins(filePath),
      [rehypeStringify, {allowDangerousHtml: true}] as Pluggable
    ].forEach(usePlugin)
  } else {
    ;[
      remarkParse,
      ...getRemarkPlugins(),
      [
        codeImport,
        {
          filePath: filePath,
          fsHandle: fsHandle,
          allowImportingFromOutside: true
        }
      ] as Pluggable,
      [remarkRehype, {allowDangerousHtml: true}] as Pluggable
    ].forEach(usePlugin)
    ;[
      ...getRehypePlugins(filePath),
      [rehypeStringify, {allowDangerousHtml: true}] as Pluggable
    ].forEach(usePlugin)
  }

  const result = compiler.processSync(markdown)
  return result.toString()
}

/**
 * Adds styling and target='_blank' to external links
 *
 * Changes `.md[x]` urls to non `.md[x]` counterpart.
 *
 * Examples:
 * - `./some/path.md` will become `../some/path/`
 * - `./some/path.mdx` will become `../some/path/`
 * - `./some/path.md#anchor` will become `../some/path/#anchor`
 * - `./some/path/index.md will become `../some/path/`
 * - `./some/path/index.mdx will become `../some/path/`
 * - `./some/path/index.md#anchor` will become `../some/path/#anchor`
 * - If linked from an `index.md[x]`, we do not traverse up a level. So
 *   `./some/path.md` will become `./some/path/`
 *   `./some/path.mdx` will become `./some/path/`
 */
export function removeMD(
  url: URL | UrlWithStringQuery,
  node: Node,
  filePath?: string
): string | void {
  if (node.tagName === 'img') {
    //  Don't alter images with a host (absolute url)
    if (url.host) return

    //  Don't alter apsolute hrefs (start with /)
    if (url.href[0] === '/') return

    //  If we have filePath, resolve absolute href
    if (filePath) {
      const resolvedPath = path.resolve(filePath, `../${url.href}`)
      return resolvedPath.replace(
        `${process.cwd()}/docs`,
        '/assets/images/bundled'
      )
    }

    console.warn(`Possible broken image: ${url}`)

    return url.href
  }

  if (url.host && url.host !== siteUrl) {
    node.properties.class = `${node.properties.class || ''} external-link`
    node.properties.target = '_blank'
    return
  }

  let newHref = url.href

  //  If linked from a non `index.md[x]`, we traverse up a level.
  if (
    url.href.includes(`.md`) &&
    (!filePath || !/index\.mdx?(#.*)?$/.test(filePath))
  )
    newHref = `../${newHref}`

  if (url.href.includes('index.md')) return newHref.replace(/index\.mdx?/, '')

  if (url.href.includes('.md')) return newHref.replace(/\.mdx?/, '/')
}
