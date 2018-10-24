#!/usr/bin/env node
import { App } from './containers/App'
import { h, render } from 'ink'
import Meow from 'meow'
import Ansi from 'ansi-escapes'

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
  process.stdout.write(Ansi.clearScreen)
  render(<App cycleLength={input[0]} />)
}

// module.exports = run()
run()
