import {FC, useState, useEffect, useRef} from 'react'
import mermaid from 'mermaid'
import {useTheme} from '@primer/react'

// NOTE: Fast refresh doesn't drigger the `useEffect`. For dev purposes, we
// force it to.
// @refresh reset
// https://nextjs.org/docs/basic-features/fast-refresh#tips

export interface Props {
  id: string
  chart: string
}

const Mermaid: FC<Props> = ({chart, id}) => {
  const [svg, setSvg] = useState('')
  const graphElement = useRef<HTMLDivElement>(null)
  const {colorScheme} = useTheme()

  useEffect(() => {
    //  Match mermaid theme with current dark/light mode
    mermaid.initialize({
      startOnLoad: false,
      theme: colorScheme === 'dark' ? 'dark' : 'default'
    })

    mermaid.mermaidAPI.render(
      id,
      chart,
      (svg: string) => setSvg(svg),
      graphElement.current || undefined
    )
  }, [chart, colorScheme])

  return (
    <div
      className="mermaid"
      ref={graphElement}
      dangerouslySetInnerHTML={{__html: svg}}
    />
  )
}

export default Mermaid
