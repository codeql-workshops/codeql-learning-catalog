import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC} from 'react'
import Octicon from './Octicon'
import {docsBySlug, Doc} from '../src/util/docs'
import cx from 'classnames'

export interface Props {
  links: Doc['children']
}

const SubNav: FC<Props> = ({links}) => {
  const router = useRouter()
  if (!links) return null

  const docs = links
    .map(slug => docsBySlug.get(slug))
    .filter(doc => {
      if (doc?.frontmatter) return !doc.frontmatter.nav_exclude
      else return true
    })
    .filter((doc): doc is Doc => !!doc)
    .sort((a, b) => {
      //  Sort by title (fallback to file name)
      // const titleA = a.frontmatter?.title?.toUpperCase() || a.name.toUpperCase()
      // const titleB = b.frontmatter?.title?.toUpperCase() || b.name.toUpperCase()
      const titleA = a.name.toUpperCase()
      const titleB = b.name.toUpperCase()

      if (titleA < titleB) return -1
      if (titleA > titleB) return 1
      return 0
    })

  return (
    <ul>
      {docs.map(doc => {
        const active = router.asPath.startsWith(doc.path)
        const hasChildren = !!doc.children

        return (
          <li key={JSON.stringify(doc.slug)}>
            <Link href={doc.path}>
              <a
                className={cx('no-underline d-flex py-1', {
                  'active text-bold': active
                })}
              >
                {doc.frontmatter?.octicon && (
                  <Octicon
                    name={doc.frontmatter.octicon}
                    height={16}
                    className="mr-2 color-fg-subtle"
                  />
                )}

                {!doc.frontmatter?.octicon && (
                  <Octicon
                    name={hasChildren ? 'file-directory' : 'file'}
                    height={16}
                    className="mr-2 color-fg-subtle"
                  />
                )}

                <span>{doc.frontmatter.title || doc.name}</span>
              </a>
            </Link>
            {active && hasChildren && <SubNav links={doc.children} />}
          </li>
        )
      })}
    </ul>
  )
}

export default SubNav
