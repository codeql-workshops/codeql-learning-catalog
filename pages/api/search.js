const posts = require('../../cache/data').posts

export default (req, res) => {
  const results = req.query.q
    ? posts.filter(post =>
        post.title.toLowerCase().includes(req.query.q.toLowerCase()) ||
        post.topics.toLowerCase().includes(req.query.q.toLowerCase())
      )
    : []
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({results}))
}
