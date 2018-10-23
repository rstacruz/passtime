// @flow

const { h, render, Component, Color } = require('ink')

export type Cycle = {
  startedAt: Date,
  endedAt?: Date
}

export type State = {
  settings: {
    cycleLength: number
  },

  // Current cycle
  cycle: Cycle,

  // Cycles that were completed
  cycles: Cycle[],

  now: Date
}

/**
 * App
 */

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      settings: {
        cycleLength: 3000
      },
      cycle: {
        startedAt: new Date()
      },
      cycles: [],
      now: new Date()
    }
  }

  tick = () => {
    this.flush()
    this.setState({ now: new Date() })
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
      cycles: [...this.state.cycles, extraCycles],
      cycle: {
        startedAt: this.state.now
      }
    })
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
    this.timer = setInterval(() => {
      this.tick()
    }, 30)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }
}

/**
 * Timer
 */

const TimerView = ({ root }) => {
  const delta = root.getCycleElapsed()
  const percent = root.getCyclePercent()
  const { cycles } = root.state

  return (
    <div>
      {cycles.map((cycle: Cycle) => {
        return (
          <div>
            <span>{' ✓ '}</span>
            <Progress value={1} isDone />
          </div>
        )
      })}

      <div>
        <span>{' > '}</span>
        <Progress value={percent} isNow />
      </div>
    </div>
  )
}

const Progress = ({ value, isDone, isNow }) => {
  const length = 40
  const leftLength = Math.round(value * length)
  const rightLength = length - leftLength

  return '' + Array(leftLength + 1).join('|') + Array(rightLength + 1).join('-')
}

/*
 * Export
 */

module.exports = { App }
