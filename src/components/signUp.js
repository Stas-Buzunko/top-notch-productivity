import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './components.css';

class SignUp extends Component {
 onSignIn(googleUser) {
var profile = googleUser.getBasicProfile();
console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
console.log('Name: ' + profile.getName());
console.log('Image URL: ' + profile.getImageUrl());
console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
};

  pushToActivity() {
    browserHistory.push({pathname: '/addActivity'})
  }
  render () {
    return (
      <div className="outer"  style={{ height:'300px'}}>
        <span className="inner">
          <div className="g-signin2" data-onsuccess="onSignIn" onClick={() => this.pushToActivity()}></div>
        </span>
      </div>
    );
  }
}

export default SignUp;
