document.addEventListener('DOMContentLoaded', function () {
  const toggleSwitch = document.querySelector(
    '.theme-switch input[type="checkbox"]'
  )
  const currentTheme = localStorage.getItem('theme')

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme)

    if (currentTheme === 'dark') {
      toggleSwitch.checked = true

      const collectionEmbeds = document.querySelectorAll('.rewatch-embed')
      for (const item of collectionEmbeds) {
        item.src = item.src + '?dark_mode=true'
      }
    }
  }

  function switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')

      const collectionEmbeds = document.querySelectorAll('.rewatch-embed')
      for (const item of collectionEmbeds) {
        item.src = item.src + '?dark_mode=true'
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')

      const collectionEmbeds = document.querySelectorAll('.rewatch-embed')
      for (const item of collectionEmbeds) {
        item.src = item.src + '?dark_mode=false'
      }
    }
  }

  toggleSwitch.addEventListener('change', switchTheme, false)
})
