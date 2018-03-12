declare const __APP_DOM_ID__: string;
declare const __PREBOOT_SCRIPT__: string;

const container = __APP_DOM_ID__ ? document.getElementById(__APP_DOM_ID__) : document.body;

function init() {
  import('./boot').then((boot: any) => boot(container));
}
if (__PREBOOT_SCRIPT__) {
  const preboot = require(__PREBOOT_SCRIPT__).default;
  preboot().then(init);
} else {
  init();
}
