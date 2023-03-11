export {}

document.addEventListener('DOMContentLoaded', function () {
  const toggleSwitch = <HTMLInputElement>(
    document.querySelector('.theme-switch input[type="checkbox"]')
  )
  const currentTheme = localStorage.getItem('theme')

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme)
    setMermaidTheme(currentTheme)
    if (currentTheme === 'dark') {
      toggleSwitch.checked = true
    }
  }

  function switchTheme(e: Event) {
    if ((e.target as HTMLInputElement).checked) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  // Note that this only works when the page loads, it doesn't work even if we call this inside "switchTheme" (toggling modes), tracked with https://github.com/github/thehub/issues/6859
  function setMermaidTheme(hubTheme: string) {
    const mermaidInstance = (window as any).mermaid
    if (!!mermaidInstance) {
      const mermaidAPI = mermaidInstance.mermaidAPI
      mermaidAPI.initialize({
        theme: hubTheme === 'light' ? 'default' : 'dark'
      })
      // https://github.com/jasonbellamy/jekyll-mermaid/blob/3363e4b156f438e791d66aa2fe6c37d7475c7b67/lib/jekyll-mermaid.rb#L10 loads scripts more than once if there are more mermaid diagrams
      // ..so there is potential of one overriding another, so we need to force mermaid to re-render
      // let's get all div's with class mermaid
      const mermaidDivs = document.querySelectorAll('.mermaid')
      // remove `data-processed` attribute from all mermaid divs, since mermaid script depends on this https://github.com/mermaid-js/mermaid/blob/43854a2921eeceb74b2f782d8ef3cfadaebebbf4/src/mermaid.js#L90
      mermaidDivs.forEach(div => div.removeAttribute('data-processed'))
      // re-render all mermaid divs by calling init again
      mermaidInstance.init()
    }
  }

  toggleSwitch.addEventListener('change', switchTheme, false)
})
