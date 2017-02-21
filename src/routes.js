import React from 'react';
import { Route, IndexRoute,  } from 'react-router';

import App from './App';
import SignUp from './components/signUp';
import AddActivity from './components/addActivity';
import StartNewDay from './components/startNewDay';
import ChooseTodayActivities from './components/chooseTodayActivities';
import Payment from './components/payment';
import TodayActivities from './components/todayActivities';

export default (

  <Route path="/" component={App}>
  <IndexRoute component={SignUp}/>
  <Route path="addActivity" component={AddActivity} />
  <Route path="startNewDay" component={StartNewDay} auth />
  <Route path="chooseTodayActivities" component={ChooseTodayActivities} auth verified />
  <Route path="payment" component={Payment} auth profile verified />
  <Route path="todayActivities" component={TodayActivities} auth profile verified /> */}
  </Route>

);
