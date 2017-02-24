import React from 'react';
import { Route, IndexRoute,  } from 'react-router';

import App from './App';
import Payment from './components/payment';
import ActivitiesPage from './components/ActivitiesPage';
import MainContent from './components/MainContent';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainContent} />
    <Route path="activites" component={ActivitiesPage} />
    <Route path="payment" component={Payment} />
  </Route>
);
