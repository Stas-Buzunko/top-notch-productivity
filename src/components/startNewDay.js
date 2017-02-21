import React, { Component } from 'react';
import {  browserHistory, Link } from 'react-router';
import './components.css';

class AddActivity extends Component {
  pushToChooseTodayActivities() {
    browserHistory.push('chooseTodayActivities')
  }
  render () {
    return (
        <div className="outer">
          <span className="inner">
            <button className="btn btn-secondary btn-lg" onClick={() => this.pushToChooseTodayActivities()}>Start new day</button>
          </span>
        </div>
    );
  }
}

export default AddActivity;
