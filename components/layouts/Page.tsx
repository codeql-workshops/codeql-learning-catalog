import {FC} from 'react'
import {useRouter} from 'next/router'
import {ArrowRightIcon} from '@primer/octicons-react'
import ActionBar, {Props as ActionBarProps} from '../ActionBar'
import PageHeaders, {Props as PageHeadersProps} from '../PageHeaders'
import Footer, {Props as FooterProps} from '../Footer'
import SectionTOC, {Props as SectionTOCProps} from '../SectionTOC'

const HelperBox: FC = ({children}) => (
  <div className="mt-n2 mb-4 pb-3 border-bottom">{children}</div>
)

export type Props = PageHeadersProps &
  FooterProps &
  SectionTOCProps &
  ActionBarProps

const PageLayout: FC<Props> = ({children, frontMatter, filePath}) => {
  const router = useRouter()

  return (
    <>
      <ActionBar filePath={filePath} frontMatter={frontMatter} />

      {router.asPath.includes('/hr/') && (
        <HelperBox>
          Need help with HR?{' '}
          <a
            href="https://github-hr.zendesk.com/hc/en-us/requests/new"
            target="_blank"
            rel="noopener"
          >
            Open an HR Helpdesk ticket
            <ArrowRightIcon />
          </a>
        </HelperBox>
      )}

      {router.asPath.includes('/it/') && (
        <HelperBox>
          Need help with IT?{' '}
          <a
            href="https://github-it.zendesk.com/hc/en-us/requests/new"
            target="_blank"
            rel="noopener"
          >
            Open an IT Helpdesk ticket
            <ArrowRightIcon />
          </a>
        </HelperBox>
      )}

      <PageHeaders frontMatter={frontMatter} />

      {children}

      <SectionTOC frontMatter={frontMatter} />

      <Footer frontMatter={frontMatter} />
    </>
  )
}

export default PageLayout
