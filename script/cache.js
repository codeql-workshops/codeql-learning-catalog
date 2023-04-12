const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const dataDirectory = 'docs'

function pathIsInWorkshop(path) {
  return (
    path.startsWith(dataDirectory + '/' + 'QLC') ||
    path.startsWith(dataDirectory + '/' + 'LDF') ||
    path.startsWith(dataDirectory + '/' + 'TIP') ||
    path.startsWith(dataDirectory + '/' + 'EXP')
  )
}

function getContentFiles(dir, acc) {
  acc = acc || []
  var files = fs.readdirSync(dir)
  for (var i in files) {
    var name = dir + '/' + files[i]
    if (fs.statSync(name).isDirectory()) {
      getContentFiles(name, acc)
    } else {
      if (pathIsInWorkshop(name) && name.endsWith('.md')) {
        acc.push(name)
      }
    }
  }
  return acc
}

function getPosts() {
  const fileNames = getContentFiles(dataDirectory) // getting all the markdown files
  const posts = fileNames.map(fileName => { // iterating over the files
     // first remove md extension 
     var id = fileName.replace(/\.md$/, '') // removing the .md extension
     // if the url ends with index, remove it
     id = id.replace(/\/index$/, '') // removing the /index
     // remove the docs/ prefix
     id = id.replace(/^docs\//, '') // removing the docs/ prefix
    const fileContents = fs.readFileSync(fileName, 'utf8')  // reading the file
    const matterResult = matter(fileContents) // parsing the file

    const topics = matterResult.data.topics ? matterResult.data.topics : matterResult.data.title;

    return {
      id,
      title: matterResult.data.title,
      body: matterResult.content,
      topics: topics 
    }
  })
  return JSON.stringify(posts)
}

const fileContents = `export const posts = ${getPosts()}` 

try {
  fs.readdirSync('cache')
} catch (e) {
  fs.mkdirSync('cache')
}

// write the cache 
fs.writeFile('cache/data.js', fileContents, function (err) {
  if (err) return console.log(err)
  console.log('Post cache updated')
})
