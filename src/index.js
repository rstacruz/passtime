#!/usr/bin/env node
import { App } from './containers/App'
import { h, render } from 'ink'
import Meow from 'meow'

function cli() {
  return Meow(
    `
    Usage: 
      $ ${process.argv[1]} [options...] [<cycle length>]

    Options:
      -h, --help        show usage information
      -v, --version     print version info and exit
  `,
    {
      flags: {
        help: { type: 'boolean', alias: 'h' },
        version: { type: 'boolean', alias: 'v' },
        force: { type: 'boolean', alias: 'f' }
      }
    }
  )
}

function run() {
  const { flags, input } = cli()
  render(<App cycleLength={input[0]} />)
}

// module.exports = run()
run()
