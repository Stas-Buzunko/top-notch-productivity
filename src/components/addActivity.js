import React, { Component } from 'react';
import {  browserHistory, Link } from 'react-router';
import './components.css';

class AddActivity extends Component {
  pushToStartNewDay() {
    browserHistory.push('startNewDay')
  }
  render () {
    return (
      <div className="outer">
        <span className="inner">
          <h3 className="block"> Add activity and its price</h3>
          <table className="table block">
            <thead>
              <tr>
                <th>Activities</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mark</td>
                <td>Otto</td>
              </tr>
              <tr>
                <td>Jacob</td>
                <td>Thornton</td>
              </tr>
              <tr>
                <td>Larry</td>
                <td>the Bird</td>
                </tr>
            </tbody>
          </table>

          <button type="button block"  style={{ margin: '10px'}}  className="btn btn-secondary btn-lg" onClick={() => this.pushToStartNewDay()}>   +   </button>
<br/>
           <button type="button block"  style={{ margin: '10px'}}  className="btn btn-secondary btn-lg" onClick={() => this.pushToStartNewDay()}>  Next  </button>

        </span>
      </div>
    );
  }
}

export default AddActivity;
