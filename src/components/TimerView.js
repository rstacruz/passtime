// @flow

import { h, render, Component, Color } from 'ink'
import type { App } from '../containers/App'

export type TimerViewProps = {
  root: App,
  indentLength: number
}

/**
 * Timer
 */

const TimerView = ({ root, indentLength = 2 }: TimerViewProps) => {
  const elapsed = root.getCycleElapsed()
  const percent = root.getCyclePercent()
  const { cycles } = root.state
  const indent = Array(indentLength + 1).join(' ')

  return (
    <div>
      <div />
      {cycles.map((cycle: Cycle) => {
        return (
          <div>
            {indent}
            <Progress value={1} isDone />
            <span> </span>
          </div>
        )
      })}

      <div>
        {indent}
        <Progress value={percent} isNow />
        <span>{'  '}</span>
        <span>{Math.floor(elapsed / 1000)}s</span>
      </div>
    </div>
  )
}

const Progress = ({ value, isDone, isNow, length = 40 }) => {
  // Cap value to 0..1
  value = Math.max(Math.min(value, 1), 0)

  if (isDone) {
    return (
      <span>
        <Color gray>{Array(length + 1).join('─')}</Color>
      </span>
    )
  }

  const leftLength = Math.round(value * length)
  const rightLength = length - leftLength
  const color = isNow ? { green: true } : { gray: true }

  return (
    <span>
      <Color {...color}>{Array(leftLength + 1).join('━')}</Color>
      <Color gray>{Array(rightLength + 1).join('─')}</Color>
    </span>
  )
}

module.exports = { TimerView }
