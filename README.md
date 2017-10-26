# respa v0.1.12

<span class="badge-npmversion"><a href="https://npmjs.org/package/respa" title="View this project on NPM"><img src="https://img.shields.io/npm/v/respa.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/respa" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/respa.svg" alt="NPM downloads" /></a></span>

Respa is a React/Redux based SPA framework, which has already made the hard choices for you and you can keep your code base extremely clean.

The document is WIP, you can refer to the demo, we'll add more examples later. To run the demo:

``` bash
respa$ cd demo
demo$ yarn install
demo$ yarn respa
demo$ yarn respa dist # build for production
```

If you're interested in this project please tell me: i@bestmike007.com

## TODO list

We aim to make respa a production-ready scaffold, maybe more than a scaffold. We'll use it internally before a public release (or never); you're welcome to give it a try and let us know your ideas.

+ [x] React + Redux + webpack
+ [x] Choose from react/preact, less/sass, style-loader/extract-text-plugin by installing in guest app
+ [x] Support global (theme) css styles along with component styles using css-module with BEM classnames
+ [x] Postcss-loader with guest config
+ [x] Action generator to avoid action name conflicts and to reduce bundle size
+ [x] Generate root reducer from a tree like reducer definition
+ [x] Configurable view loader for react component code splitting
+ [x] Latest react-router and history api integration (But I don't like it, might use another solution for this)
+ [ ] Rewrite this whole thing using typescript, and let guest app to choose which version (typescript/esm) to build from
+ [ ] I18n solution
+ [ ] Unit test solution
+ [ ] Docs and project site

## Respa Project Structure

Asuming that `webapp` is your code base root. These files are used by respa framework:

<pre>
webapp/src/
├── index.html   -> the index page template.
├── preboot.js   -> An optional pre-boot script, before the react app is loaded, e.g. login redirect, pre-load user info or app config, etc.
├── actions/     -> all actions created using `respa/createAction`
├── reducers/
│   └── index.js -> export the pre-defined reducer tree.
└── views/
    └── index.js -> the App container including Routes.
</pre>

## Use Respa

Respa must be installed locally in order to make dependencies available.

``` bash
webapp$ yarn add respa
```

To start the hot reload dev server:

``` bash
webapp$ yarn respa # or npx
```

To build for production:

``` bash
webapp$ yarn respa build
# or
webapp$ yarn respa dist
```
