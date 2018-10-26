// @flow

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
