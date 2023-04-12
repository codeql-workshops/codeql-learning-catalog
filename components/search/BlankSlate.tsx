import Octicon from '../Octicon'
import * as gtag from '../../src/util/analytics'

export const NoResults = ({query}: {query?: string}) => {
  const onBlackbirdClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string
  ) => {
    e.preventDefault()
    gtag.event({
      action: 'Click Blackbird no results',
      category: 'Search',
      label: url
    })
    window.location.href = url
  }

  return (
    <div className="blankslate blankslate-spacious blankslate-large my-8">
      <Octicon name="search" height={48} className="blankslate-icon" />
      <h3 className="blankslate-heading">
        We couldn't find any results for "{query}"
      </h3>
      <p className="hide-sm">
        Use the search box at the top of the sidebar navigation to enter your
        query
      </p>
      <p className="hide-md hide-lg hide-xl">
        Use the search box at the top of the page to enter your query
      </p>
      
    </div>
  )
}

export const Error = () => (
  <div className="blankslate blankslate-spacious blankslate-large my-8">
    <Octicon
      name="x-circle"
      height={48}
      className="blankslate-icon color-fg-danger"
    />
    <h3 className="blankslate-heading">
      There was an issue performing your search.
    </h3>
    <p>
      Please try again. If the problem persists, please open an issue by
      clicking the button below.
    </p>
    <div className="blankslate-action mt-4">
      <a
        href="https://github.com/github/thehub/issues/new?assignees=&labels=bug,search&template=problem.md"
        className="btn"
        type="button"
      >
        Open Issue
      </a>
    </div>
  </div>
)
