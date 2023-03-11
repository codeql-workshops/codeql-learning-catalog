const fs = require('fs')

module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'js-yaml-loader'
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: '@svgr/webpack'
    })

    return config
  },
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  trailingSlash: true
}
