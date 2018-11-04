// @flow
/* @jsx h */

import { h, Color } from 'ink'
import { type ThemeData } from '../containers/App'

export type ProgressProps = {
  value: number,
  isDone?: boolean,
  length: number,
  theme: { accent: ThemeData, mute: ThemeData }
}

export const Progress = ({
  value,
  isDone,
  length = 40,
  theme: { accent, mute }
}: ProgressProps) => {
  // Cap value to 0..1
  value = Math.max(Math.min(value, 1), 0)

  if (isDone) {
    return (
      <span>
        <Color {...mute}>{Array(length + 1).join('─')}</Color>
      </span>
    )
  }

  // Length must be at least 1
  const leftLength = Math.round(value * (length - 1))
  const rightLength = length - 1 - leftLength

  return (
    <span>
      <Color {...accent}>{Array(leftLength + 1).join('━')}</Color>
      <Color {...accent}>×</Color>
      <Color {...mute}>{Array(rightLength + 1).join('─')}</Color>
    </span>
  )
}

export default Progress
