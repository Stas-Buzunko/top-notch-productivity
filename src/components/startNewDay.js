import React, { Component } from 'react';
import {  browserHistory, Link } from 'react-router';
import './components.css';

class AddActivity extends Component {
  pushToChooseTodayActivities() {
    browserHistory.push('chooseTodayActivities')
  }
  render () {
    return (
      <div >

        <button onClick={() => this.pushToChooseTodayActivities()}>Start new day</button>
      </div>
    );
  }
}

export default AddActivity;
