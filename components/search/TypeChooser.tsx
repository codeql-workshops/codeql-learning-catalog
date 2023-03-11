import {FC} from 'react'
import Link from 'next/link'
import cx from 'classnames'
import {useRouter} from 'next/router'
import {results} from './Results'

//  TODO: Fetch aggregates from the search API rather than being hardcoded
const labelByKey: {[key: string]: string} = {
  ['']: 'All',
  doc: 'Docs',
  news: 'News'
}

export interface Props {
  aggregates: results['aggregates']
}

const TypeChooser: FC<Props> = ({aggregates}) => {
  const router = useRouter()
  const selectedType = router.query.type

  //  Filter aggregates by RESULT_TYPES and sum the count of filtered aggregates
  const totalCount = aggregates
    .filter(aggregate => labelByKey[aggregate.key] !== undefined)
    .reduce((acc, aggregate) => acc + aggregate.count, 0)

  return (
    <nav className="menu">
      {Object.entries(labelByKey).map(([key, label]) => {
        let aggregate = aggregates.find(aggregate => aggregate.key === key) || {
          key,
          count: 0
        }
        if (label === 'All') aggregate = {key: '', count: totalCount}

        return (
          <TypeChooserItem
            key={key}
            aggregate={aggregate}
            active={(selectedType || '') === key}
          />
        )
      })}
    </nav>
  )
}

interface TypeChooserItemProps {
  aggregate: {
    key: string
    count: number
  }
  active: boolean
}

const TypeChooserItem: FC<TypeChooserItemProps> = ({
  aggregate,
  active,
  ...props
}) => {
  const {asPath} = useRouter()
  const [asPathRoot, asPathQuery = ''] = asPath.split('?')
  const params = new URLSearchParams(asPathQuery)
  if (aggregate.key) {
    params.set('type', aggregate.key)
  } else {
    params.delete('type')
  }
  const href = `${asPathRoot}?${params.toString()}`
  return (
    <Link href={href}>
      <a
        className="menu-item"
        aria-current={active ? 'page' : 'false'}
        {...props}
      >
        {labelByKey[aggregate.key]}
        <span
          className={cx('Counter', {
            'Counter--primary': aggregate.count && aggregate.count > 0
          })}
        >
          {aggregate.count.toLocaleString()}
        </span>
      </a>
    </Link>
  )
}

export default TypeChooser
