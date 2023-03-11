import {FC} from 'react'
import Link from 'next/link'
import cx from 'classnames'
import {SideNavGroup, Icon} from './SidebarNav.style'
import {IconName} from './Octicon'
import SubNav from './SubNav'

export interface Props {
  href: string
  icon: IconName
  title: string
  children?: any
  active?: boolean
}

const ActiveLink: FC<Props> = ({href, icon, title, children, active}) => {
  return (
    <SideNavGroup
      className={cx('d-block', {
        active: active
      })}
    >
      <Link href={href}>
        <a
          className={cx('no-underline d-flex py-1', {
            'active text-bold': active
          })}
        >
          <Icon name={icon} height={24} />
          {title}
        </a>
      </Link>
      {active && children && <SubNav links={children} />}
    </SideNavGroup>
  )
}

export default ActiveLink
