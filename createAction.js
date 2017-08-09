let defaultStore = null, actionId = 0;

const createAction = function (actionCreator) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof actionCreator !== 'function') throw 'Action creator should be a function';
  }
  function dispatchAction(...args) {
    // only singleton store is supported right now.
    if (!defaultStore) throw 'Store is not initialized.';
    let action = actionCreator(...args);
    action.dispatcher = dispatchAction;
    action.type = dispatchAction.ACTION_TYPE;
    defaultStore.dispatch(action);
    return action.promise ? action.promise : Promise.resolve(action.payload);
  }
  let actionType = process.env.NODE_ENV === 'production' ? String(actionId++) : `${actionId++}:${actionCreator.actionType || actionCreator.name}`;
  // for now action type "progress" is not utilized.
  ['success', 'error', 'progress'].forEach(key => dispatchAction[key] = `${actionType}:${key}`);
  dispatchAction.ACTION_TYPE = actionType;
  dispatchAction.toString = () => actionType;
  return Object.freeze(dispatchAction);
}

// lazy injection to avoid cyclic import.
createAction.init = store => defaultStore = store;

export default createAction
