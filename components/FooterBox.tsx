import {FC} from 'react'
import {Icon} from '@primer/octicons-react'

export const Heading: FC = ({children}) => (
  <h2 className="lh-condensed-ultra">{children}</h2>
)

export const Body: FC = ({children}) => <div className="mt-1">{children}</div>

export interface Props {
  icon?: Icon
}

const FooterBox: FC<Props> = ({children, icon: Icon}) => (
  <div className="Box Box--spacious color-bg-subtle mt-3">
    <div className="Box-body d-flex flex-items-start">
      {Icon && (
        <div className="mr-2">
          <Icon size={16} />
        </div>
      )}
      <div>{children}</div>
    </div>
  </div>
)

export default FooterBox
