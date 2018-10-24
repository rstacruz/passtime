// @flow

import Notifier from 'node-notifier'
import Play from 'play-sound'

const Player = Play({})

export type Props = {
  count: number
}

/** Path to the sound file to be played */
export const SOUND_FILE = require('path').resolve(
  __dirname,
  '..',
  '..',
  'audio',
  'oringz-w447.ogg'
)

/**
 * Sends notifications
 *
 *     ding({ count: 2 })
 */

export const ding = (opts: Props) => {
  const { count } = opts

  Notifier.notify({
    title: `Passtime (x${count})`,
    message: 'Ding!'
  })

  Player.play(SOUND_FILE)
}
