import React, { Component } from 'react';
import {  browserHistory, Link } from 'react-router';
import './components.css';

class AddActivity extends Component {
  pushToStartNewDay() {
    browserHistory.push('startNewDay')
  }
  render () {
    return (
      <div >
        <p4>Add activity and its price</p4>
        <table class="table">
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
        <button onClick={() => this.pushToStartNewDay()}>+</button>
        <button onClick={() => this.pushToStartNewDay()}>Next</button>
      </div>
    );
  }
}

export default AddActivity;
