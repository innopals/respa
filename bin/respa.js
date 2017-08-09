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
} catch (e) { }

const argv = process.argv.slice(2);

// console.log(argv);
if (argv.length === 0 || argv[0] === 'dev') {
	return require("./respa-dev");
}

if (argv[0] === 'dist' || argv[0] === 'build') {
	return require("./respa-prod");
}
