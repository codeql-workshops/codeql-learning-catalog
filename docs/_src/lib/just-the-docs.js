import * as lunr from 'lunr'

export function startJtd(jtd) {
  // Event handling

  jtd.addEvent = function (el, type, handler) {
    if (el.attachEvent) el.attachEvent('on' + type, handler)
    else el.addEventListener(type, handler)
  }
  jtd.removeEvent = function (el, type, handler) {
    if (el.detachEvent) el.detachEvent('on' + type, handler)
    else el.removeEventListener(type, handler)
  }
  jtd.onReady = function (ready) {
    // in case the document is already rendered
    if (document.readyState != 'loading') ready()
    // modern browsers
    else if (document.addEventListener)
      document.addEventListener('DOMContentLoaded', ready)
  }

  // Show/hide mobile menu

  function initNav() {
    const siteNav = document.getElementById('site-sidebar')
    const siteSearch = document.getElementById('site-search')
    const siteSearchInput = document.getElementById('search-input')

    const menuButton = document.getElementById('menu-button')
    const searchButton = document.getElementById('search-toggle')

    jtd.addEvent(menuButton, 'click', function (e) {
      e.preventDefault()

      if (menuButton.classList.toggle('nav-open')) {
        siteNav.classList.add('nav-open')
      } else {
        siteNav.classList.remove('nav-open')
      }
    })

    jtd.addEvent(searchButton, 'click', function (e) {
      e.preventDefault()

      if (searchButton.classList.toggle('search-open')) {
        siteSearch.classList.add('d-block')
        // Set a brief timeout so that focus has time to jump
        setTimeout(function () {
          siteSearchInput.focus()
        }, 0)
      } else {
        siteSearchInput.blur()
        siteSearch.classList.remove('d-block')
      }
    })
  }

  // Site search

  function initSearch() {
    // For large numbers of documents, it can take time for Lunr to build an index.
    // The time taken to build the index can lead a browser to block; making the
    // site seem unresponsive.
    //
    // See https://lunrjs.com/guides/index_prebuilding.html
    //
    // By shifting the index building to a Web Worker, it happens in the background,
    // without blocking the UI thread.
    //
    if (typeof Worker !== 'undefined') {
      var worker = new Worker('/assets/js/search-worker.bundle.js')

      // Once the index is built, the Web Worker will respond with:
      // - index: The serialized index
      // - docs: The docs array of all the content (required for the search previews)
      // - sections: The array of sections that searches can be scoped to. e.g. section:hr
      worker.onmessage = function (e) {
        var indexContent = JSON.parse(e.data.index)
        var docs = e.data.docs
        var sections = e.data.sections

        // Once the index is loaded, we don't need the worker anymore.
        worker.terminate()

        // Create the lunr index from the pre-built serialized index.
        var index = lunr.Index.load(indexContent)

        searchLoaded(index, docs, sections)
      }

      // Start the search indexer Web Worker
      worker.postMessage({
        init: {
          json_data_path: jtd.json_data_path,
          tokenizer_separator: jtd.tokenizer_separator
        }
      })
    } else {
      // Fallback
      console.error(
        'No Web Worker support. Loading search index synchronously.'
      )

      var request = new XMLHttpRequest()
      request.open('GET', jtd.json_data_path, true)

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          var docs = JSON.parse(request.responseText)
          var sections = []

          lunr.tokenizer.separator = jtd.tokenizer_separator

          var index = lunr(function () {
            this.ref('id')
            this.field('title', {boost: 200})
            this.field('content', {boost: 2})
            this.field('relUrl')
            this.field('section')
            this.metadataWhitelist = ['position']

            for (var i in docs) {
              this.add({
                id: i,
                title: docs[i].title,
                content: docs[i].content,
                relUrl: docs[i].relUrl,
                section: docs[i].section
              })
              sections.push(docs[i].section)
            }
          })

          var sortedSections = new Set(sections.sort())
          searchLoaded(index, docs, sortedSections)
        } else {
          console.log(
            'Error loading ajax request. Request status:' + request.status
          )
        }
      }

      request.onerror = function () {
        console.log('There was a connection error')
      }

      request.send()
    }
  }

  function searchLoaded(index, docs, sections) {
    var index = index
    var docs = docs
    var searchInput = document.getElementById('search-input')
    var searchResults = document.getElementById('search-results')
    var mainHeader = document.getElementById('main-header')
    var currentInput
    var currentSearchIndex = 0

    var searchSectionHints = document.querySelector('.js-search-sections')
    if (searchSectionHints) {
      searchSectionHints.innerHTML = '' // Clear out loading
      for (var section of sections) {
        var childEl = document.createElement('li')
        childEl.innerHTML = section
        searchSectionHints.appendChild(childEl)
      }
    }

    function showSearch() {
      document.documentElement.classList.add('search-active')
    }

    function hideSearch() {
      document.documentElement.classList.remove('search-active')
    }

    function update() {
      currentSearchIndex++

      var input = searchInput.value
      if (input === '') {
        hideSearch()
      } else {
        showSearch()
        // scroll search input into view, workaround for iOS Safari
        window.scroll(0, -1)
        setTimeout(function () {
          window.scroll(0, 0)
        }, 0)
      }
      if (input === currentInput) {
        return
      }
      currentInput = input
      searchResults.innerHTML = ''
      if (input === '') {
        return
      }

      const searchParser = require('../vendor/search-query-parser')
      const parsedQuery = searchParser.parse(input, {keywords: ['section']})

      if (
        typeof parsedQuery !== 'string' &&
        !sections.has(parsedQuery.section)
      ) {
        if (parsedQuery.section && parsedQuery.section.length >= 2) {
          var noResultsDiv = document.createElement('div')
          var listElement = document.createElement('ul')

          noResultsDiv.classList.add('search-no-result')
          noResultsDiv.classList.add('text-left')
          noResultsDiv.innerText = `${
            parsedQuery.section || 'That'
          } is not a valid section. The valid sections are:`

          for (var section of sections) {
            var childEl = document.createElement('li')
            childEl.innerHTML = section
            listElement.appendChild(childEl)
          }

          noResultsDiv.appendChild(listElement)
          searchResults.appendChild(noResultsDiv)
        }
      } else {
        filterResults(index, currentSearchIndex, parsedQuery)
      }

      function filterResults(index, currentSearchIndex, parsedQuery) {
        // If parsed query doesnt parse anything out, then we will have a string.
        // In this case, parse as per normal. Otherwise, use the extracted text.
        let searchQuery = ''
        if (typeof parsedQuery === 'string') {
          searchQuery = parsedQuery
        } else {
          searchQuery = parsedQuery.text || ''
        }

        var results = index.query(function (query) {
          var tokens = lunr.tokenizer(searchQuery)

          query.term(tokens, {
            boost: 10
          })
          query.term(tokens, {
            wildcard: lunr.Query.wildcard.TRAILING
          })

          if (typeof parsedQuery !== 'string' && parsedQuery.section) {
            query.term(parsedQuery.section, {
              fields: ['section'],
              presence: lunr.Query.presence.REQUIRED,
              wildcard: lunr.Query.wildcard.NONE
            })
          }
        })

        if (results.length == 0 && searchQuery.length > 2) {
          var tokens = lunr.tokenizer(searchQuery).filter(function (token, i) {
            return token.str.length < 20
          })
          if (tokens.length > 0) {
            results = index.query(function (query) {
              query.term(tokens, {
                editDistance: Math.round(Math.sqrt(searchQuery.length / 2 - 1))
              })
            })
          }
        }

        if (results.length == 0) {
          var noResultsDiv = document.createElement('div')
          noResultsDiv.classList.add('search-no-result')
          noResultsDiv.innerText = 'No results found'
          searchResults.appendChild(noResultsDiv)
        } else {
          var resultsList = document.createElement('ul')
          resultsList.classList.add('search-results-list')
          searchResults.appendChild(resultsList)

          addResults(resultsList, results, 0, 10, 100, currentSearchIndex)
        }
      }

      function addResults(
        resultsList,
        results,
        start,
        batchSize,
        batchMillis,
        searchIndex
      ) {
        if (searchIndex != currentSearchIndex) {
          return
        }
        for (var i = start; i < start + batchSize; i++) {
          if (i == results.length) {
            return
          }
          addResult(resultsList, results[i])
        }
        setTimeout(function () {
          addResults(
            resultsList,
            results,
            start + batchSize,
            batchSize,
            batchMillis,
            searchIndex
          )
        }, batchMillis)
      }

      function addResult(resultsList, result) {
        var doc = docs[result.ref]

        var resultsListItem = document.createElement('li')
        resultsListItem.classList.add('search-results-list-item')
        resultsList.appendChild(resultsListItem)

        var resultLink = document.createElement('a')
        resultLink.classList.add('search-result')
        resultLink.setAttribute('href', doc.url)
        resultsListItem.appendChild(resultLink)

        var resultTitle = document.createElement('div')
        resultTitle.classList.add('search-result-title')
        resultLink.appendChild(resultTitle)

        var resultDoc = document.createElement('div')
        resultDoc.classList.add('search-result-doc')
        resultDoc.innerHTML =
          '<svg width="16" height="16" class="search-result-icon"><use xlink:href="#file"></use></svg>'
        resultTitle.appendChild(resultDoc)

        var resultDocTitle = document.createElement('div')
        resultDocTitle.classList.add('search-result-doc-title')
        resultDocTitle.innerHTML = doc.doc
        resultDoc.appendChild(resultDocTitle)
        var resultDocOrSection = resultDocTitle

        if (doc.doc != doc.title) {
          resultDoc.classList.add('search-result-doc-parent')
          var resultSection = document.createElement('div')
          resultSection.classList.add('search-result-section')
          resultSection.innerHTML = doc.title
          resultTitle.appendChild(resultSection)
          resultDocOrSection = resultSection
        }

        var metadata = result.matchData.metadata
        var titlePositions = []
        var contentPositions = []
        for (var j in metadata) {
          var meta = metadata[j]
          if (meta.title) {
            var positions = meta.title.position
            for (var k in positions) {
              titlePositions.push(positions[k])
            }
          }
          if (meta.content) {
            var positions = meta.content.position
            for (var k in positions) {
              var position = positions[k]
              var previewStart = position[0]
              var previewEnd = position[0] + position[1]
              var ellipsesBefore = true
              var ellipsesAfter = true
              for (var k = 0; k < jtd.preview_words_before; k++) {
                var nextSpace = doc.content.lastIndexOf(' ', previewStart - 2)
                var nextDot = doc.content.lastIndexOf('. ', previewStart - 2)
                if (nextDot >= 0 && nextDot > nextSpace) {
                  previewStart = nextDot + 1
                  ellipsesBefore = false
                  break
                }
                if (nextSpace < 0) {
                  previewStart = 0
                  ellipsesBefore = false
                  break
                }
                previewStart = nextSpace + 1
              }
              for (var k = 0; k < jtd.preview_words_after; k++) {
                var nextSpace = doc.content.indexOf(' ', previewEnd + 1)
                var nextDot = doc.content.indexOf('. ', previewEnd + 1)
                if (nextDot >= 0 && nextDot < nextSpace) {
                  previewEnd = nextDot
                  ellipsesAfter = false
                  break
                }
                if (nextSpace < 0) {
                  previewEnd = doc.content.length
                  ellipsesAfter = false
                  break
                }
                previewEnd = nextSpace
              }
              contentPositions.push({
                highlight: position,
                previewStart: previewStart,
                previewEnd: previewEnd,
                ellipsesBefore: ellipsesBefore,
                ellipsesAfter: ellipsesAfter
              })
            }
          }
        }

        if (titlePositions.length > 0) {
          titlePositions.sort(function (p1, p2) {
            return p1[0] - p2[0]
          })
          resultDocOrSection.innerHTML = ''
          addHighlightedText(
            resultDocOrSection,
            doc.title,
            0,
            doc.title.length,
            titlePositions
          )
        }

        if (contentPositions.length > 0) {
          contentPositions.sort(function (p1, p2) {
            return p1.highlight[0] - p2.highlight[0]
          })
          var contentPosition = contentPositions[0]
          var previewPosition = {
            highlight: [contentPosition.highlight],
            previewStart: contentPosition.previewStart,
            previewEnd: contentPosition.previewEnd,
            ellipsesBefore: contentPosition.ellipsesBefore,
            ellipsesAfter: contentPosition.ellipsesAfter
          }
          var previewPositions = [previewPosition]
          for (var j = 1; j < contentPositions.length; j++) {
            contentPosition = contentPositions[j]
            if (previewPosition.previewEnd < contentPosition.previewStart) {
              previewPosition = {
                highlight: [contentPosition.highlight],
                previewStart: contentPosition.previewStart,
                previewEnd: contentPosition.previewEnd,
                ellipsesBefore: contentPosition.ellipsesBefore,
                ellipsesAfter: contentPosition.ellipsesAfter
              }
              previewPositions.push(previewPosition)
            } else {
              previewPosition.highlight.push(contentPosition.highlight)
              previewPosition.previewEnd = contentPosition.previewEnd
              previewPosition.ellipsesAfter = contentPosition.ellipsesAfter
            }
          }

          var resultPreviews = document.createElement('div')
          resultPreviews.classList.add('search-result-previews')
          resultLink.appendChild(resultPreviews)

          var content = doc.content
          for (
            var j = 0;
            j < Math.min(previewPositions.length, jtd.previews);
            j++
          ) {
            var position = previewPositions[j]

            var resultPreview = document.createElement('div')
            resultPreview.classList.add('search-result-preview')
            resultPreviews.appendChild(resultPreview)

            if (position.ellipsesBefore) {
              resultPreview.appendChild(document.createTextNode('... '))
            }
            addHighlightedText(
              resultPreview,
              content,
              position.previewStart,
              position.previewEnd,
              position.highlight
            )
            if (position.ellipsesAfter) {
              resultPreview.appendChild(document.createTextNode(' ...'))
            }
          }
        }

        var resultRelUrl = document.createElement('span')
        resultRelUrl.classList.add('search-result-rel-url')
        resultRelUrl.innerText = doc.relUrl
        resultTitle.appendChild(resultRelUrl)
      }

      function addHighlightedText(parent, text, start, end, positions) {
        var index = start
        for (var i in positions) {
          var position = positions[i]
          var span = document.createElement('span')
          span.innerHTML = text.substring(index, position[0])
          parent.appendChild(span)
          index = position[0] + position[1]
          var highlight = document.createElement('span')
          highlight.classList.add('search-result-highlight')
          highlight.innerHTML = text.substring(position[0], index)
          parent.appendChild(highlight)
        }
        var span = document.createElement('span')
        span.innerHTML = text.substring(index, end)
        parent.appendChild(span)
      }
    }

    jtd.addEvent(searchInput, 'focus', function () {
      setTimeout(update, 0)
    })

    jtd.addEvent(searchInput, 'keyup', function (e) {
      switch (e.keyCode) {
        case 27: // When esc key is pressed, hide the results and clear the field
          searchInput.value = ''
          break
        case 38: // arrow up
        case 40: // arrow down
        case 13: // enter
          e.preventDefault()
          return
      }
      update()
    })

    jtd.addEvent(searchInput, 'keydown', function (e) {
      switch (e.keyCode) {
        case 38: // arrow up
          e.preventDefault()
          var active = document.querySelector('.search-result.active')
          if (active) {
            active.classList.remove('active')
            if (active.parentElement.previousSibling) {
              var previous =
                active.parentElement.previousSibling.querySelector(
                  '.search-result'
                )
              previous.classList.add('active')
            }
          }
          return
        case 40: // arrow down
          e.preventDefault()
          var active = document.querySelector('.search-result.active')
          if (active) {
            if (active.parentElement.nextSibling) {
              var next =
                active.parentElement.nextSibling.querySelector('.search-result')
              active.classList.remove('active')
              next.classList.add('active')
            }
          } else {
            var next = document.querySelector('.search-result')
            if (next) {
              next.classList.add('active')
            }
          }
          return
        case 13: // enter
          e.preventDefault()
          var active = document.querySelector('.search-result.active')
          if (active) {
            active.click()
          } else {
            var first = document.querySelector('.search-result')
            if (first) {
              first.click()
            }
          }
          return
      }
    })

    jtd.addEvent(document, 'click', function (e) {
      if (e.target != searchInput) {
        hideSearch()
      }
    })

    // If any searching happened while the index was being loaded, go do it now.
    setTimeout(update, 0)
  }

  // Document ready

  jtd.onReady(function () {
    initNav()
    initSearch()
  })
}
