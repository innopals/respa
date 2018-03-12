import { createAction } from 'respa';
const IP_JSONP_API_URI = 'https://api.ipify.org?format=jsonp';

function getPublicIP() {
  return new Promise((f, r) => {
    $.ajax({
      dataType: "jsonp",
      url: IP_JSONP_API_URI,
      success: f,
      error: r
    });
  });
}

function getIp() {
  return {
    promise: getPublicIP()
  }
}

if (process.env.NODE_ENV !== 'production') {
  getIp.actionType = __filename;
}

export default createAction(getIp)
