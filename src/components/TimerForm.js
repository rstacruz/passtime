// @flow
/* @jsx h */

import { h } from 'ink'
import Select from 'ink-select-input'
import type { App } from '../containers/App'

export const TimerForm = ({ root }: App) => {
  const labels = ['15m', '20m', '30m']
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
