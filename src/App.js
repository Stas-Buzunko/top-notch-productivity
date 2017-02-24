import React, { Component } from 'react';
import firebase from 'firebase'
import SignUp from './components/signUp'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    const authenticatedFromStorage = localStorage.getItem('top-notch-productivity')
    const authenticated = authenticatedFromStorage !== null

    this.state = {
      authenticated,
      id: ''
    }

    this.signUpWithGoogle = this.signUpWithGoogle.bind(this)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('logged in');
        this.setState({authenticated: true, id: user.uid});
        localStorage.setItem('top-notch-productivity', 'true');
      } 
      else {
        this.setState({authenticated: false, id: ''});
        localStorage.removeItem('top-notch-productivity', 'true');
        console.log('not logged in');
      }
    });
  }

  signUpWithGoogle() {
    const { authenticated } = this.state
    const provider = new firebase.auth.GoogleAuthProvider();

    // check if new account
    // if yes redirect to add activities
    // otherwise no redirect
    firebase.auth().signInWithPopup(provider)
    .then(() => {
      toastr.success('You are in!')
    })
    .catch(error => {
      toastr.error(error.message)
    });
  }

  render() {
    const { authenticated } = this.state;

    if (!authenticated) {
      return (<SignUp signUpWithGoogle={this.signUpWithGoogle} />)
    }

    return (
        <div className="routerView">
        {this.props.children}
      </div>
    );
  }
}

export default App;
