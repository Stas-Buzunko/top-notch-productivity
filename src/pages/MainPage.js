import React, { Component } from 'react'
import TodayActivities from '../components/TodayActivities'
import ActivityList from '../components/ActivityList'
import { browserHistory } from 'react-router'

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: '',
    }
  }

  componentWillMount() {
    const { day, user } = this.props;

    if (!user.customerId) {
      browserHistory.push('payment')
    }

    if (day) {
      this.setState({currentView: 'DayInProgress'})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.day && nextProps.day) {
      this.setState({currentView: 'DayInProgress'})
    }
  }

  render() {
    const { currentView } = this.state;
    const { user, day } = this.props;
    let content;

    switch (currentView) {
      case 'ChooseActivities':
        content = <ActivityList user={user} />;
        break;
      case 'DayInProgress':
        content = <TodayActivities day={day} />;
        break;
      default:
        content = <button
          className="btn btn-secondary btn-lg"
          onClick={() => this.setState({currentView: 'ChooseActivities'})}>
            Start new productive day
        </button>
    }
// in not payment => send to payment on start new day
    return (
      <div>{content}</div>
    )
  }
}

export default MainPage;
