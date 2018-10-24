// @flow
/* @jsx h */

import { h, Component, renderToString } from 'ink'
import strip from 'strip-ansi'

export type Props = {
  children: any
}

export class Blink extends Component {
  constructor(props: Props) {
    super(props)
    this.state = { isVisible: true }
  }

  tick = (): void => {
    this.setState({ isVisible: !this.state.isVisible })
    this.timer = setTimeout(this.tick, this.props.interval)
  }

  componentDidMount() {
    this.tick()
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    const { children, alt } = this.props
    const { isVisible } = this.state

    if (isVisible) {
      return (
        <span>
          {children}
          {this.state.now}
        </span>
      )
    } else {
      if (typeof alt !== 'undefined') {
        return alt
      } else {
        const len = strip(renderToString(<span>{children}</span>)).length
        return Array(len + 1).join(' ')
      }
    }
  }
}

Blink.defaultProps = {
  interval: 250
}
