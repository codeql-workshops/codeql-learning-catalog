import {FC} from 'react'
import {CalendarIcon} from '@primer/octicons-react'
import {formatInTimeZone} from 'date-fns-tz'
import ActionBar, {Props as ActionBarProps} from '../ActionBar'
import Footer, {Props as FooterProps} from '../Footer'

export type Props = {
  frontMatter: {
    title: string
    author: string
    date_published: string
  }
} & ActionBarProps &
  FooterProps

const NewsLayout: FC<Props> = ({children, frontMatter, filePath}) => {
  return (
    <>
      <ActionBar filePath={filePath} frontMatter={frontMatter} />

      <div className="col-sm-9 mx-auto">
        <h1 className="pb-3">{frontMatter.title}</h1>

        <div className="d-flex flex-items-center mb-5 color-fg-muted">
          {frontMatter.author && (
            <a
              href={`https://github.com/${frontMatter.author}`}
              rel="noopener"
              className="mr-4 color-fg-muted"
            >
              <img
                className="avatar avatar-5 mr-2"
                src={`https://avatars.githubusercontent.com/${frontMatter.author}?s=32`}
              />
              {frontMatter.author}
            </a>
          )}

          {frontMatter.date_published && (
            <>
              <CalendarIcon className="mr-2" size="medium" />
              {formatInTimeZone(
                new Date(frontMatter.date_published),
                'UTC',
                'MMM dd, yyyy'
              )}
              {/* | date: '%B %d, %Y' }} */}
            </>
          )}
        </div>

        {children}

        <Footer frontMatter={frontMatter} />
      </div>
    </>
  )
}

export default NewsLayout
