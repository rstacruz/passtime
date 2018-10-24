// @flow

import { h, render, Component, Color } from 'ink'
import type { App } from '../containers/App'
import { SideAlign, RightAlign, MiddleAlign } from './Align'
import prettyMs from 'pretty-ms'

export type TimerViewProps = {
  root: App,
  indentLength: number
}

/** Converts to string */
const toMs = (elapsed: number): string => {
  if (elapsed < 1000) return
  return prettyMs(elapsed, { secDecimalDigits: 0 })
}

const toMins = (elapsed: number): string => {
  if (elapsed >= 60000) {
    return prettyMs(elapsed, { secDecimalDigits: 0, compact: true }).replace(
      '~',
      ''
    )
  }
}

/**
 * Timer
 */

const TimerView = ({ root, indentLength = 2 }: TimerViewProps) => {
  const { cycles, settings, now } = root.state

  const len = Math.max(process.stdout.columns - 2 - indentLength * 2, 8)
  const elapsed = root.getCycleElapsed()
  const percent = root.getCyclePercent()
  const indent = Array(indentLength + 1).join(' ')
  const cycleLength = toMs(settings.cycleLength)
  const startTime = root.getStartTime()
  const startTimeLabel = root.formatTime(root.getStartTime())
  const nowLabel = root.formatTime(now)
  const elapsedLabel = toMs(elapsed) || "Let's go!"
  const { message } = settings

  const finishedCyclesLabel = cycles.length ? (
    <span>
      {cycles.map((cycle: Cycle, idx: number) => {
        return <Color green>{'✓ '}</Color>
      })}
    </span>
  ) : (
    ''
  )

  const lengthLabel = toMins(root.getFullLength())

  return (
    <MiddleAlign>
      <br />

      {indent}
      <SideAlign
        width={len}
        left={
          message && message.length ? (
            <>
              <Color green>{settings.message} </Color>
              <Color gray>in {cycleLength} intervals</Color>
            </>
          ) : (
            <>{cycleLength} intervals</>
          )
        }
        right={
          <>
            <Color green>{elapsedLabel}</Color>
          </>
        }
      />

      <br />

      {indent}
      <Progress value={percent} isNow length={len} />

      <br />
      {indent}
      <SideAlign
        width={len}
        left={
          <>
            {finishedCyclesLabel}
            <Color gray>
              {lengthLabel ? (
                <>
                  {lengthLabel} since {startTimeLabel}
                </>
              ) : (
                <>Since {startTimeLabel}</>
              )}
            </Color>
          </>
        }
        right={<span>{nowLabel}</span>}
      />
    </MiddleAlign>
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
