import {posts} from '../../cache/data.js'
import {results, searchResult} from '../../components/search/Results.jsx'

export function searchCatalog(
  query: string,
  currentPage: number,
  totalPerPage: number
): results {
  const postData: searchResult[] = <searchResult[]>posts

  const hits: searchResult[] = query
    ? postData.filter(post => {
        // not interested in these documents
        if (post.title === undefined || post.topics === undefined) {
          return false
        }

        return (
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.topics.toLowerCase().includes(query.toLowerCase())
        )
      })
    : []

  // pagination
  const totalPages = Math.ceil(hits.length / totalPerPage)
  const start = (currentPage - 1) * totalPerPage
  const filteredHits = hits.slice(start, start + totalPerPage)

  return {
    hits: filteredHits,
    meta: {
      found: {
        value: hits.length
      },
      page: currentPage,
      pages: totalPages,
      shown: totalPerPage
    }
  }
}
