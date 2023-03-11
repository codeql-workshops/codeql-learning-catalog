export {}

function createFeedbackIssue() {
  let text = ''
  try {
    const maybeSelection = window.getSelection()
    if (maybeSelection) {
      text = maybeSelection.toString()
    }
  } catch (e) {}

  const link = <HTMLAnchorElement>(
    document.querySelector('.js-report-issue-link')
  )
  if (!link) return
  const href = new URL(link.href, window.location.origin)
  const bodyEl = <HTMLInputElement>(
    document.querySelector('.js-report-issue-body')
  )
  if (bodyEl) {
    let body = bodyEl.value.split('\n')
    // add footer
    body = body.concat(['\n*Brought to you by the `!` hotkey.*'])
    // Quote any selected text
    if (text)
      body[body.findIndex(s => s.includes('# Context'))] +=
        '\n\n> ' + text + '\n'
    href.searchParams.set('body', body.join('\n'))
    window.open(href.toString(), '_blank')
  } else {
    link.click()
  }
}

document.addEventListener('DOMContentLoaded', event => {
  // Listener for the 'File an Issue' button
  const reportIssueLink: HTMLAnchorElement | null = document.querySelector(
    '.js-report-issue-link'
  )
  if (reportIssueLink) {
    reportIssueLink.onclick = event => {
      event.preventDefault()
      createFeedbackIssue()
    }
  }

  document.addEventListener('keyup', event => {
    // ! shortcut detected
    if (event.key === '!' && !event.ctrlKey && !event.metaKey) {
      createFeedbackIssue()
      // / shortcut detected
    } else if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
      const input = <HTMLInputElement>document.querySelector('.js-search-input')
      if (!input) return
      input.focus()
    }
  })
})
