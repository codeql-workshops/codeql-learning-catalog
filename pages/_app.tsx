import {ReactNode, FC, useEffect} from 'react'
import type {AppProps} from 'next/app'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {ThemeProvider, BaseStyles} from '@primer/react'
import BaseLayout from '../components/layouts/Base'
import ThemeSwitcher from '../components/ThemeSwitcher'
import * as gtag from '../src/util/analytics'
import '../sass/index.scss'

// TODO: This type is manually maintained. It could likely be imported/derived
// from the various layouts. Rather than having to keep this list in sync with
// the different layout being dynamically imported below, I wonder if there is
// some TypeScript foo/magic that can apply these types dynamically as well.
interface LayoutProps {
  children: ReactNode
  frontMatter: any
  filePath: string
}

const getDocLayout = (layout: string): FC<LayoutProps> => {
  const router = useRouter()
  //  Track analytics on nav changes
  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])

  switch (layout) {
    case 'page':
      return ({children, ...rest}) => {
        const PageLayout = dynamic(() => import('../components/layouts/Page'))
        return <PageLayout {...rest}>{children}</PageLayout>
      }

    case 'workshop-overview':
      return ({children, ...rest}) => {
        const WorkshopOverviewLayout = dynamic(
          () => import('../components/layouts/WorkshopOverview')
        )
        return (
          <WorkshopOverviewLayout {...rest}>{children}</WorkshopOverviewLayout>
        )
      }

    case 'workshop-index':
      return ({children, ...rest}) => {
        const WorkshopIndexLayout = dynamic(
          () => import('../components/layouts/WorkshopIndex')
        )
        return <WorkshopIndexLayout {...rest}>{children}</WorkshopIndexLayout>
      }

    case 'event':
      return ({children, ...rest}) => {
        const PageLayout = dynamic(() => import('../components/layouts/Event'))
        return <PageLayout {...rest}>{children}</PageLayout>
      }
    case 'initiative':
      return ({children, ...rest}) => {
        const PageLayout = dynamic(
          () => import('../components/layouts/Initiative')
        )
        return <PageLayout {...rest}>{children}</PageLayout>
      }
    case 'news':
      return ({children, ...rest}) => {
        const PageLayout = dynamic(() => import('../components/layouts/News'))
        return <PageLayout {...rest}>{children}</PageLayout>
      }
    case 'org-chart':
      return ({children, ...rest}) => {
        const PageLayout = dynamic(
          () => import('../components/layouts/OrgChart')
        )
        return <PageLayout {...rest}>{children}</PageLayout>
      }
    default:
      return ({children}) => <>{children}</>
  }
}

function App({Component, pageProps}: AppProps) {
  const {frontMatter = {}, filePath} = pageProps
  const {layout, title} = frontMatter

  const DocLayout = getDocLayout(layout)

  return (
    <>
      <Head>
        <link rel="icon" href="/thehub-16.png" sizes="16x16" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title && `${title} |`} CodeQL Learning Catalog</title>
      </Head>
      <ThemeProvider>
        <BaseStyles>
          <BaseLayout>
            <ThemeSwitcher />
            <DocLayout frontMatter={pageProps.frontMatter} filePath={filePath}>
              <Component {...pageProps} />
            </DocLayout>
          </BaseLayout>
        </BaseStyles>
      </ThemeProvider>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

export default App
