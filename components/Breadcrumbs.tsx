import {ReactNode} from 'react'
import cx from 'classnames'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {docsBySlug} from '../src/util/docs'

const Breadcrumbs = () => {
  const router = useRouter()

  let slug = router.asPath.slice(1, -1).split('/')

  if (slug[0] === 'news') {
    return (
      <nav aria-label="breadcrumbs">
        <ol>
          <li className="breadcrumb-item breadcrumb-item-selected">
            <Link href="/news/">
              <a className="color-fg-accent">News</a>
            </Link>
          </li>
        </ol>
      </nav>
    )
  }

  const crumbs = slug.map((item, index): ReactNode => {
    const slugString = JSON.stringify(slug.slice(0, index + 1))
    const selected = index + 1 === slug.length
    const doc = docsBySlug.get(slugString)

    if (!doc) return null

    return (
      <li
        className={cx('breadcrumb-item', {
          'breadcrumb-item-selected': selected
        })}
        key={`crumb-${slugString}}`}
      >
        <Link href={doc.path}>
          <a aria-current="location">{doc.frontmatter.title}</a>
        </Link>
      </li>
    )
  })

  return (
    <nav aria-label="breadcrumbs">
      <ol>{crumbs}</ol>
    </nav>
  )
}

export default Breadcrumbs
