import {FC} from 'react'
import octicons, {IconName} from '@primer/octicons'

export type {IconName} from '@primer/octicons'

export interface Props {
  name: IconName
  height: number
  className?: string
  ariaLabel?: string
}

// Octicons are set to `aria-hidden` by default beacuse they are likely to be decorative.
// Only in the rare case the icon is non-decorative, set `ariaLabel` to an appropriate name.
const Octicon: FC<Props> = ({name, className, height = 24, ariaLabel}) => (
  <span
    className={className}
    dangerouslySetInnerHTML={{
      __html: octicons[name].toSVG({
        height,
        'aria-label': ariaLabel
      })
    }}
  />
)

export default Octicon
