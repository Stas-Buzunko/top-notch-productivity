import React, { Component } from 'react';
import {  browserHistory, Link } from 'react-router';
import './components.css';

class ChooseTodayActivities extends Component {
  pushToPayment() {
    browserHistory.push('payment')
  }
  render () {
    return (
      <div className="outer">
        <span className="inner">
          <h3 className="block"> Choose activities for today</h3>

          <div className="row block">
            <div className="col-lg-6">
              <div className="input-group">
                <span className="input-group-addon">
                  <input type="checkbox" aria-label="Checkbox for following text input"/>
                </span>
                <input type="text" className="form-control" aria-label="Text input with checkbox"/>
              </div>
            </div>
          </div>
          <button type="button block" className="btn btn-secondary btn-lg" onClick={() => this.pushToPayment()}>Lets go</button>
        </span>
      </div>
    );
  }
}

export default ChooseTodayActivities;
