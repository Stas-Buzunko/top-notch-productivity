import React, { Component } from 'react';
import firebase from 'firebase'
import SignUp from './components/SignUp'
import toastr from 'toastr'
import { browserHistory, IndexLink } from 'react-router'
import 'toastr/build/toastr.min.css'
import './App.css';
import { Navbar, Nav, NavItem, Link, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

class App extends Component {
  constructor(props) {
    super(props)
    const userFromStorage = localStorage.getItem('top-notch-productivity')
    const isUser = userFromStorage !== null
    const user = isUser ? JSON.parse(userFromStorage) : {}

    this.state = {
      authenticated: isUser,
      user,
      day: '',
      loading: true
    }

    this.signUpWithGoogle = this.signUpWithGoogle.bind(this)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('logged in');
        this.fetchUser(user.uid)
        this.fetchLastDay(user.uid)
      } else {
        this.setState({authenticated: false, user: {}});
        localStorage.removeItem('top-notch-productivity');
        console.log('not logged in');
      }
    });
  }

  signUpWithGoogle() {
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
      let user = snapshot.val()
      if (user) {
        user = { ...user, uid: snapshot.key }
        this.setState({authenticated: true, user });
        localStorage.setItem('top-notch-productivity', JSON.stringify(user));
        // if (!user.activities || !user.activities.length) {
        //   browserHistory.push('activities')          
        // }
      }
    })
  }

  fetchLastDay(uid) {
    firebase.database().ref('days')
    .orderByChild('userId')
    .equalTo(uid)
    .limitToLast(1)
    .on('value', snapshot => {
      const dayQuery = snapshot.val();
      if (dayQuery) {
        const key = Object.keys(dayQuery)[0]
        const dayObject = dayQuery[key]

        if (dayObject && Number(dayObject.startedAt) + 24 * 60 * 60 * 1000 > Date.now()) {
          const day = {...dayObject, id: key };
          this.setState({ day, loading: false });
        } else {
          this.setState({loading: false})
        }
      } else {
        this.setState({loading: false})
      }
    })
  }

  render() {
    const { authenticated, user, day, loading } = this.state;
    let content;

    if (!authenticated) {
      content = (<SignUp signUpWithGoogle={this.signUpWithGoogle} />)
    } else if (loading) {
      content = <i className="fa fa-refresh fa-spin fa-4x" aria-hidden="true" style={{color: 'blue'}}></i>
    } else {
      const { children } = this.props;
      const childrenWithProps = React.Children.map(children,
        child => React.cloneElement(child, {
          user,
          day
        })
      );

      content = childrenWithProps
    }

    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/">Top notch productivity</IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/settings">
                <NavItem eventKey={1}>Settings</NavItem>
              </LinkContainer>
              <LinkContainer to="/payment">
                <NavItem eventKey={1}>Payment</NavItem>
              </LinkContainer>
              <LinkContainer to="/activities">
                <NavItem eventKey={1}>Activities</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              {authenticated && <Button type="button" className="btn btn-default navbar-btn" onClick={() => firebase.auth().signOut()}> Sign out </Button>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="container">
          <div className="outer">
            <div className="inner">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
