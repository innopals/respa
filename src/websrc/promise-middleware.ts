import { Middleware, Dispatch } from "redux";
import { EnhancedActionDefinition } from '../types';

const promiseMiddleware: Middleware = <S>(): (next: Dispatch<S>) => Dispatch<S> => (
  (next: Dispatch<S>) => <Dispatch<S>>(
    (action: EnhancedActionDefinition) => {
      if (!action.promise || !(action.promise instanceof Promise)) {
        next(action);
        return action;
      }
      next(action);
      action.promise.then(payload => {
        next({
          type: action.dispatcher.success,
          payload,
          meta: { request: action.payload }
        });
      }).catch(e => next({
        type: action.dispatcher.error,
        payload: e,
        meta: { request: action.payload }
      }));
      return action;
    }
  )
);

export default promiseMiddleware;
