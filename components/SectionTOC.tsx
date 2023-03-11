import {FC} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {docsBySlug} from '../src/util/docs'

export interface Props {
  frontMatter: {
    show_section_toc?: boolean
  }
}

const SectionTOC: FC<Props> = ({frontMatter}) => {
  const router = useRouter()

  let slug = ['']
  if (router.query.slug) {
    //  coerce to array of strings
    slug = Array.isArray(router.query.slug)
      ? router.query.slug
      : [router.query.slug]
  }

  const doc = docsBySlug.get(JSON.stringify(slug))

  if (!doc) return null

  if (!(frontMatter.show_section_toc && doc.name.startsWith('index.md')))
    return null

  return (
    <div className="mt-4 markdown-body">
      <h2>What's in this section:</h2>

      <ul>
        {doc.children?.map(slug => {
          const child = docsBySlug.get(slug)
          if (!child) return null

          return (
            <li key={child.path}>
              <Link href={child.path}>
                <a>{child.frontmatter.title}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SectionTOC
