import React, { Component } from 'react';
import {  browserHistory, Link } from 'react-router';
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
    const { cardNumber,
    cardholdersName,
    expiryDate,
    cvc} = this.state;
    return (
      <div >
        <p4>Add activity and its price</p4>
        <input value={cardNumber} placeholder="Card number" className="date-input" onChange={e => this.setState({cardNumber: e.target.value})} />
          <input value={cardholdersName} placeholder="Cardholder's name" className="date-input" onChange={e => this.setState({cardholdersName: e.target.value})} />
          <input value={expiryDate} placeholder="Expiry date" className="date-input" onChange={e => this.setState({expiryDate: e.target.value})} />
            <input value={cvc} placeholder="CVC" className="date-input" onChange={e => this.setState({cvc: e.target.value})} />
        <button onClick={() => this.pushToTodayActivities()}>Begin countdown</button>
      </div>
    );
  }
}

export default Payment;
