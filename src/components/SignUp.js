import React, { Component } from 'react'
import './components.css'
import { Button } from 'react-bootstrap'

class SignUp extends Component {
  render () {
    return (
      <div className="outer"  style={{ height:'300px'}}>
        <span className="inner">
          <Button onClick={this.props.signUpWithGoogle} >Google</Button>
        </span>
      </div>
    );
  }
}

export default SignUp;
