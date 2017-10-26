const container = __APP_DOM_ID__ ? document.getElementById(__APP_DOM_ID__) : document.body;

function init() {
  import('./boot').then(boot => boot(container));
}
if (__PREBOOT_SCRIPT__) {
  const preboot = require(__PREBOOT_SCRIPT__).default;
  preboot().then(init);
} else {
  init();
}
