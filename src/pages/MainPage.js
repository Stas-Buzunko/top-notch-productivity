import React, { Component } from 'react'
import TodayActivities from '../components/TodayActivities'
import ActivityList from '../components/ActivityList'


class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: '',
    }
  }

  render() {
    const { currentView } = this.state;
    const { user } = this.props;
    let content;

    switch (currentView) {
      case 'ChooseActivities':
        content = <ActivityList user={user} />;
        break;
      case 'DayInProgress':
        content = <TodayActivities />;
        break;
      default:
        content = <button
          className="btn btn-secondary btn-lg"
          onClick={() => this.setState({currentView: 'ChooseActivities'})}>
            Start new productive day
        </button>
    }

    return (
      <div>{content}</div>
    )
  }
}

export default MainPage;
