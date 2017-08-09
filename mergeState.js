export default mapper => {
  return (state, payload) => {
    return Object.assign({}, state, mapper(payload, state));
  };
}
