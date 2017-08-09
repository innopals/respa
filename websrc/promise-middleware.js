const promiseMiddleware = () => next => action => {
  if (!action.promise || !(action.promise instanceof Promise)) {
    next(action);
    return;
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
};

export default promiseMiddleware;
