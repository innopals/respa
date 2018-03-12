import React, { ComponentType } from 'react';
import { Provider, connect } from 'react-redux';
import ConnectedRouter from "./ConnectedRouter";
import LazyViewLoader from '../LazyViewLoader';
import Store from '../store';
import history from '../history';

const loadGuestView = () => new Promise<ComponentType>(
  (f, r) => {
    require.ensure([], require => {
      try {
        f(require('WEBROOT/views'));
      } catch (e) {
        r(e);
      }
    });
  }
);

const AppContainer = connect(v => v)(props => <LazyViewLoader {...props} loader={loadGuestView} />);
module.exports = (dom: any) => require('react-dom').render(
  <Provider store={Store}>
    <ConnectedRouter history={history}>
      <AppContainer />
    </ConnectedRouter>
  </Provider>,
  dom
);
