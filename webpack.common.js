/**
 * Separate config from Next.js for bundling search-worker and similar separate
 * scripts.
 */

const path = require('path')
const yaml = require('js-yaml')
const matter = require('gray-matter')
const DirectoryTreePlugin = require('directory-tree-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new DirectoryTreePlugin({
      dir: 'docs',
      path: './docsTree.json',
      extensions: /\.md/,
      exclude: [/docs[\/\w]*\/_\w*/, /\/\.\w*/, /docs\/assets/],
      enhance: enhanceDirTree
    }),
    new CopyPlugin({
      patterns: [
        {
          //  Copy media folders from docs/ to public/
          from: '**/media/*',
          to: '../images/bundled/',
          context: 'docs/'
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/assets/js')
  }
}

function enhanceDirTree(item, options) {
  item.filePath = item.path

  let frontmatter
  if (item.type === 'file') {
    try {
      frontmatter = matter.read(item.filePath)
    } catch (e) {
      if (e.code !== 'ENOENT') console.error(`${e.message}\n${item.filePath}`)
    }
  }

  item.frontmatter = frontmatter?.data || {}

  item.path = item.path
    .replace(options.dir, '') //  Remove dir from path
    .replace(/\/index\.mdx?/, '') //  Remove index filename from path
    .replace(item.extension || '', '') //  Remove extension from path

  item.slug = item.path.substring(1).split('/')
}
