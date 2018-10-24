// @flow

import Notifier from 'node-notifier'
import Play from 'play-sound'
import { resolve } from 'path'

const Player = Play({})

export type Props = {
  count: number
}

export const SOUNDS_PATH = resolve(__dirname, '..', '..', 'audio')

/** Path to the sound file to be played */
export const LONG_SOUND_FILE = resolve(SOUNDS_PATH, 'oringz-w447.ogg')

/** Path to the sound file to be played */
export const CHIRP_SOUND_FILE = resolve(SOUNDS_PATH, 'digital-spit.ogg')

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

  Player.play(LONG_SOUND_FILE)
  setTimeout(() => {
    chirp(count)
  }, 1000)
}

/** Plays the short sound file */
function chirp(count = 1) {
  Player.play(CHIRP_SOUND_FILE)

  if (count > 1) {
    setTimeout(() => {
      chirp(Math.min(count - 1, 3))
    }, 150)
  }
}
