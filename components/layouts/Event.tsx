import {FC} from 'react'
import Octicon, {IconName} from '../Octicon'
import {LinkIcon} from '@primer/octicons-react'
import Page, {Props as PageProps} from './Page'

export type Props = PageProps & {
  frontMatter: {
    shortcuts: [
      {
        label: string
        icon: IconName
        url: string
      }
    ]
    quick_links: [
      {
        label: string
        url: string
      }
    ]
  }
}

const PageLayout: FC<Props> = ({children, frontMatter, ...rest}) => (
  <Page frontMatter={{...frontMatter, hide_title: true}} {...rest}>
    <div className="d-md-flex gutter-spacious mb-4 f4">
      <div className="col-md-7">
        <h2 className="h1">{frontMatter.title}</h2>
        <hr className="mt-2 mb-4" />

        <ul className="list-style-none d-flex pl-0">
          {frontMatter.shortcuts.map(shortcut => (
            <li className="flex-1 text-center px-2" key={shortcut.label}>
              <a href={shortcut.url} className="d-block">
                <Octicon name={shortcut.icon} height={48} />
                <br />
                {shortcut.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-md-5">
        <h2 className="h1">Quick Links</h2>
        <hr className="mt-2 mb-4" />
        <ul className="list-style-none pl-0">
          {frontMatter.quick_links.map(quickLink => (
            <li
              className="d-flex align-items-start mb-2 lh-condensed"
              key={quickLink.label}
            >
              <div className="mr-2">
                <LinkIcon />
              </div>
              <div>
                <a className="fw-500" href={quickLink.url}>
                  {quickLink.label}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {children}
  </Page>
)

export default PageLayout
