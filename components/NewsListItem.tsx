import {FC} from 'react'
import {formatInTimeZone} from 'date-fns-tz'
import Link from 'next/link'
import {Doc} from '../src/util/docs'

export interface Props {
  post: Doc
}

const NewsListItem: FC<Props> = ({post}) => (
  <div className="d-flex flex-items-start mb-6">
    <div className="flex-shrink-0 mr-4">
      {post.frontmatter.author && (
        <a
          href={`https://github.com/${post.frontmatter.author}`}
          rel="noopener"
        >
          <img
            className="avatar avatar-7"
            src={`https://avatars.githubusercontent.com/${post.frontmatter.author}?s=96`}
            width="48"
            height="48"
          />
        </a>
      )}
    </div>

    <div>
      <h2 className="lh-condensed">
        {/***
         * NOTE: Link was trying to render this listing page when linking to
         * an individual post. So we use href/as to force the use of the
         * [[...slug]] page.
         *
         * The current version of Nextjs doesn't need this by default. We are
         * forcing it to fallback to a previous behaviour.
         * https://nextjs.org/docs/api-reference/next/link
         * https://nextjs.org/docs/tag/v9.5.2/api-reference/next/link#dynamic-routes
         */}
        <Link href="/[[...slug]]" as={post.path}>
          <a>{post.frontmatter.title}</a>
        </Link>
      </h2>

      <div className="color-fg-muted">
        Posted by{' '}
        <a
          href={`https://github.com/${post.frontmatter.author}`}
          target="_blank"
          className="color-fg-muted"
        >
          {post.frontmatter.author}
        </a>{' '}
        on{' '}
        {formatInTimeZone(
          new Date(post.frontmatter.date_published),
          'UTC',
          'MMM dd, yyyy'
        )}
        {/* | date: '%B %d, %Y' }} */}
      </div>

      <p className="f4 mt-1 mb-0">{post.frontmatter.description}</p>
    </div>
  </div>
)

export default NewsListItem
