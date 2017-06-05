import React, { Component } from 'react';
import {  browserHistory } from 'react-router';
import Card from 'react-credit-card';
import toastr from 'toastr'
import firebase from 'firebase'
import axios from 'axios'
import '../style/react-card.css';
import '../components/components.css';

const serverUrl = 'http://localhost:3001'

class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardNumber: '',
      cardholdersName: '',
      month: '01',
      year: '19',
      cvc: '',
    };
  };

  componentDidMount() {
    window.Stripe.setPublishableKey('pk_test_5n8G7dKz3Voa7kG3K69MW1xs');
  }

  cvcChecker(value) {
    if (!value || (value.length < 5 && (/^\d+$/).test(value))) {
      this.setState({cvc: value});
    }
  }

  cardNumberChecker(value) {
    if ((value.length < 17 && (/^\d+$/).test(value)) || !value) {
      this.setState({cardNumber: value})
    }
  }

  handleInputChange(field, value) {
    this.setState({
      [field]: value,
    })
  }

  handleSubmit() {
    const { cardholdersName, cardNumber, cvc, month, year } = this.state;
    const { handleSubmit } = this.props;
    if (cardholdersName.length && cardNumber.length === 16 && cvc.length && month.length === 2 && year.length === 2 ) {
      this.setState({error: ''});
      this.stripeCustomer({name, cardNumber, cvc, month, year});
    } else {
      this.setState({error: 'Please enter correct details'});
    }
  }

  stripeCustomer(params) {
    const { name, cardNumber, cvc, month, year } = params;
    const { user } = this.props;
    const { customerId } = this.props.user;

    window.Stripe.createToken(
      {
        number: cardNumber,
        cvc,
        exp_month: month,
        exp_year: `20${year}`
      },
      (status, response) => {
        if (response.error) {
          if (response.error && response.error.message) {
            toastr.error(response.error.message);
          } else {
            toastr.error('Something went wront. Please, try again.');
          }
        } else {
          toastr.success('Saving card...');
          if (response.id) {
            
              axios.post(`${serverUrl}/customer`, {
                token: response.id,
              })
              .then(resp => {
                firebase.database().ref('users/'+ user.uid).update({customerId: resp.data.customerId })
                .then(() => {
                  toastr.success('Your payment info saved!');
                  browserHistory.push('/');
                });
              })
          }
        }
      }
    );

    
  }

  render () {
    const { cardNumber, cardholdersName, expiryDate, month, year, error, cvc } = this.state;
    const { user } = this.props;

    return (
      <div>
        <h3 className="block">Enter your payment details</h3>
        <h4>We DO NOT charge anything if you don't use our service</h4>
        <h4>Every charge can be refunded</h4>

        {error && <span>{error}</span>}
        <Card
          cvc={cvc}
          number={cardNumber}
          name={cardholdersName}
          expiry={month + year}
          focused={'name'}
        />
        <form>
          <input value={cardholdersName} placeholder="Full name" type="text" name="CCname" onChange={e => this.handleInputChange('cardholdersName', e.target.value)} />
          <input value={cardNumber} placeholder="Card number" type="text" name="CCnumber" onChange={e => this.cardNumberChecker(e.target.value)} />
          <div className="col-4 left">
            <select className="input input-expire" style={{padding: '0px 9px', marginBottom: 0}} value={month} onChange={e => this.handleInputChange('month', e.target.value)}>
              <option value="01">01</option>
              <option value="02">02</option>
              <option value="03">03</option>
              <option value="04">04</option>
              <option value="05">05</option>
              <option value="06">06</option>
              <option value="07">07</option>
              <option value="08">08</option>
              <option value="09">09</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
            <span> / </span>
            <select className="input input-expire" style={{padding: '0px 9px', marginBottom: 0}} value={year} onChange={e => this.handleInputChange('year', e.target.value)}>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
            </select>
          </div>
          <div className="col-6 left">
            <input value={cvc} placeholder="CVC" type="text" name="CCcvc" onChange={e => this.cvcChecker(e.target.value)} />
          </div>
        </form>
       {user.customerId &&
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => browserHistory.push('/')}>
            Go to main page
          </button>
        }
        <button className="sign-in__button btn" onClick={() => this.handleSubmit()}>
          <strong>Save card details</strong>
        </button>

      </div>
    );
  }  
}

export default Payment;
