'use strict'

const fs = require('fs')
var {parse} = require('rss-to-json')

const readme_podcast = 'https://anchor.fm/s/5a87b0f4/podcast/rss'

parse(readme_podcast).then(rss => {
  let data = JSON.stringify(rss, null, 3)

  fs.writeFile('./docs/_data/readme-podcast.json', data, err => {
    if (err) throw err
    console.log('JSON successfully written')
  })
  console.log('All done')
})
