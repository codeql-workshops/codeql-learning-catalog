import {FC} from 'react'
import {Icon} from '@primer/octicons-react'
import Image from 'next/image'
import IconJavascript from 'programming-languages-logos/src/javascript/javascript.png'
import IconRuby from 'programming-languages-logos/src/ruby/ruby.png'
import IconPython from 'programming-languages-logos/src/python/python.png'
import IconCpp from 'programming-languages-logos/src/cpp/cpp.png'
import IconGo from 'programming-languages-logos/src/go/go.png'
import IconCsharp from 'programming-languages-logos/src/csharp/csharp.png'
import IconJava from 'programming-languages-logos/src/java/java.png'

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
        <Image src={IconJavascript} width={size} height={size} />
      </>
    )
  }

  if (language === 'ruby') {
    return (
      <>
        <Image src={IconRuby} width={size} height={size} />
      </>
    )
  }

  if (language === 'python') {
    return (
      <>
        <Image src={IconPython} width={size} height={size} />
      </>
    )
  }

  if (language === 'cpp') {
    return (
      <>
        <Image src={IconCpp} width={size} height={size} />
      </>
    )
  }

  if (language === 'csharp') {
    return (
      <>
        <Image src={IconCsharp} width={size} height={size} />
      </>
    )
  }

  if (language === 'java') {
    return (
      <>
        <Image src={IconJava} width={size} height={size} />
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
