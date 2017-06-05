import React, { Component } from 'react'

class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: ''
    }
  }

  componentDidMount() {
    this.renderTime()
    this.timer = setInterval(() => this.renderTime(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  renderTime() {
    const left
    if (this.props.how_long) {
      const { startedAt } = this.props;
      left = Number(startedAt) + 24 * 60 * 60 * 1000 - Date.now()
    } else {
      left = 24 * 60 * 60 * 1000 - Date.now() % (24 * 60 * 60 * 1000)
    }
    this.calculationTime(left)
  }

  calculationTime(left) {
    if (this.props.startedAt && this.props.hours) {
      const hours = Math.floor(left / 1000 / 60 / 60);
      const minutes = Math.floor(left / 1000 / 60 % 60 );
      const seconds = Math.floor(left / 1000 % 60 );

      const minutesToDisplay = minutes.toString().length > 1 ? minutes : `0${minutes}`
      const secondsToDisplay = seconds.toString().length > 1 ? seconds : `0${seconds}`

      this.setState({time: `${hours}:${minutesToDisplay}:${secondsToDisplay}`})
    } else {
      this.setState({time: 'Loading...'})
    }
  }

  render () {
    const { time } = this.state;
    return (
      <h5>{time}</h5>
    )
  }
}

export default CountDown;
