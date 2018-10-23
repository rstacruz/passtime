import Notifier from 'node-notifier'
import Play from 'play-sound'

const Player = Play({})

export const SOUND_FILE = require('path').resolve(
  __dirname,
  '..',
  '..',
  'audio',
  'oringz-w447.ogg'
)

export const ding = () => {
  Notifier.notify({
    title: 'Passtime',
    message: 'Ding!'
  })

  Player.play(SOUND_FILE)
}
