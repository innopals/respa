#!/usr/bin/env node

// TODO resolve requiring target installed packages.
// hacking from https://gist.github.com/branneman/8048520#6-the-hack
process.env.NODE_PATH = "./node_modules";
require('module').Module._initPaths();

var path = require("path");

// Local version replace global one
try {
  var localRespa = require.resolve(path.join(process.cwd(), "node_modules", "respa", "bin", "respa.js"));
  if (__filename !== localRespa) {
    return require(localRespa);
  }
} catch (e) {
  console.error("Respa must be installed locally in order to make deps available.");
  process.exit(-1);
}

const argv = process.argv.slice(2);

// console.log(argv);
if (argv.length === 0 || argv[0] === 'dev') {
  return require("./respa-dev");
}

if (argv[0] === 'dist' || argv[0] === 'build' || argv[0] === 'build-production') {
  return require("./respa-prod");
}

if (argv[0] === 'build-test') {
  return require("./respa-test");
}

if (argv[0] === 'build-preview') {
  return require("./respa-preview");
}

console.error("Unknown command: respa", argv.join(' '));
process.exit(0);
