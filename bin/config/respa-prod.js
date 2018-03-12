// ensure that NODE_ENV is set to production.
process.env.NODE_ENV = 'production';
process.env.BUILD_ENV = 'production';

var webpack = require('webpack'),
  fs = require('fs'),
  path = require('path'),
  config = require('./webpack.config'),
  pathConfig = require('./path-config'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin');

var respa_config = {};
try {
  respa_config = require(path.join(process.cwd(), ".respa"));
} catch (e) { }

// Adjust config for prod dist.
config.output.filename = '[name].[chunkhash:6].js';
config.output.chunkFilename = '[id].[chunkhash:6].js';
config.plugins.push(
  new CleanWebpackPlugin('dist', {
    root: pathConfig.rootPath,
    verbose: false
  }),
  new CopyWebpackPlugin([ // 复制高度静态资源
    {
      context: pathConfig.static,
      from: '**/*',
      ignore: ['*.md']
    }
  ]),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
);

webpack(config, function (err, stats) {
  // show build info to console
  console.log(stats.toString({ chunks: false, color: true }));

  if (err) {
    console.error(err);
    process.exit(-1);
  }
  // save build info to file
  fs.writeFileSync(
    path.join(pathConfig.rootPath, 'dist', '__build_info__'),
    stats.toString({ color: false })
  );
});
