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

// detect guest app installed plugins & rules.
var ExtractTextPlugin, useLessLoader, useSassLoader, usePostCss, useHtmlLoader = null;
if (fs.existsSync(path.join(pathConfig.rootPath, "node_modules", "extract-text-webpack-plugin"))) {
  ExtractTextPlugin = require('extract-text-webpack-plugin');
}
useLessLoader = fs.existsSync(path.join(pathConfig.rootPath, "node_modules", "less-loader"));
useSassLoader = fs.existsSync(path.join(pathConfig.rootPath, "node_modules", "sass-loader"));
usePostCss = fs.existsSync(path.join(pathConfig.rootPath, "node_modules", "postcss-loader"));
useHtmlLoader = fs.existsSync(path.join(pathConfig.rootPath, "node_modules", "html-loader"));

var envs = {}, env = pathConfig.env;
Object.keys(process.env).forEach(k => envs[k] = JSON.stringify(process.env[k]));

var config = {
  node: {
    __filename: env !== 'production' // Allow use of __filename in modules, based on context
  },
  entry: {
    app: path.join(__dirname, "../websrc/app.js")
  },
  output: {
    jsonpFunction: 'lm',
    path: path.join(pathConfig.dist, 'static'),
    publicPath: process.env.ASSET_BASE_URL || pathConfig.contextPath + (pathConfig.contextPath.endsWith("/") ? "static/" : "/static/")
  },
  recordsOutputPath: path.join(pathConfig.rootPath, 'dist', '.modules.json'),
  externals: {
    'react': 'React',
    'react-dom': "ReactDOM"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      "respa": path.join(__dirname, '..'),
      "redux-logger": path.join(pathConfig.rootPath, "node_modules", "redux-logger"),
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
        exclude: /node_modules(?!\/respa)/,
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
              ['transform-class-properties'],
              ["transform-react-jsx", {
                "pragma": "h"
              }]
            ]
          }
        }]
      }, {
        test: /\.(png|jpe?g|gif|svg|webp|docx?|xlsx?|zip|7z)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]-[hash:6].[ext]',
            outputPath: 'assets/'
          }
        }
      }
    ]
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.ProvidePlugin({
      'h': 'respa/h'
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: respa_config.minChunkSize || 100000
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: pathConfig.indexPage
    }),
    new webpack.DefinePlugin({
      'process.env': envs,
      __CONTEXT_PATH__: JSON.stringify(pathConfig.contextPath),
      __USE_PREACT__: fs.existsSync(path.join(pathConfig.rootPath, "node_modules", "preact")),
      __APP_DOM_ID__: respa_config.renderDomId ? JSON.stringify(respa_config.renderDomId) : false,
      __PREBOOT_SCRIPT__: fs.existsSync(path.join(pathConfig.src, 'preboot.js')) ? JSON.stringify(path.join(pathConfig.src, 'preboot.js')) : false
    })
  ]
};

if (Array.isArray(respa_config.commonsChunk)) {
  config.entry.vendors = respa_config.commonsChunk;
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: ['vendors'] }));
}

try {
  var DashboardPlugin = require('webpack-dashboard/plugin');
  config.plugins.shift(new DashboardPlugin());
} catch (e) { }

function applyCssLoaderFor(ext, loader) {
  var cssLoaders = [{
    loader: 'css-loader', options: {
      importLoaders: 1,
      sourceMap: process.env.NODE_ENV !== 'production',
      minimize: process.env.NODE_ENV === 'production'
    }
  }];
  var cssModuleLoaders = [{
    loader: 'css-loader', options: {
      importLoaders: 1,
      sourceMap: process.env.NODE_ENV !== 'production',
      minimize: process.env.NODE_ENV === 'production',
      modules: true,
      localIdentName: '[name]_[local]--[hash:base64:5]'
    }
  }];
  if (usePostCss) {
    if (!fs.existsSync(path.join(pathConfig.rootPath, "postcss.config.js"))) {
      console.info("Error configuring postcss loader: You have to add postcss.config.js to your project and add required dependencies.");
      process.exit(0);
    }
    cssLoaders.push('postcss-loader');
    cssModuleLoaders.push('postcss-loader');
  }
  cssLoaders.push(loader);
  cssModuleLoaders.push(loader);
  if (ExtractTextPlugin) {
    cssLoaders = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: cssLoaders
    });
  } else {
    cssLoaders.unshift('style-loader');
  }
  cssModuleLoaders.unshift('style-loader');
  config.module.rules.unshift({
    test: ext,
    include: /src\/(components|views|layouts)/,
    use: cssModuleLoaders
  });
  config.module.rules.unshift({
    test: ext,
    exclude: /src\/(components|views|layouts)/,
    use: cssLoaders
  });
}

if (useHtmlLoader) {
  config.module.rules.unshift({
    test: /\.html$/,
    use: {
      loader: 'html-loader'
    }
  });
}
if (useSassLoader) {
  applyCssLoaderFor(/\.scss$/, 'sass-loader');
}
if (useLessLoader) {
  applyCssLoaderFor(/\.less$/, 'less-loader');
}
if (ExtractTextPlugin) {
  config.plugins.push(
    new ExtractTextPlugin('[name].[hash:6].css')
  );
}

if (fs.existsSync(path.join(pathConfig.rootPath, "node_modules", "preact"))) {
  delete config.externals["react"];
  delete config.externals["react-dom"];
  config.resolve.alias["react"] = config.resolve.alias["react-dom"] = path.join(pathConfig.rootPath, "node_modules", "preact-compat");
}

if (typeof respa_config.postWebpackConfig === 'function') {
  respa_config.postWebpackConfig(config);
}

module.exports = config;
