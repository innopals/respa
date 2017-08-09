import createAction from 'respa/createAction';

function promise(ip) {
  return new Promise((f, r) => {
    $.ajax({
      dataType: "jsonp",
      url: `http://ip-api.com/json/${ip}`,
      success: f,
      error: r
    });
  });
}

function getAddressInfo(ip) {
  return {
    payload: ip,
    promise: promise(ip)
  }
}

if (process.env.NODE_ENV !== 'production') {
  getAddressInfo.actionType = __filename;
}

export default createAction(getAddressInfo)