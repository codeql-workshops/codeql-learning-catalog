import {FC} from 'react'
import {useRouter} from 'next/router'
import {ArrowRightIcon} from '@primer/octicons-react'
import ActionBar, {Props as ActionBarProps} from '../ActionBar'
import PageHeaders, {Props as PageHeadersProps} from '../PageHeaders'
import Footer, {Props as FooterProps} from '../Footer'
import SectionTOC, {Props as SectionTOCProps} from '../SectionTOC'
import {LockIcon, MegaphoneIcon} from '@primer/octicons-react'
import ClassBox, {CourseTitle, Abstract} from '../ClassBox'
import {
  availableLanguagesForCourse,
  getFirstLexicographicalChildOfPath
} from '../../src/util/docs'
import {allDocsFlat} from '../../src/util/docs'
import WorkshopMetadataActionBar from '../WorkshopMetadataActionBar'

// logos

const HelperBox: FC = ({children}) => (
  <div className="mt-n2 mb-4 pb-3 border-bottom">{children}</div>
)

export type Props = PageHeadersProps &
  FooterProps &
  SectionTOCProps &
  ActionBarProps

const WorkshopOverviewLayout: FC<Props> = ({
  children,
  frontMatter,
  filePath
}) => {
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

      <br />
      <br />
      <h2>Workshop Availability</h2>
      <hr />

      {availableLanguagesForCourse(router.asPath).map((c, idx) => {
        const firstChild = getFirstLexicographicalChildOfPath(c.path)

        return (
          <ClassBox icon={c.frontmatter['language']} key={idx}>
            <CourseTitle>
              {c.frontmatter['course_number']} - {c.frontmatter['title']}
            </CourseTitle>
            <Abstract>{c.frontmatter['abstract']}</Abstract>
            <WorkshopMetadataActionBar
              workshopPath={firstChild.path}
              language={c.frontmatter['language']}
              feedback={c.frontmatter['feedback']}
              deck={c.frontmatter['deck']}
              recording={c.frontmatter['recording']}
            ></WorkshopMetadataActionBar>
          </ClassBox>
        )
      })}

      <Footer frontMatter={frontMatter} />
    </>
  )
}
export default WorkshopOverviewLayout
