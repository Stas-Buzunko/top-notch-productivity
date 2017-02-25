import React, { Component } from 'react';
import firebase from 'firebase'
import SignUp from './components/SignUp'
import toastr from 'toastr'
import { browserHistory } from 'react-router'
import 'toastr/build/toastr.min.css'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    const userFromStorage = localStorage.getItem('top-notch-productivity')
    const isUser = userFromStorage !== null
    const user = isUser ? JSON.parse(userFromStorage) : {}

    this.state = {
      authenticated: isUser,
      user
    }

    this.signUpWithGoogle = this.signUpWithGoogle.bind(this)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('logged in');
        this.fetchUser(user.uid)
      } else {
        this.setState({authenticated: false, user: {}});
        localStorage.removeItem('top-notch-productivity');
        console.log('not logged in');
      }
    });
  }

  signUpWithGoogle() {
    const { authenticated } = this.state
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const { uid, displayName, email } = result.user;

      firebase.database().ref('users/' + uid).once('value')
      .then(snapshot => {
        const userObject = snapshot.val();
        if (!userObject) {
          firebase.database().ref('users/' + uid).set({
            displayName,
            email
          })
        }
      })

      toastr.success('You are in!')
    })
    .catch(error => {
      toastr.error(error.message)
    });
  }

  fetchUser(uid) {
    firebase.database().ref('users/' + uid).on('value', snapshot => {
      const user = snapshot.val()
      if (user) {
        this.setState({authenticated: true, user: {...user, uid: snapshot.key}});
     
        localStorage.setItem('top-notch-productivity', JSON.stringify(user));
        if (!user.activities || !user.activities.length) {
          browserHistory.push('activites')          
        }
      }
    })
  }

  render() {
    const { authenticated, user } = this.state;

    if (!authenticated) {
      return (<SignUp signUpWithGoogle={this.signUpWithGoogle} />)
    }

    const { children } = this.props;
    const childrenWithProps = React.Children.map(children,
      child => React.cloneElement(child, {
        user
      })
    );

    return (
      <div className="container">
        <button onClick={() => firebase.auth().signOut()}> Sign out </button>
        <div className="outer">
          <div className="inner">
            {childrenWithProps}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
