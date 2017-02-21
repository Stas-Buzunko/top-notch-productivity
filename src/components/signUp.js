import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import './components.css';

class SignUp extends Component {
//   function onSignIn(googleUser) {
// var profile = googleUser.getBasicProfile();
// console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
// console.log('Name: ' + profile.getName());
// console.log('Image URL: ' + profile.getImageUrl());
// console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// };

pushToActivity() {
// console.log("olololol")
  browserHistory.push({pathname: '/addActivity'})
}
  render () {

    return (
      <div >
        <div className="container"> bkjndbnc</div><div>
          <div className="g-signin2" data-onsuccess="onSignIn" onClick={() => this.pushToActivity()}></div>
<span className="align-middle">middle</span>
          <ul>
          <li><Link to="addActivity">addActivity</Link></li>
          <li><Link to="startNewDay">startNewDay</Link></li>
        </ul>
        </div>
      </div>


    );
  }
}

export default SignUp;
