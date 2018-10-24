// @flow

import { h, render, Component, Color } from 'ink'
import { TimerView } from '../components/TimerView'
import { ding } from '../helpers/ding'
import stringToMs from 'ms'
import format from 'date-fns/format'

export type Settings = {
  cycleLength: number,
  fps: number
}

export type Cycle = {
  startedAt: Date,
  endedAt?: Date
}

export type State = {
  settings: Settings,

  // Current cycle
  cycle: Cycle,

  // Cycles that were completed
  cycles: Cycle[],

  now: Date
}

export type Props = {
  cycleLength?: string
}

/**
 * App
 */

class App extends Component {
  constructor(props) {
    super(props)

    const cycleLength = stringToMs(props.cycleLength || '20m')

    this.state = {
      settings: {
        cycleLength: cycleLength,
        fps: 3
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

  /** Formats a Date object into a string */
  formatTime = (timestamp: Date | string, formatName: string): string => {
    if (typeof timestamp === 'string') timestamp = Date.parse(timestamp)
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
    // See if we have 1 or more passed cycles
    const passedCycles = Math.floor(this.getCyclePercent())
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
  getCyclePercent = (): number => {
    const elapsed = this.getCycleElapsed()
    const { cycleLength } = this.state.settings
    return elapsed / cycleLength
  }

  render() {
    return <TimerView root={this} />
  }

  componentDidMount() {
    this.tick()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }
}
/*
 * Export
 */

module.exports = { App }
