import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./websrc/compiled-reducers";
import promiseMiddleware from './websrc/promise-middleware';
import ActionFactory from './createAction';
import history, { LOCATION_CHANGE } from './history';
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

  if (process.env.BUILD_ENV === 'dev') {
    try {
      const createLogger = require('redux-logger').createLogger;
      middlewares.push(createLogger());
    } catch (e) {
      console.warn("Install redux-logger package to enable redux logger in dev environment.", e);
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

if (process.env.BUILD_ENV !== 'production') {
  window.__store__ = store;
};

export default store;
