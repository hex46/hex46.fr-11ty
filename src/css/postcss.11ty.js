const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

module.exports = class {
  async data() {
    const cssDir = path.join(__dirname, '.');
    const rawFilepath = path.join(cssDir, 'styles.css');

    return {
      permalink: `css/styles.css`,
      rawFilepath,
      rawCss: fs.readFileSync(rawFilepath),
    };
  }

  async render({ rawCss, rawFilepath }) {
    return await postcss([
        require('autoprefixer'),
        require('cssnano')])
      .process(rawCss, { from: rawFilepath })
      .then((result) => result.css);
  }
};