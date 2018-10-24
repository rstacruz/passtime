// @flow
/* @jsx h */

import { h, Component } from 'ink'

export type Props = {
  frames: string[]
}

/**
 * Hacky implementation of Blink that's made to be more CPU-friendly.
 * Yes, this violates React best practices, don't copy this!
 */

export class Blink extends Component {
  constructor(props: Props) {
    super(props)
    this.frame = 0
    this.framesLength = props.frames.length
  }

  render() {
    const { frames } = this.props
    this.frame = (this.frame + 1) % this.framesLength
    return <span>{frames[this.frame]}</span>
  }
}
