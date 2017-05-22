import React, { Component } from 'react'

class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    if (this.props.how_long) {
      this.tillMidnight()
    } else {
      this.h24()
    }
  }

  tillMidnight() {
    const startedAt = this.props.startedAt;
    if (this.props.startedAt && this.props.hours) {
      const left = Number(startedAt) + 24 * 60 * 60 * 1000 - Date.now();
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

  h24() {
    const startedAt = this.props.startedAt;
    if (this.props.startedAt && this.props.hours) {
      const left = 24 * 60 * 60 * 1000 - Date.now() % (24 * 60 * 60 * 1000);
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
