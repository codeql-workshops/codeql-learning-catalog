import {FC} from 'react'
import reactStringReplace from 'react-string-replace'

export interface Props {
  input: string
}

export const handleMatcher = new RegExp(/@(\w+)/gi)

const HandleLinker: FC<Props> = ({input}) => (
  <>
    {reactStringReplace(input, handleMatcher, (match, i) => (
      <a href={`https://github.com/${match}`} key={match + i}>
        @{match}
      </a>
    ))}
  </>
)

export default HandleLinker
