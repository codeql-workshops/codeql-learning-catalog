import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import useSWR, {Fetcher} from 'swr'
import {apiUrl} from '../codeql-learning-catalog.config.js'
import * as BlankSlate from '../components/search/BlankSlate'
import Results, {results} from '../components/search/Results'

const SEARCH_API_URL = `/api/search`

const fetcher: Fetcher<results, string> = async url => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const data = await res.json()

    data.detail.forEach(console.error)

    const error = new Error('An error occurred while fetching the data.')
    throw error
  } else return res.json()
}

const Search = () => {
  const [isLoadingSlow, setIsLoadingSlow] = useState(false)
  const router = useRouter()

  const isEmptyQuery = !router.query.q

  const queryString = router.asPath.slice(router.asPath.indexOf('q'))
  const {data, error} = useSWR(
    isEmptyQuery ? null : `${SEARCH_API_URL}?${queryString}`,
    fetcher,
    {
      loadingTimeout: 1000,
      onLoadingSlow: () => setIsLoadingSlow(true),
      revalidateOnFocus: false
    }
  )

  if (error) return <BlankSlate.Error />

  // Loading state
  if (!router.isReady || (!data && !isEmptyQuery))
    return isLoadingSlow ? (
      <div>
        <span>Loading</span>
        <span className="AnimatedEllipsis" />
      </div>
    ) : null

    
  if (data && data.hits?.length > 0) return <Results results={data} />

  return <BlankSlate.NoResults query={router?.query?.q?.toString()} />
}

export const QueryTitleWrapper = () => {
  const router = useRouter()
  const query = ` · ${router.query.query}`
  const title = `Search${router.query.query ? query : ''} | The Catalog`
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Search />
    </>
  )
}

export default QueryTitleWrapper
