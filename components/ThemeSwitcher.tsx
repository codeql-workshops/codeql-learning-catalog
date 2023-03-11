import {FC} from 'react'
import Octicon from './Octicon'
import {useTheme, ThemeProviderProps} from '@primer/react'
import useLocalStorage from '../src/hooks/useLocalStorage'

// NOTE: Fast refresh was causing a new org chart to be appended for every
// change. Therefore, we force development fast refresh to do a component reset.
// @refresh reset
// https://nextjs.org/docs/basic-features/fast-refresh#tips

const ThemeSwitcher: FC = () => {
  const {setColorMode, resolvedColorMode, resolvedColorScheme} = useTheme()
  const [colorMode, setColorModeLS] = useLocalStorage<
    NonNullable<ThemeProviderProps['colorMode']>
  >('colorMode', 'auto')

  const handleButtonClick = () => {
    //  Toggle color mode
    const colorMode = resolvedColorMode === 'day' ? 'night' : 'day'
    setColorMode(colorMode)
    setColorModeLS(colorMode)
  }

  return (
    <div
      className="position-fixed right-4 bottom-4 CircleBadge CircleBadge--small"
      style={{zIndex: 100}}
      // Hack to invert theme
      data-color-mode={resolvedColorScheme}
      data-dark-theme="light"
      data-light-theme="dark"
    >
      <button
        className="btn-octicon m-0  color-bg-default"
        aria-label="Toggle theme"
        onClick={handleButtonClick}
      >
        <Octicon
          name={resolvedColorMode === 'day' ? 'moon' : 'sun'}
          height={24}
          className="color-fg-attention"
        />
      </button>
    </div>
  )
}

export default ThemeSwitcher
