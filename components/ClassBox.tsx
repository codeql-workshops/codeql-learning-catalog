import {FC} from 'react'
import {Icon} from '@primer/octicons-react'
import Image from 'next/image'
export const CourseTitle: FC = ({children}) => (
  <h2 className="lh-condensed-ultra">{children}</h2>
)

export const Abstract: FC = ({children}) => (
  <div className="mt-1">{children}</div>
)

export interface Props {
  icon: string
}

function iconForLanguage(language: string, size: number = 100): any {
  if (language === 'javascript') {
    return (
      <>
        <img
          src="/assets/images/languages/javascript.png"
          width={size}
          height={size}
        />
      </>
    )
  }

  if (language === 'ruby') {
    return (
      <>
        <img
          src="/assets/images/languages/ruby.png"
          width={size}
          height={size}
        />
      </>
    )
  }

  if (language === 'python') {
    return (
      <>
        <img
          src="/assets/images/languages/python.png"
          width={size}
          height={size}
        />
      </>
    )
  }

  if (language === 'cpp') {
    return (
      <>
        <img
          src="/assets/images/languages/cpp.png"
          width={size}
          height={size}
        />
      </>
    )
  }

  if (language === 'csharp') {
    return (
      <>
        <img
          src="/assets/images/languages/csharp.png"
          width={size}
          height={size}
        />
      </>
    )
  }

  if (language === 'java') {
    return (
      <>
        <img
          src="/assets/images/languages/java.png"
          width={size}
          height={size}
        />
      </>
    )
  }
}

const ClassBox: FC<Props> = ({children, icon: s}) => (
  <div className="Box Box--spacious color-bg-subtle mt-3">
    <div className="Box-body d-flex flex-items-start">
      {<div className="mr-2">{iconForLanguage(s)}</div>}
      <div>{children}</div>
    </div>
  </div>
)

export default ClassBox
