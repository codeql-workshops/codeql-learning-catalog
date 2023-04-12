import {useState} from 'react'
import Link from 'next/link'
import {IconName} from '@primer/octicons'
import {ThreeBarsIcon, SearchIcon} from '@primer/octicons-react'
import {docsBySlug, Doc} from '../src/util/docs'
import cx from 'classnames'
import {Sidebar, Icon, MainNav} from './SidebarNav.style'
import SlackIcon from '../docs/_includes/slack-24.svg'
import NavSearchBox from './search/NavSearchBox'
import {FC} from 'react'
import {useRouter} from 'next/router'
import ActiveLink from './ActiveLink'
import {topLevelNav, lowerLevelNav} from '../codeql-learning-catalog.config.js'

let navTree = topLevelNav
  .map(nav => docsBySlug.get(JSON.stringify([nav])))
  .filter((doc): doc is Doc => !!doc)

interface Props {
  className?: string
}

const SidebarNav: FC<Props> = ({className, ...props}) => {
  const router = useRouter()
  const [showNav, setShowNav] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const onMenuToggle = () => {
    setShowNav(!showNav)
  }

  const onSearchToggle = () => {
    setShowSearch(!showSearch)
  }

  return (
    <Sidebar
      className={cx('color-bg-subtle border-sm-right mr-1', className)}
      {...props}
    >
      <div className="d-flex flex-items-center flex-justify-between py-3 px-4">
        <Link href="/">
          <a className="no-underline d-block py-1 color-fg-default">
            <Icon name={'mark-github'} height={32} className={'main'} />
            <span className="f2 v-align-middle">CodeQL Learning Catalog</span>
          </a>
        </Link>
        <div className="hide-md hide-lg hide-xl">
          <button
            className="btn-octicon"
            type="button"
            aria-label="Search icon"
            onClick={onSearchToggle}
          >
            <SearchIcon size={24} verticalAlign="middle" />
          </button>
          <button
            className="btn-octicon"
            type="button"
            aria-label="Search icon"
            onClick={onMenuToggle}
          >
            <ThreeBarsIcon size={24} verticalAlign="middle" />
          </button>
        </div>
      </div>
      <NavSearchBox isMobileVisible={showSearch} />
      <MainNav
        className={cx('px-4', {'hide-sm': !showNav})}
        role="navigation"
        aria-label="Main navigation"
      >
        {navTree.map((f, idx) => (
          <ActiveLink
            href={f.path + '/' || '#link'}
            key={idx}
            icon={f.frontmatter.octicon}
            title={f.frontmatter.title}
            children={f.children}
            active={!!f.path && router.asPath.startsWith(`${f.path}/`)}
          />
        ))}
        <hr />
        <b>Links</b>
        {lowerLevelNav.map((f, idx) => (
          <ActiveLink
            href={f.url + '/' || '#link'}
            key={idx}
            // TODO: Figure out why the type definition for codeql-learning-catalog.config.js isn't working
            icon={f.icon as IconName}
            title={f.text}
            active={router.asPath.startsWith(f.url)}
          />
        ))}
        <hr />
        <b>CodeQL Learning Catalog</b>
        <Link href="https://github.com/codeql-workshops/codeql-learning-catalog">
          <a className="Link--primary no-underline d-block py-1">
            <Icon name={'mark-github'} height={24} />
            <span>github/codeql-learning-catalog</span>
          </a>
        </Link>
      </MainNav>
    </Sidebar>
  )
}

export default SidebarNav
