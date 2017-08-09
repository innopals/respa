import React from 'react';

import { Route, Switch, Redirect } from 'react-router';
import ViewLoader from './ViewLoader';
import PageNotFound from './NotFound';

require('./base.less');

const HomeViewLoader = () => import("./Home");
export default function App(props) {
  return (
    <Switch>
      <Route path='/' exact><Redirect to="/home" /></Route>
      <Route path="/home" exact>
        <ViewLoader loader={HomeViewLoader} {...props} />
      </Route>
      <PageNotFound />
    </Switch>
  );
}