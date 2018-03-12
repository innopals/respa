export default (mapper: (payload: any, state?: any) => any) => {
  return (state: any, payload: any) => {
    return Object.assign({}, state, mapper(payload, state));
  };
}
