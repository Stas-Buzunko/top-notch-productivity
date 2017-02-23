import React, { Component } from 'react';
import {  browserHistory } from 'react-router';
import './components.css';

class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardNumber: '',
      cardholdersName: '',
      expiryDate: '',
      cvc: '',
    };
  };

  pushToTodayActivities() {
    browserHistory.push('todayActivities')
  }

  render () {
    const { cardNumber,cardholdersName,expiryDate,cvc} = this.state;
    return (
      <div className="outer">
        <span className="inner">
          <h3 className="block"> Add activity and its price</h3>

          <ol className="noMarker" >
          <li className="block">
            <input  className="input-group-lg" value={cardNumber} placeholder="Card number" className="date-input" onChange={e => this.setState({cardNumber: e.target.value})} />
          </li>
          <li className="block">
            <input className="input-group-lg" value={cardholdersName} placeholder="Cardholder's name" className="date-input" onChange={e => this.setState({cardholdersName: e.target.value})} />
          </li>
          <li className="block">
            <input className="input-group-lg"  style={{ margin: '10px'}} value={expiryDate} placeholder="Expiry date" className="date-input" onChange={e => this.setState({expiryDate: e.target.value})} />
            <input className="input-group-lg" value={cvc} placeholder="CVC" className="date-input" onChange={e => this.setState({cvc: e.target.value})} />
          </li>
          <li className="block">
            <button className="btn btn-secondary btn-lg" onClick={() => this.pushToTodayActivities()}>Begin countdown</button>
          </li>
          </ol>
    </span>
  </div>
  );
 }
}

export default Payment;
