import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './components.css';

class SignUp extends Component {
  pushToActivity() {
    browserHistory.push({pathname: '/addActivity'})
  }

  render () {
    return (
      <div className="outer"  style={{ height:'300px'}}>
        <span className="inner">
          <button onClick={this.props.signUpWithGoogle}>Google</button>
        </span>
      </div>
    );
  }
}

export default SignUp;
