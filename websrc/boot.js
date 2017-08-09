import React from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter } from "react-router-redux";
import Store from '../store';
import history from '../history';
import App from 'WEBROOT/views';

const AppContainer = connect(v => v)(App);
module.exports = dom => ReactDom.render(
  <Provider store={Store}>
    <ConnectedRouter history={history}><AppContainer /></ConnectedRouter>
  </Provider>,
  dom
);
