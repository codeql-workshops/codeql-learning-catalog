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

  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])

  const searchEndpoint = (query: string) => `/api/search?q=${query}`

  const onChange = useCallback(event => {
    const query = event.target.value
    setQuery(query)
    if (query.length) {
      fetch(searchEndpoint(query))
        .then(res => res.json())
        .then(res => {
          setResults(res.results)
        })
    } else {
      setResults([])
    }
  }, []);

  return (
    <form
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
            title="Search Catalog"
            dangerouslySetInnerHTML={{
              __html: octicons['search'].toSVG({height: 16})
            }}
          />
          {active && results.length > 0 && (
            <ul className="">
              {results.map(({id, title}) => (
                <li className="" key={id}>
                  <Link href="/posts/[id]" as={`/posts/${id}`}>
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
