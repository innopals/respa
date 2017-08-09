var path = require('path');
try {
  // ensure dev packages are installed.
  require('express');
  require('connect-history-api-fallback');
  require('webpack-dev-middleware');
  require('webpack-hot-middleware');
  require('browser-sync-webpack-plugin');
} catch (e) {
  console.log(e);
  process.exit(-1);
}

var express = require('express'),
  webpack = require('webpack'),
  config = require('./webpack.config'),
  pathConfig = require('./path-config');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var respa_config = {};
try {
  respa_config = require(path.join(process.cwd(), ".respa"));
} catch (e) { }
var proxyPort = 15000 + parseInt(Math.random() * 50000);

// Adjust config for dev server.
config.entry.app = [
  'eventsource-polyfill',
  'webpack-hot-middleware/client?reload=true',
  'webpack/hot/dev-server',
  config.entry.app
];
config.output.publicPath = '/';
config.devtool = 'cheap-module-eval-source-map';

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new BrowserSyncPlugin(
    {
      host: '127.0.0.1',
      port: 9090,
      proxy: 'http://127.0.0.1:' + proxyPort,
      logConnections: false,
      notify: false,
      startPath: pathConfig.contextPath
    },
    {
      reload: false
    }
  )
);

app = express();
// for highly stable resources
app.use(pathConfig.contextPath + 'static', express.static(pathConfig.static));
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

var compiler = webpack(config);
// serve webpack bundle output
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

// enable hot-reload and state-preserving
// compilation error display
app.use(require('webpack-hot-middleware')(compiler));

app.listen(proxyPort, '127.0.0.1', function (err) {
  err && console.log(err);
});
