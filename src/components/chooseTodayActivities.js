import React, { Component } from 'react';
import {  browserHistory, Link } from 'react-router';
import './components.css';

class ChooseTodayActivities extends Component {
  pushToPayment() {
    browserHistory.push('payment')
  }
  render () {
    return (
      <div >
        <p4>Choose activities for today</p4>

        <div className="row">
  <div className="col-lg-6">
    <div className="input-group">
      <span className="input-group-addon">
        <input type="checkbox" aria-label="Checkbox for following text input"/>
      </span>
      <input type="text" class="form-control" aria-label="Text input with checkbox"/>
    </div>
  </div>
    </div>
        <button onClick={() => this.pushToPayment()}>Lets go</button>
      </div>
    );
  }
}

export default ChooseTodayActivities;
