import { createStore, applyMiddleware, compose } from "redux";
import { LOCATION_CHANGE } from "react-router-redux";
import reducers from "./websrc/compiled-reducers";
import promiseMiddleware from './websrc/promise-middleware';
import ActionFactory from './createAction';
import history from './history';
import qs from 'qs';

const rootReducer = (state, action) => {
  let newState = reducers(state, action);
  if (action.type === LOCATION_CHANGE) {
    newState = Object.assign({}, newState, { routing: { location: action.payload } });
    let search = action.payload.search;
    if (typeof search === 'string' && search.indexOf('?') === 0) {
      newState.routing.location.query = qs.parse(search.substr(1));
    }
  }
  return newState;
};

function configureStore() {
  let middlewares = [promiseMiddleware];

  if (__DEV__) {
    try {
      const createLogger = require('redux-logger');
      middlewares.push(createLogger());
    } catch (e) {
      console.warn("Install redux-logger package to enable redux logger in dev environment.");
    }
  }
  return createStore(
    rootReducer,
    { routing: {} },
    compose(applyMiddleware(...middlewares))
  );
}

const store = configureStore();
ActionFactory.init(store);

if (!__PROD__) {
  window.__store__ = store;
};

export default store;
