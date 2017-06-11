import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import routes from './routes';
import { Router, browserHistory } from 'react-router';
import firebase from 'firebase';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-000000-01');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
} 

const config = {
  apiKey: "AIzaSyBGY7S9abO2Rqgl2k9Jad0dl_owqBiHKF8",
  authDomain: "top-notch-productivity-f6632.firebaseapp.com",
  databaseURL: "https://top-notch-productivity-f6632.firebaseio.com",
  storageBucket: "top-notch-productivity-f6632.appspot.com",
  messagingSenderId: "730354434727"
};

firebase.initializeApp(config);

ReactDOM.render(
  <Router history={browserHistory} onUpdate={logPageView}>{routes}</Router>,
  document.getElementById('root')
);
