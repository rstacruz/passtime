/* eslint-env jest */

import stringToMs from '../string_to_ms'

const ASSERTIONS = [
  ['1m', 60000],
  ['10m', 600000],
  ['20s', 20000],
  ['10', 600000]
]

ASSERTIONS.forEach(([input, output]) => {
  it(`${input} -> ${output}`, () => {
    expect(stringToMs(input)).toEqual(output)
  })
})
