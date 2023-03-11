import {FC, FormEvent, MouseEvent, useState, useEffect} from 'react'
import octicons from '@primer/octicons'
import {useRouter} from 'next/router'
import cx from 'classnames'
import {searchPagePathname} from '../../codeql-learning-catalog.config.js'
import * as gtag from '../../src/util/analytics'

export interface Props {
  isMobileVisible: boolean
}

const NavSearchBox: FC<Props> = ({isMobileVisible, ...props}) => {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')

  // Populate inputValue if query exists in url
  useEffect(() => {
    if (
      router.query.query?.toString().trim() &&
      router.pathname === searchPagePathname
    )
      setInputValue(router.query.query.toString())
    else setInputValue('')
  }, [router.query.query])

  const submitSearch = (e: MouseEvent | FormEvent) => {
    e.preventDefault()

    //  Do shallow routing if we're already on the search page
    const shallow = router.pathname === searchPagePathname

    // If we're already on the search page, then preserve the search params
    const query = shallow ? {...router.query} : {}
    query.query = inputValue

    // track search queries in google analytics
    const gaText = {
      action: 'Submitted',
      category: 'Search',
      label: `${inputValue}`,
      value: 0
    }
    gtag.event(gaText)

    // If you're changing the query, always reset the page
    if ('page' in query) delete query.page

    router.push(
      {
        pathname: searchPagePathname,
        query
      },
      undefined,
      {shallow}
    )
  }

  return (
    <form
      onSubmit={submitSearch}
      id="site-search"
      className={cx('search mb-3 mx-4', {'hide-sm': !isMobileVisible})}
    >
      <div className="input-group">
        <input
          type="search"
          name="search"
          id="search-input"
          className="form-control search-input js-search-input"
          placeholder="Search Catalog"
          aria-label="Search Catalog"
          autoComplete="off"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <span className="input-group-button">
          <a
            className="btn"
            title="Search ProTips"
            onClick={submitSearch}
            dangerouslySetInnerHTML={{
              __html: octicons['search'].toSVG({height: 16})
            }}
          />
        </span>
      </div>
    </form>
  )
}

export default NavSearchBox
