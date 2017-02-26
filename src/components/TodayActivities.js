import React, { Component } from 'react';
import TodayActivitiesItem from './TodayActivitiesItem'
import firebase from 'firebase'
import './components.css';

class TodayActivities extends Component {
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
    const { startedAt } = this.props.day;
    const left = Number(startedAt) + 24 * 60 * 60 * 1000 - Date.now();
    const hours = Math.floor(left / 1000 / 60 / 60);
    const minutes = Math.floor(left / 1000 / 60 % 60 );
    const seconds = Math.floor(left / 1000 % 60 );

    const minutesToDisplay = minutes.toString().length > 1 ? minutes : `0${minutes}`
    const secondsToDisplay = seconds.toString().length > 1 ? seconds : `0${seconds}`

    this.setState({time: `${hours}:${minutesToDisplay}:${secondsToDisplay}`})
  }

  toggleActivityStatus(activity) {
    const { day } = this.props;
    const { activities } = day;

    const index = activities.indexOf(activity);
    const updatedActivity = {...activity, isDone: Boolean(!activity.isDone)}
    const updatedActivities = [
      ...activities.slice(0, index),
      updatedActivity,
      ...activities.slice(index + 1)
    ]

    firebase.database().ref('days/' + day.id).update({activities: updatedActivities})
  }

  render () {
    const { day } = this.props;
    const { time } = this.state;

    return (
      <div>
        <h3 className="block"> Activities for today</h3>
        <div>
          { day.activities && day.activities.length && day.activities.map((activity,i) =>
            <TodayActivitiesItem
              key={i}
              activity={activity}
              onClick={() => this.toggleActivityStatus(activity)}/>
          )}
        </div>
        <h4>Time left</h4>
        <h4>{time}</h4>
      </div>
    );
  }
}

export default TodayActivities;
