import { createStore, applyMiddleware, compose, Store, Middleware } from "redux";
import reducers from "./websrc/compiled-reducers";
import promiseMiddleware from './websrc/promise-middleware';
import { initStore } from './createAction';
import { LOCATION_CHANGE } from './history';
import qs from 'qs';

const rootReducer = (state: any, action: any) => {
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
  let middlewares: Middleware[] = [promiseMiddleware];

  if (process.env.BUILD_ENV === 'dev') {
    try {
      const createLogger: () => Middleware = require('redux-logger').createLogger;
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

const store: Store<any> = configureStore();
initStore(store);

if (process.env.BUILD_ENV !== 'production') {
  (<any>window).__store__ = store;
};

export default store;
