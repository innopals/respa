import createAction from 'respa/createAction';

function setName(name) {
  return {
    payload: name
  }
}

if (process.env.NODE_ENV !== 'production') {
  setName.actionType = __filename;
}

export default createAction(setName)
