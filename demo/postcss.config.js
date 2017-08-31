const config = {
  plugins: {
    'postcss-import': {},
    "postcss-url": {},
    "postcss-browser-reporter": {},
    "postcss-reporter": {}
  }
};

if (process.env.NODE_ENV === 'production') {
  Object.assign(config.plugins, {
    "postcss-cssnext": {},
    // 'cssnano': {}, // compress
  })
}

module.exports = config;
