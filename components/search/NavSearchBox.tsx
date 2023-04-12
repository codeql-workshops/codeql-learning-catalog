import {
  FC,
  FormEvent,
  MouseEvent,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react'
import octicons from '@primer/octicons'
import {useRouter} from 'next/router'
import cx from 'classnames'
import {searchPagePathname} from '../../codeql-learning-catalog.config.js'
import Link from 'next/link'

export interface Props {
  isMobileVisible: boolean
}

const NavSearchBox: FC<Props> = ({isMobileVisible, ...props}) => {
  const router = useRouter()
  const searchRef = useRef<HTMLFormElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])

  // Populate inputValue if query exists in url
  useEffect(() => {
    if (
      router.query.query?.toString().trim() &&
      router.pathname === searchPagePathname
    )
      setQuery(router.query.query.toString())
    else setQuery('')
  }, [router.query.query])


  const searchEndpoint = (query: string) => `/api/search?q=${query}`


  const submitSearch = (e: MouseEvent | FormEvent) => {
    e.preventDefault()

    //  Do shallow routing if we're already on the search page
    const shallow = router.pathname === searchPagePathname

    // If we're already on the search page, then preserve the search params
    const query = shallow ? {...router.query} : {}
    //query.query = query

    // track search queries in google analytics
    const gaText = {
      action: 'Submitted',
      category: 'Search',
      label: `${query}`,
      value: 0
    }

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


  const onChange = useCallback(event => {
    const query = event.target.value
    setQuery(query)
    if (query.length) {
      fetch(searchEndpoint(query))
        .then(res => res.json())
        .then(res => {
          setResults(res.hits)
        })
    } else {
      setResults([])
    }
  }, []);

  const onFocus = useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, []);

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false)
      window.removeEventListener('click', onClick)
    }
  }, []);


  return (
    <form
      id="site-search"
      className={cx('search mb-3 mx-4', {'hide-sm': !isMobileVisible})}
      ref={searchRef}
      onSubmit={submitSearch}
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
          value={query}
          onChange={onChange}
          onFocus={onFocus}
  />
        <span className="input-group-button">
          <a
            className="btn"
            title="Search Catalog"
            dangerouslySetInnerHTML={{
              __html: octicons['search'].toSVG({height: 16})
            }}
          />
          {active && results.length > 0 && (
            <ul className="">
              {results.map(({id, title}) => (
                <li className="" key={id}>
                  <Link href={`${id}`}>
                    <a>{title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </span>
      </div>
    </form>
  )
}

export default NavSearchBox
