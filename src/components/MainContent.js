import React, { Component } from 'react'
import StartNewDay from './StartNewDay'
import TodayActivities from './TodayActivities'

class MainContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDayInProcess: false,
    }
  }

  render() {
    const { isDayInProcess } = this.state;

    if (!isDayInProcess) {
      return <StartNewDay onClick={() => this.setState({isDayInProcess: true})} />
    }

    return (
      <TodayActivities />
    )
  }
}

export default MainContent;
