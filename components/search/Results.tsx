import {FC} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {Pagination, PaginationProps} from '@primer/react'
import * as gtag from '../../src/util/analytics'
import markdownToHtml from '../../src/util/markdownToHtml'

export type searchResult = {
  id: string
  title: string | undefined
  body: string
  topics: string | undefined
}

export type results = {
  meta: {
    found: {
      value: number
    }
    page: number
    pages: number
    shown: number
  }
  hits: searchResult[]
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
              {/* <Octicon
                name={hit.type === 'news' ? 'megaphone' : 'file'}
                height={16}
                className="mr-2 color-fg-muted"
              /> */}
              <div className="search-result">
                <Link href="/[[...slug]]" as={hit.id}>
                  <a
                    className="color-fg-default no-underline"
                    onClick={() => onResultClick(hit.id)}
                  >
                    <h4 className="text-normal Link">{hit.title}</h4>
                    <p className="text-small text-bold color-fg-default no-underline">
                      {hit.id}
                    </p>
                  </a>
                </Link>
                <p
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(hit.body.substring(0, 1000) + '...')
                  }}
                ></p>
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
      </div>
    </div>
  )
}

export default Results
