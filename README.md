# respa v0.1.0

Respa is a React/Redux based SPA framework, which has already made the hard choices for you and you can keep your code base extremely clean.

The document is working on progress, you can refer to the demo, we'll add more examples later.

If you're interested in this project please tell me: i@bestmike007.com

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

To start the hot reload dev server:

``` bash
# if installed globally: npm install -g respa
webapp$ respa
# or
webapp$ respa dev
# or installed locally: yarn add respa
webapp$ ./node_modules/.bin/respa
# or use npx
webapp$ npx respa
```

To build for production:

``` bash
# if installed globally: npm install -g respa
webapp$ respa build
# or
webapp$ respa dist
# or installed locally: yarn add respa
webapp$ ./node_modules/.bin/respa build
# or use npx
webapp$ npx respa build
```
