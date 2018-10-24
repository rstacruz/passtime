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
  const { cycles, settings, now, theme } = root.state
  const { message } = settings
  const { accent, mute } = theme

  const len = Math.max(process.stdout.columns - 2 - indentLength * 2, 8)
  const elapsed = root.getCycleElapsed()
  const percent = root.getCyclePercent()
  const indent = Array(indentLength + 1).join(' ')
  const cycleLength = toMs(settings.cycleLength)
  const startTime = root.getStartTime()
  const startTimeLabel = root.formatTime(root.getStartTime())
  const nowLabel = root.formatTime(now)
  const elapsedLabel = toMs(elapsed) || "Let's go!"

  const finishedCyclesLabel = cycles.length ? (
    <span>
      {cycles.map((cycle: Cycle, idx: number) => {
        return <Color {...accent}>{'✓ '}</Color>
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
              <Color {...accent}>{settings.message} </Color>
              <Color {...mute}>in {cycleLength} intervals</Color>
            </>
          ) : (
            <Color {...accent}>{cycleLength} intervals</Color>
          )
        }
        right={
          <>
            <Color {...accent}>{elapsedLabel}</Color>
          </>
        }
      />

      <br />

      {indent}
      <Progress value={percent} isNow length={len} theme={theme} />

      <br />
      {indent}
      <SideAlign
        width={len}
        left={
          <>
            {finishedCyclesLabel}
            <Color {...mute}>
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

const Progress = ({
  value,
  isDone,
  isNow,
  length = 40,
  theme: { accent, mute }
}) => {
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
  const leftLength = Math.max(Math.round(value * length), 1)
  const rightLength = length - leftLength

  return (
    <span>
      <Color {...accent}>{Array(leftLength + 1).join('━')}</Color>
      <Color {...mute}>{Array(rightLength + 1).join('─')}</Color>
    </span>
  )
}

module.exports = { TimerView }
