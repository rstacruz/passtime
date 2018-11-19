import stringToMs from '../string_to_ms'

const ASSERTIONS = [['1m', 60000]]

ASSERTIONS.forEach(([input, output]) => {
  it(`${input} -> ${output}`, () => {
    expect(stringToMs(input)).toEqual(output)
  })
})
