var path = require('path'),
  fs = require('fs'),
  webpack = require('webpack'),
  CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin');
var pathConfig = require("./path-config");
var respa_config = {};
try {
  respa_config = require(path.join(process.cwd(), ".respa"));
} catch (e) { }

var envs = {}, env = pathConfig.env;
Object.keys(process.env).forEach(k => envs[k] = JSON.stringify(process.env[k]));

var config = {
  node: {
    __filename: env !== 'production' // Allow use of __filename in modules, based on context
  },
  entry: {
    app: path.join(__dirname, "../websrc/app.js"),
    vendor: [
      'history',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux'
    ]
  },
  output: {
    path: pathConfig.dist,
    publicPath: process.env.ASSET_BASE_URL || pathConfig.contextPath + (pathConfig.contextPath.endsWith("/") ? "static/" : "/static/")
  },
  externals: {
    'react': 'React',
    'react-dom': "ReactDOM"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      "respa": path.join(__dirname, '..'),
      "WEBROOT": pathConfig.src,
      "REDUCERS": path.join(pathConfig.src, "reducers"),
      "ACTION": path.join(pathConfig.src, "actions"),
      "ACTIONS": path.join(pathConfig.src, "actions"),
      "ASSETS": path.join(pathConfig.src, "assets"),
      "UTILS": path.join(pathConfig.src, "utils")
    }
  },
  resolveLoader: {
    modules: ['node_modules', path.join(pathConfig.rootPath, "node_modules")]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        include: [path.join(process.cwd(), "node_modules/respa"), path.join(__dirname, '..')],
        use: [{
          loader: 'babel-loader',
          options: {
            retainLines: process.env.NODE_ENV !== 'production',
            cacheDirectory: process.env.NODE_ENV !== 'production',
            presets: [
              'env',
              'react'
            ],
            plugins: [
              ['transform-runtime', {
                'helpers': false, // defaults to true 
                'polyfill': false, // defaults to true 
                'regenerator': true, // defaults to true 
                'moduleName': 'babel-runtime' // defaults to "babel-runtime" 
              }],
              ['transform-object-rest-spread', { 'useBuiltIns': true }],
              ['syntax-dynamic-import'],
              ['transform-class-properties']
            ]
          }
        }]
      },
      {
        test: /\.less$/,
        exclude: [/theme.less/, /node_modules/],
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader'
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      }, {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240, // 10KB 以下使用 base64
            name: 'img/[name]-[hash:6].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ names: ['vendor'] }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 100000
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: pathConfig.indexPage
    }),
    new webpack.DefinePlugin({
      'process.env': envs,
      __CONTEXT_PATH__: JSON.stringify(pathConfig.contextPath),
      __DEV__: env === 'development',
      __TEST__: env === 'test',
      __ALPHA__: env === 'alpha',
      __PROD__: env === 'production',
      __COMPONENT_DEVTOOLS__: false,
      __WHY_DID_YOU_UPDATE__: false,
      __APP_DOM_ID__: respa_config.renderDomId ? JSON.stringify(respa_config.renderDomId) : false,
      __PREBOOT_SCRIPT__: fs.existsSync(path.join(pathConfig.src, 'preboot.js')) ? JSON.stringify(path.join(pathConfig.src, 'preboot.js')) : false
    })
  ]
};

try {
  var DashboardPlugin = require('webpack-dashboard/plugin');
  config.plugins.shift(new DashboardPlugin());
} catch (e) { }

try {
  require("sass-loader");
  var ExtractTextPlugin = require('extract-text-webpack-plugin');
  config.module.rules.push({
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'sass-loader'],
    }),
  });
} catch (e) { }

module.exports = config;
