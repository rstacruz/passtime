// @flow
/* @jsx h */

import { h, Color } from 'ink'
import type { App, Cycle } from '../containers/App'
import { SideAlign, MiddleAlign } from './Align'
import { Blink } from './Blink'
import { Progress } from './Progress'
import prettyMs from 'pretty-ms'

export type TimerViewProps = {
  root: App,
  indentLength: number
  //Progress
}

/** Converts to string */
const toMs = (elapsed: number): ?string => {
  if (elapsed < 1000) return
  return prettyMs(elapsed, { secDecimalDigits: 0 })
}

const toMins = (elapsed: number): ?string => {
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

  const len = Math.max(getColumns() - 2 - indentLength * 2, 8)
  const elapsed = root.getCycleElapsed()
  const percent = root.getCyclePercent()
  const indent = Array(indentLength + 1).join(' ')
  const cycleLength = toMs(settings.cycleLength)
  const startTimeLabel = root.formatTime(root.getStartTime())
  const nowLabel = root.formatTime(now).toUpperCase()
  const elapsedLabel = toMs(elapsed) || "Let's go!"

  const finishedCyclesLabel = cycles.length ? (
    <span>
      {cycles.map((cycle: Cycle, idx: number) => {
        return (
          <Color key={idx} {...accent}>
            {theme.finishedCycle}{' '}
          </Color>
        )
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
            <span>
              <Color {...accent}>{settings.message} </Color>
              <Color {...mute}>in {cycleLength} intervals</Color>
            </span>
          ) : (
            <Color {...accent}>{cycleLength} intervals</Color>
          )
        }
        right={
          <span>
            <Color {...accent}>{elapsedLabel}</Color>
          </span>
        }
      />

      <br />

      {indent}
      <Progress value={percent} length={len} theme={theme} />

      <br />
      {indent}
      <SideAlign
        width={len}
        left={
          <span>
            {finishedCyclesLabel}
            {/*<Spinner {...accent} type="flip" />*/}
            <Blink frames={theme.spinner} />
            {'  '}
            <Color {...mute}>
              {lengthLabel ? (
                <span>
                  {lengthLabel} since {startTimeLabel}
                </span>
              ) : (
                <span>since {startTimeLabel}</span>
              )}
            </Color>
          </span>
        }
        right={<Color {...theme.time}>{nowLabel}</Color>}
      />
    </MiddleAlign>
  )
}

const getColumns = (): number => {
  // $FlowFixMe$
  return process.stdout.columns
}

module.exports = { TimerView }
