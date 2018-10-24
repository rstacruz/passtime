// @flow

import { h, render, Component, Color } from 'ink'
import type { App } from '../containers/App'
import { SideAlign, RightAlign } from './Align'
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
  const { cycles, settings, now } = root.state

  const len = Math.max(process.stdout.columns - 8, 8)
  const elapsed = root.getCycleElapsed()
  const percent = root.getCyclePercent()
  const indent = Array(indentLength + 1).join(' ')
  const cycleLength = toMs(settings.cycleLength)
  const startTime = root.getStartTime()
  const startTimeLabel = root.formatTime(root.getStartTime())
  const nowLabel = root.formatTime(now)
  const elapsedLabel = toMs(elapsed)

  const finishedCyclesLabel = cycles.length ? (
    <span>
      {cycles.map((cycle: Cycle, idx: number) => {
        return <Color green>{' ·'}</Color>
      })}
    </span>
  ) : (
    ''
  )

  return (
    <div>
      <div />

      <div>
        {indent}
        <Progress value={percent} isNow length={len} />
      </div>

      <div>
        {indent}
        <SideAlign
          width={len}
          left={
            <span>
              <Color green>{elapsedLabel}</Color>
              <Color gray>
                {' / '}
                {cycleLength}
              </Color>
            </span>
          }
          right={
            <span>
              {finishedCyclesLabel}
              {'  '}
              <Color gray>
                {startTimeLabel}
                {' ─ '}
              </Color>
              {nowLabel}
            </span>
          }
        />
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

  // Length must be at least 1
  const leftLength = Math.max(Math.round(value * length), 1)
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
