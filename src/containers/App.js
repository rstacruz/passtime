// @flow
/* @jsx h */

import { h, Component } from 'ink'
import Select from 'ink-select-input'
import format from 'date-fns/format'
import stringToMs from 'ms'

import type { Cycle, State, Props } from '../types'
import { TimerForm } from '../components/TimerForm'
import { TimerView } from '../components/TimerView'
import { ding } from '../helpers/ding'

/**
 * App
 */

class App extends Component {
  state: State

  constructor(props: Props) {
    super(props)

    const cycleLength = props.cycleLength ? stringToMs(props.cycleLength) : null

    this.state = {
      theme: {
        accent: { green: true },
        time: { bold: true },
        mute: { gray: true, dim: true },
        finishedCycle: '▪',
        spinner: require('cli-spinners').dots5.frames
      },
      settings: {
        cycleLength: cycleLength,
        fps: getFpsFromCycleLength(cycleLength),
        message: props.message
      },
      cycle: {
        startedAt: new Date()
      },
      cycles: [],
      now: new Date()
    }
  }

  /** Returns the absolute start time */
  getStartTime = (): Date => {
    const { cycles } = this.state
    const cycle = cycles[0] || this.state.cycle
    return cycle.startedAt
  }

  /** The full length since the beginning */
  getFullLength = (): number => {
    const start = this.getStartTime()
    const now = this.state.now
    return +now - +start
  }

  /** Formats a Date object into a string */
  formatTime = (timestamp: Date | string): string => {
    if (typeof timestamp === 'string')
      timestamp = new Date(Date.parse(timestamp))
    const fmt = 'h:mm a'
    return format(timestamp, fmt)
  }

  tick = (): void => {
    this.flush()
    this.setState({ now: new Date() })
    this.timer = setTimeout(this.tick, this.getTimerInterval())
  }

  /** Return how long a tick should be. */
  getTimerInterval = () => {
    const { settings } = this.state
    const fps = Math.min(settings.fps || 60, 60)
    return 1000 / fps
  }

  flush = () => {
    // Nothing to do if we haven't strated yet
    const percent = this.getCyclePercent()
    if (percent == null) return

    // See if we have 1 or more passed cycles
    const passedCycles = Math.floor(percent)
    if (passedCycles === 0) return

    // Construct the extra cycles
    const { now, cycle: currentCycle } = this.state
    const extraCycles = [...Array(passedCycles).keys()].map(
      (): Cycle => {
        return {
          startedAt: currentCycle.startedAt,
          endedAt: now
        }
      }
    )

    // And push it there
    this.setState({
      cycles: [...this.state.cycles, ...extraCycles],
      cycle: {
        startedAt: this.state.now
      }
    })

    // Broadcast a notification
    this.sendNotification()
  }

  /** Sends a notification */
  sendNotification = () => {
    const { cycles } = this.state
    const count = cycles.length + 1
    ding({ count })
  }

  /* Gets elapsed time in the current cycle in milliseconds */
  getCycleElapsed = (): number => {
    const { now, cycle } = this.state
    return +now - +cycle.startedAt
  }

  /** Gets the percentage (0...1) */
  getCyclePercent = (): ?number => {
    const elapsed = this.getCycleElapsed()
    if (elapsed == null) return

    // Don't return anything if there's no cycle length
    const { cycleLength } = this.state.settings
    if (cycleLength == null) return

    return elapsed / cycleLength
  }

  /**
   * Updates cycle length.
   *
   * @example
   *     root.setCycleLength('15m')
   */

  setCycleLength = (len: string): void => {
    const cycleLength = stringToMs(len)
    const now = new Date()

    this.setState(
      (state: State): State => {
        const { settings } = state
        return {
          ...state,
          settings: {
            ...settings,
            cycleLength
          },
          cycles: [],
          cycle: {
            startedAt: now
          },
          now
        }
      }
    )
  }

  render() {
    const { settings } = this.state

    if (settings.cycleLength == null) {
      return <TimerForm root={this} />
    } else {
      return <TimerView root={this} />
    }
  }

  componentDidMount() {
    this.tick()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }
}

/**
 * Helper: get FPS from cycle
 */

function getFpsFromCycleLength(cycleLength: ?number): number {
  if (cycleLength && cycleLength < 10000) return 4
  return 2
}

/*
 * Export
 */

module.exports = { App }
