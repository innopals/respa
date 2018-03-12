import { Store } from 'redux';
import { CompiledAction, ActionCreator, EnhancedActionDefinition } from './types';

let defaultStore: Store<any> | null = null, actionId = 0;

const createAction = (
  actionCreator: ActionCreator,
  actionTypeOverride?: string | null
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof actionCreator !== 'function') throw 'Action creator should be a function';
  }
  const dispatchAction: any = (...args: any[]): Promise<any> => {
    // only singleton store is supported right now.
    if (!defaultStore) throw 'Store is not initialized.';
    // not type check for action body from now on, no need to clone it.
    let action = <EnhancedActionDefinition>actionCreator(...args);
    action.dispatcher = dispatchAction;
    action.type = dispatchAction.ACTION_TYPE;
    defaultStore.dispatch(action);
    return action.promise ? action.promise : Promise.resolve(action.payload);
  };
  let actionType = process.env.NODE_ENV === 'production' ? String(actionId++) : `${actionId++}:${actionTypeOverride || actionCreator.name}`;
  ['success', 'error'].forEach(key => dispatchAction[key] = `${actionType}:${key}`);
  dispatchAction.ACTION_TYPE = actionType;
  dispatchAction.toString = () => actionType;
  return <CompiledAction>Object.freeze(dispatchAction);
}

export default createAction;

// lazy injection to avoid cyclic import.
export const initStore = (store: Store<any>): void => {
  if (defaultStore) throw new Error("Default store is already set.");
  defaultStore = store;
};
