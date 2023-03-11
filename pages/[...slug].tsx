import {useEffect} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import fs from 'fs/promises'
import fs2 from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote'
import {serialize} from 'next-mdx-remote/serialize'
import {GetStaticProps, GetStaticPaths} from 'next'
import {useRouter} from 'next/router'
import slugify from 'slugify'
import {docsBySlug, redirectsBySlug, Slug} from '../src/util/docs'
import markdownToHtml, {
  getRemarkPlugins,
  getRehypePlugins
} from '../src/util/markdownToHtml'
import Mermaid from '../components/Mermaid'
import Octicon from '../components/Octicon'
import * as siteData from '../docs/_data'

interface Props {
  content: string
  mdxSource?: MDXRemoteSerializeResult
  extension: '.md' | '.mdx'
  frontMatter: any
  componentNames: string[]
  redirect: Slug
}

const Catchall = ({
  content,
  mdxSource,
  extension,
  componentNames,
  frontMatter,
  redirect
}: Props) => {
  const router = useRouter()

  /**
   * Handle deep links / scroll to anchor
   * This wasn't working automatically as expected. Likely because the next/router
   * logic has finished running before the page content is rendered? Handling
   * manually for now.
   */
  useEffect(() => {
    const url = new URL(location.href)
    if (url.hash) {
      const anchor = document.querySelector(url.hash)
      anchor &&
        anchor.scrollIntoView({
          behavior: 'smooth'
        })
    }
  }, [router.asPath])

  //  Handle redirects
  useEffect(() => {
    if (redirect) router.replace('/[...slug]', redirect.join('/'))
  }, [redirect])

  if (redirect) {
    return 'Redirecting...'
  }

  switch (extension) {
    case '.md':
      return (
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{__html: content}}
        />
      )
    case '.mdx':
      const components = {
        Mermaid: componentNames.includes('Mermaid') ? Mermaid : null,
        Octicon: componentNames.includes('Octicon') ? Octicon : null
      }
      return (
        <div className="markdown-body">
          {mdxSource && (
            <MDXRemote
              {...mdxSource}
              components={components}
              scope={{frontMatter, slugify, siteData, markdownToHtml}}
            />
          )}
        </div>
      )
    default:
      return null
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  try {
    let slug = ['']
    if (params?.slug)
      //  coerce to array of strings
      slug = Array.isArray(params.slug) ? params.slug : [params.slug]

    //  Handle redirects
    const redirect = redirectsBySlug.get(JSON.stringify(slug))
    if (redirect) return {props: {redirect: JSON.parse(redirect)}}

    const doc = docsBySlug.get(JSON.stringify(slug))

    if (!doc) throw new Error(`No document for slug: ${slug}`)

    const source = await fs.readFile(path.join(process.cwd(), doc.filePath))
    let {content: rawContent, data} = matter(source)
    const componentNames = []

    //  If toc: true, add table of contents header for remark-toc
    if (data.toc) rawContent = '## On this page\n' + rawContent

    let content: string | undefined
    let mdxSource: MDXRemoteSerializeResult | undefined
    switch (doc.extension) {
      case '.md':
        content = markdownToHtml(rawContent, doc.filePath, fs2)
        break
      case '.mdx':
        ;/<Mermaid/.test(rawContent) && componentNames.push('Mermaid')
        ;/<Octicon/.test(rawContent) && componentNames.push('Octicon')
        mdxSource = await serialize(rawContent, {
          mdxOptions: {
            remarkPlugins: getRemarkPlugins(),
            rehypePlugins: getRehypePlugins(doc.filePath)
          }
        })
        //  NOTE: Temporarilly passing MDX rendered to HTML for search indexing
        content = renderToStaticMarkup(
          <div className="markdown-body">
            <MDXRemote
              {...(mdxSource as MDXRemoteSerializeResult)}
              scope={{frontMatter: data, slugify, siteData, markdownToHtml}}
            />
          </div>
        )
    }

    return {
      props: {
        content,
        mdxSource,
        extension: doc.extension,
        filePath: doc.filePath,
        frontMatter: data,
        componentNames
      }
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Array.from(
    [...docsBySlug.keys(), ...redirectsBySlug.keys()].map(s => ({
      params: {slug: JSON.parse(s)}
    }))
  )

  return {
    paths,
    fallback: false
  }
}

export default Catchall
