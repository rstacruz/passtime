// @flow

import { h, render, Component, Color } from 'ink'
import type { App } from '../containers/App'
import prettyMs from 'pretty-ms'

export type TimerViewProps = {
  root: App,
  indentLength: number
}

/** Converts to string */
const toMs = (elapsed: number): string =>
  prettyMs(elapsed, { secDecimalDigits: 0 })

/**
 * Timer
 */

const TimerView = ({ root, indentLength = 2 }: TimerViewProps) => {
  const elapsed = root.getCycleElapsed()
  const percent = root.getCyclePercent()
  const { cycles, settings } = root.state
  const indent = Array(indentLength + 1).join(' ')
  const cycleLength = toMs(settings.cycleLength)
  const startTime = root.getStartTime()
  const startTimeLabel = root.formatTime(root.getStartTime())

  return (
    <div>
      <div />

      <div>
        <Color red>{'→  '}</Color>
        <Color bold>{startTimeLabel}</Color>
      </div>

      <div>
        {indent}
        <Color bold>{cycleLength}</Color> intervals, let's go!
      </div>

      <div />

      {cycles.map((cycle: Cycle) => {
        return (
          <div>
            {indent}
            <Progress value={1} isDone />
            {'  '}
            <Color gray>{root.formatTime(cycle.endedAt)}</Color>
          </div>
        )
      })}

      <div>
        {indent}
        <Progress value={percent} isNow />
        <span>{'  '}</span>
        <span>{toMs(elapsed)}</span>
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
