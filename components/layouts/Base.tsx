import {FC, useEffect} from 'react'
import {useTheme, ThemeProviderProps} from '@primer/react'
import SidebarNav from '../SidebarNav'
import useLocalStorage from '../../src/hooks/useLocalStorage'

// NOTE: Fast refresh doesn't drigger the `useEffect`. For dev purposes, we
// force it to.
// @refresh reset
// https://nextjs.org/docs/basic-features/fast-refresh#tips

const BaseLayout: FC = ({children}) => {
  const {colorScheme, setColorMode} = useTheme()
  const [colorMode] = useLocalStorage<
    NonNullable<ThemeProviderProps['colorMode']>
  >('colorMode', 'auto')

  useEffect(() => {
    // Timeout needed to workaround Primer React bug
    // https://github.com/primer/react/issues/1865
    setTimeout(() => setColorMode(colorMode))
  }, [])

  return (
    <div
      className="Layout color-bg-default"
      style={{minHeight: '100vh'}}
      data-color-mode={colorScheme}
      data-dark-theme="dark_dimmed"
      data-light-theme="light"
    >
      <SidebarNav className="Layout-sidebar" />
      <div className="Layout-main py-sm-4 px-3 px-sm-0 pr-sm-4 pl-2">
        <div className="Layout-main-centered-md">{children}</div>
      </div>
    </div>
  )
}

export default BaseLayout
