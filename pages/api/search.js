const posts = require('../../cache/data').posts

const totalPerPage = 10;


export default (req, res) => {
  const hits = req.query.q
    ? posts.filter(post => {
        // not interested in these documents
        if (post.title === undefined || post.topics === undefined) {
          return false
        }

        return (
          post.title.toLowerCase().includes(req.query.q.toLowerCase()) ||
          post.topics.toLowerCase().includes(req.query.q.toLowerCase())
        )
      })
    : []
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  // pagination
  const currentPage = req.query.page || 1;
  const totalPages = Math.ceil(hits.length / totalPerPage);
  const start = (currentPage - 1) * totalPerPage;
  
  const filteredHits = hits.slice(start, start + totalPerPage);

  res.end(JSON.stringify({
    hits: filteredHits,
    meta: {
      found: {
        value: hits.length,
      },
      page: parseInt(currentPage),
      pages: totalPages,
      shown: totalPerPage 
    }
  }))
}
