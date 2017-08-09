var path = require('path');
var respa_config = {};
try {
  respa_config = require(path.join(process.cwd(), ".respa"));
} catch (e) { }
var contextPath = respa_config.contextPath || "/";
if (!contextPath.endsWith('/')) contextPath = contextPath + '/';
var rootPath = process.cwd(), // 项目根目录
  srcDir = path.join(rootPath, 'src'), // 开发源码目录
  staticDir = path.join(rootPath, 'static'),
  env = (process.env.NODE_ENV || "").trim(); // 当前环境

module.exports = {
  rootPath: rootPath,
  contextPath: contextPath,
  src: srcDir,
  dist: path.join(rootPath, 'dist', contextPath), // build 后输出目录
  indexPage: path.join(srcDir, respa_config.indexPage || 'index.html'), // 入口基页
  static: staticDir,
  env: env
}