const actionReducers: any = {};
const initialStates: any = { routing: {} };
let initialized = false;

function compileReducers(ns: any, node: any) {
  let { reducers, children, initialState } = node;
  if (initialState) initialStates[ns] = initialState;
  if (reducers) {
    Object.keys(reducers).forEach(actionType => {
      let fn = reducers[actionType];
      if (typeof fn !== 'function') {
        console.error(`Reducer on state ${ns} for action type ${actionType} is not a function!`);
        return;
      }
      if (!actionReducers[actionType]) actionReducers[actionType] = [];
      actionReducers[actionType].push({ ns, fn });
    });
  }
  if (children) {
    Object.keys(children).forEach(child => {
      compileReducers(`${ns}.${child}`, children[child]);
    });
  }
}

require.ensure([], require => {
  const $root = require('REDUCERS').default;
  if (process.env.BUILD_ENV !== 'production') {
    (<any>window).__reducers__ = $root;
  }
  compileReducers("$root", $root);
})

function setInitialState(ctx: any, paths: string[]) {
  let node = ctx;
  let lastIndex = paths.length - 1;
  for (let i = 0; i < lastIndex; i++) node = node[paths[i]];
  if (!node[paths[lastIndex]]) node[paths[lastIndex]] = initialStates[paths.join('.')] || {};
}

function doReduce(
  ctx: any, paths: string[], fn: any, payload: any, meta: any
) {
  let traversing: string[] = [];
  let lastIndex = paths.length - 1;
  let lastKey = paths[lastIndex];
  let node = ctx;
  paths.forEach((path, index) => {
    traversing.push(path);
    setInitialState(ctx, traversing);
    if (index !== lastIndex) {
      node[path] = Object.assign({}, node[path]);
      node = node[path];
    }
  });
  node[lastKey] = fn(node[lastKey], payload, meta);
}

function initializeStateTree(ctx: any) {
  Object.keys(initialStates).forEach(ns => {
    let paths: string[] = [];
    ns.split('.').forEach(path => {
      paths.push(path);
      setInitialState(ctx, paths);
    });
  });
}

export default function (rootState: any, action: any) {
  let ctx = { $root: rootState };
  if (!initialized) {
    initializeStateTree(ctx);
    initialized = true;
  }
  if (!actionReducers[action.type]) return ctx.$root;
  actionReducers[action.type].forEach(
    ({ ns, fn }: { ns: any, fn: any }) => {
      doReduce(ctx, ns.split('.'), fn, action.payload, action.meta);
    }
  );
  return ctx.$root;
}
