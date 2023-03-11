export * from './lib/hotkeys'
export * from './lib/theme-switch'
import * as just_the_docs from './lib/just-the-docs.js'
import AnchorJS from 'anchor-js'

const jtdOptions = {
  json_data_path: '/assets/js/search-data.json',
  preview_words_before: 5,
  tokenizer_separator: /[\s\-/]+/,
  preview_words_after: 10,
  previews: 3
}

just_the_docs.startJtd(jtdOptions)

function addOptionalSearchQuery() {
  // Only parse and interpret the search
  // query if we're on the homepage.
  // This avoids any issues with other pages
  // that might want to use query parameters,
  // like the org chart
  if (window.location.pathname !== '/') {
    return
  }

  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  const searchParameters = params.get('q')
  if (searchParameters) {
    const searchInput = document.getElementById(
      'search-input'
    ) as HTMLInputElement
    searchInput.value = searchParameters
    searchInput.focus()
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  addOptionalSearchQuery()
  const anchors = new AnchorJS()
  anchors.options = {
    placement: 'left',
    visible: 'hover'
  }
  anchors.add(`.markdown-body h2:not(.no-anchor),
              .markdown-body h3:not(.no-anchor),
              .markdown-body h4:not(.no-anchor)
              `)
})
