// @flow
/* @jsx h */

import { h, Component } from 'ink'
import { TimerView } from '../components/TimerView'
import { ding } from '../helpers/ding'
import Select from 'ink-select-input'
import stringToMs from 'ms'
import format from 'date-fns/format'

export type Settings = {
  cycleLength?: ?number,
  fps: number,
  message: ?string
}

export type Cycle = {
  startedAt: Date,
  endedAt?: Date
}

export type ThemeData = {}

export type Theme = {
  accent: ThemeData,
  mute: ThemeData,
  time: ThemeData,
  finishedCycle: string,
  spinner: string[]
}

export type State = {
  settings: Settings,

  theme: Theme,

  // Current cycle
  cycle: Cycle,

  // Cycles that were completed
  cycles: Cycle[],

  now: Date
}

export type Props = {
  cycleLength?: string,
  message?: string
}

/**
 * App
 */

function getFpsFromCycleLength(cycleLength: ?number): number {
  return !cycleLength
    ? 2
    : cycleLength < 10000
      ? 4
      : cycleLength < 40000
        ? 4
        : 2
}

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
          timer: {
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

const TimerForm = ({ root }) => {
  const labels = ['5m', '15m', '30m', '45m']
  const items = labels.map((label: string) => ({ label, value: label }))

  return (
    <div>
      Choose a cycle length:
      <br />
      <Select
        items={items}
        onSelect={({ value }) => {
          root.setCycleLength(value)
        }}
      />
    </div>
  )
}

/*
 * Export
 */

module.exports = { App }
