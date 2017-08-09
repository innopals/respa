const container = __APP_DOM_ID__ ? document.getElementById(__APP_DOM_ID__) : document.body;

if (__PREBOOT_SCRIPT__) {
  const preboot = require(__PREBOOT_SCRIPT__).default;
  preboot().then(() => import('./boot').then(boot => {
    boot(container);
  }));
} else {
  const boot = require('./boot');
  boot(container);
}
