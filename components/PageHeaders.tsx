import {FC} from 'react'
import markdownToHtml from '../src/util/markdownToHtml'

export interface Props {
  frontMatter: {
    banner?: string
    title: string
    hide_title?: boolean
    description?: string
  }
}

const PageHeaders: FC<Props> = ({frontMatter}) => (
  <>
    {/* TODO: It would be ideal to come up with a standard for banner sizes, so
        we can take advantage of Nextjs' Image component */}
    {frontMatter.banner && frontMatter.banner.startsWith('http') && (
      <img
        src={`${frontMatter.banner}`}
        alt={`${frontMatter.title} banner`}
        className="Box border-0 width-fit mb-3"
      />
    )}

    {frontMatter.banner && !frontMatter.banner.startsWith('http') && (
      <img
        src={`/assets/images/banners/${frontMatter.banner}`}
        alt={`${frontMatter.title} banner`}
        className="Box border-0 width-fit mb-3"
      />
    )}

    {!frontMatter.hide_title && (
      <div className="pb-3">
        <h1 className="lh-condensed-ultra">{frontMatter.title}</h1>
        {frontMatter.description && (
          <p
            className="f3 m-0"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(frontMatter.description)
            }}
          ></p>
        )}
      </div>
    )}
  </>
)

export default PageHeaders
