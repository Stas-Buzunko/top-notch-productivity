import React, { Component } from 'react';
import {  browserHistory } from 'react-router';
import './components.css';

class ChooseTodayActivities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: [
        {id : 1,
        name: 'ggggg',
        price: 'rrrr',},
        {id : 2,
        name: 'tttttt',
        price: 'rrrrr',},
      ],
      name: '',
      price: '',
    }
  };

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
              {!!this.state.activities.length && this.state.activities.map((item, i) => {
                return (
                  <div key={i} className="input-group">
                    <span className="input-group-addon" >
                      <input type="checkbox" aria-label="Checkbox for following text input"/>
                    </span>
                    <input type="text" className="form-control" aria-label="Text input with checkbox"/>
                  </div>
                )}
              )}
            </div>
          </div>
          <button type="button block" className="btn btn-secondary btn-lg" onClick={() => this.pushToPayment()}>Lets go</button>
        </span>
      </div>
    );
  }
}

export default ChooseTodayActivities;
