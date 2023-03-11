import {FC} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {Pagination, PaginationProps} from '@primer/react'
import TypeChooser from './TypeChooser'
import Octicon from '../Octicon'
import * as gtag from '../../src/util/analytics'

export type results = {
  aggregates: [
    {
      key: string
      count: number
    }
  ]
  meta: {
    found: {
      value: number
    }
    took: {
      query_sec: number
      total_sec: number
    }
    page: number
    pages: number
    shown: number
  }
  hits: [
    {
      id: string
      page_title: string
      type: string
      url: string
      content_highlights_html: string[]
      title_highlights_html: string[]
    }
  ]
}

export type Props = {
  results: results
}

const Results: FC<Props> = ({results}) => {
  const router = useRouter()

  const onPageChange: PaginationProps['onPageChange'] = (e, page) => {
    e.preventDefault()

    const query = {...router.query}

    if (page === 1) {
      delete query.page
    } else {
      query.page = `${page}`
    }

    router.push(
      {
        pathname: router.pathname,
        query
      },
      undefined,
      {shallow: true}
    )
  }

  //  Log click on result and then navigate to result url
  const onResultClick = (url: string) =>
    gtag.event({action: 'Click', category: 'Search', label: url})

  const onBlackbirdClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string
  ) => {
    e.preventDefault()
    gtag.event({action: 'Click Blackbird', category: 'Search', label: url})
    window.location.href = url
  }

  const [asPathRoot, asPathQuery = ''] = router.asPath.split('?')

  function hrefBuilder(page: number) {
    const params = new URLSearchParams(asPathQuery)
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', `${page}`)
    }
    return `${asPathRoot}?${params.toString()}`
  }

  return (
    <div className="Layout Layout--sidebar-narrow Layout--sidebarPosition-end Layout--gutter-spacious mt-2">
      <div className="Layout-sidebar">
        <TypeChooser aggregates={results.aggregates} />
      </div>

      <div className="Layout-main">
        <h2>
          <span className="text-normal">
            {results.meta?.found?.value.toLocaleString()} results for
          </span>{' '}
          {router.query.query}
        </h2>
        {results?.hits?.map(hit => (
          <div key={hit.id}>
            <hr />
            <div className="d-flex flex-items-baseline">
              <Octicon
                name={hit.type === 'news' ? 'megaphone' : 'file'}
                height={16}
                className="mr-2 color-fg-muted"
              />
              <div className="search-result">
                <Link href="/[[...slug]]" as={hit.url}>
                  <a
                    className="color-fg-default no-underline"
                    onClick={() => onResultClick(hit.url)}
                  >
                    <h4 className="text-normal Link">
                      {hit.title_highlights_html?.length > 0 ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: hit.title_highlights_html[0]
                          }}
                        />
                      ) : (
                        hit.page_title
                      )}
                    </h4>
                    <p className="text-small text-bold color-fg-default no-underline">
                      {hit.url}
                    </p>
                  </a>
                </Link>
                {hit.content_highlights_html?.map((html, index) => (
                  <p
                    key={hit.page_title + index}
                    dangerouslySetInnerHTML={{__html: html}}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        {results.meta.pages > 1 && (
          <Pagination
            pageCount={results.meta.pages}
            currentPage={results.meta.page}
            hrefBuilder={hrefBuilder}
            onPageChange={onPageChange}
          />
        )}

        <footer className="mt-8">
          <p className="text-center">
            Not finding what you're looking for?
            <br />
            <a
              href={`https://cs.github.com/?scope=org:github&scopeName=thehub&q=repo:github/thehub+${encodeURIComponent(
                router.query.query?.toString()!
              )}`}
              onClick={e =>
                onBlackbirdClick(
                  e,
                  `https://cs.github.com/?scope=org:github&scopeName=thehub&q=repo:github/thehub+${encodeURIComponent(
                    router.query.query?.toString()!
                  )}`
                )
              }
            >
              Try this search on the Code Search Preview
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Results
