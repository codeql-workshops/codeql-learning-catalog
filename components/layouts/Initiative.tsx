import {FC} from 'react'
import Page, {Props as PageProps} from './Page'
import InitiativeSidebar, {
  Props as InitiativeSidebarProps
} from '../InitiativeSidebar'

export type Props = PageProps & InitiativeSidebarProps

const Initiative: FC<Props> = ({children, frontMatter, ...rest}) => (
  <Page frontMatter={frontMatter} {...rest}>
    <div className="Layout Layout--sidebarPosition-end Layout--flowRow-until-lg">
      <div className="Layout-sidebar">
        <InitiativeSidebar frontMatter={frontMatter} />
      </div>

      <div className="Layout-main">{children}</div>
    </div>
  </Page>
)

export default Initiative
