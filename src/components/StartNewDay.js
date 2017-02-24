import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './components.css';

class StartNewDay extends Component {
  render () {
    return (
        <div className="outer">
          <span className="inner">
            <button className="btn btn-secondary btn-lg" onClick={this.props.onClick}>Start new day</button>
          </span>
        </div>
    );
  }
}

export default StartNewDay;
