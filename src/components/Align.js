import { h, renderToString } from 'ink'
import strip from 'strip-ansi'

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
