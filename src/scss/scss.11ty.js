const fs = require('fs');
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');

module.exports = class {
  async data() {
    const scssDir = path.join(__dirname, '.');
    const rawFilepath = path.join(scssDir, 'styles.scss');

    return {
      permalink: `css/styles.css`,
      rawFilepath,
      rawScss: fs.readFileSync(rawFilepath),
      scssDir: scssDir
    };
  }

  async render({ scssDir, rawFilepath }) {
    var sassRenderResult = sass.renderSync({
      file: rawFilepath,
      includePaths: [scssDir],
    });
    
    const rawCss = sassRenderResult.css.toString();

    return await postcss([
        require('autoprefixer'),
        require('cssnano')])
      .process(rawCss)
      .then((result) => result.css);
  }
};