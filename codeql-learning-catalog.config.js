module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  searchPagePathname: '/search',
  repo: {
    url: 'https://github.com/codeql-workshops/codeql-learning-catalog',
    branch: process.env.NEXT_PUBLIC_REPO_BRANCH || 'master'
  },
  topLevelNav: [
    'overview',
    'QLC',
    'LDF'
  ],
  lowerLevelNav: [
    {
      text: 'CodeQL Language Reference',
      url: 'https://codeql.github.com/docs/ql-language-reference',
      icon: 'file-code'
    },

    {
      text: 'CodeQL Standard Library Reference',
      url: 'https://codeql.github.com/codeql-standard-libraries',
      icon: 'file-code'
    },

    {
      text: 'CodeQL Query Help',
      url: 'https://codeql.github.com/codeql-query-help',
      icon: 'file-code'
    },

    {
      text: 'CodeQL For VS Code Guide',
      url: 'https://codeql.github.com/docs/codeql-for-visual-studio-code',
      icon: 'file-code'
    },

    {
      text: 'CodeQL CLI Guide',
      url: 'https://codeql.github.com/docs/codeql-cli',
      icon: 'file-code'
    }
  ]
}
