const { h, render, Component, Color } = require('ink')

class Counter extends Component {
  constructor() {
    super()

    this.state = {
      i: 0
    }
  }

  render() {
    return <CounterView i={this.state.i} />
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        i: this.state.i + 1
      })
    }, 30)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }
}

const CounterView = ({ i }) => {
  return (
    <div>
      <div>{Array(i + 1).join('.')}</div>
      <div>
        <Color green>{i} tests passed</Color>
      </div>
    </div>
  )
}

module.exports = { Counter, CounterView }
