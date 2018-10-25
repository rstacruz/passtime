#!/usr/bin/env node
/* @jsx h */
import { App } from './containers/App'
import { h, render } from 'ink'
import { basename } from 'path'
import Meow from 'meow'

function cli() {
  return Meow(
    `
    Usage: 
      $ ${basename(process.argv[1])} [options...] [<cycle length>] [<message>]

    Other options:
      -h, --help           show usage information
      -v, --version        print version info and exit
  `,
    {
      flags: {
        help: { type: 'boolean', alias: 'h' },
        version: { type: 'boolean', alias: 'v' },
        message: { type: 'string', alias: 'm' }
      }
    }
  )
}

function run() {
  const { flags, input } = cli()
  const message = input.slice(1).join(' ')
  // Force 256 color
  // require('chalk').level = 2
  render(<App cycleLength={input[0]} message={cap(flags.message || message)} />)
}

function cap(str) {
  return '' + str.substr(0, 1).toUpperCase() + str.substr(1)
}

run()
