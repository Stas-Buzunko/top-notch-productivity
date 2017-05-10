import React from 'react';
import { Route, IndexRoute,  } from 'react-router';

import App from './App';
import Payment from './pages/PaymentPage';
import ActivitiesPage from './pages/ActivitiesPage';
import MainPage from './pages/MainPage';
import Settings from './pages/SettingsPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
    <Route path="activities" component={ActivitiesPage} />
    <Route path="payment" component={Payment} />
    <Route path="settings" component={Settings} />
  </Route>
);
