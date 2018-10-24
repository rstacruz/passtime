import { h, renderToString, Component } from 'ink'
import strip from 'strip-ansi'
import Ansi from 'ansi-escapes'

export const SideAlign = ({ width, right, left }) => {
  if (!width) width = process.stdout.columns

  const leftStr = renderToString(left || '')
  const rightStr = renderToString(right || '')
  const spaces = Math.max(
    width - strip(leftStr).length - strip(rightStr).length,
    1
  )

  return (
    <span>
      {leftStr}
      {Array(spaces + 1).join(' ')}
      {rightStr}
    </span>
  )
}

export const LeftAlign = ({ width, children }) => {
  return <SideAlign width={width} left={<span>{children}</span>} />
}

export const RightAlign = ({ width, children }) => {
  return <SideAlign width={width} right={<span>{children}</span>} />
}

/**
 * Aligns stuff in the vertical-middle of the screen
 */

export class MiddleAlign extends Component {
  constructor(props) {
    super(props)
    process.stdout.write(Ansi.clearScreen)
  }

  render() {
    const { children, height } = this.props
    const str = renderToString(<span>{children}</span>)
    const lines = str.split('\n').length
    const padding = Math.floor(((height || process.stdout.rows) - lines) / 2)
    return (
      <span>
        {Array(padding + 1).join('\n')}
        {str}
      </span>
    )
  }
}
