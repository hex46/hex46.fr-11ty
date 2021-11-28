
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');

const generateHash = require('../libs/generate-hash');
const isProduction = require('../libs/is-production');

module.exports = class {

    async data() {
        const scssDir = path.join(__dirname, '.');
        const rawFilepath = path.join(scssDir, 'styles.scss');

        const rawCss = this.sassRender(rawFilepath, scssDir);
        const hash = generateHash(rawCss);
        const permalink = `/css/styles.${hash}.css`;

        return {
            permalink: permalink,
            rawCss: rawCss
        };
    }

    sassRender(rawFilepath, scssDir) {
        var sassRenderResult = sass.renderSync({
            file: rawFilepath,
            includePaths: [scssDir],
        });

        return sassRenderResult.css.toString();
    }

    async render({ rawCss }) {
        
        let postcssPlugin = []
        if (isProduction())
            postcssPlugin = [require('autoprefixer'), require('cssnano')];

        return await postcss(postcssPlugin)
            .process(rawCss)
            .then((result) => result.css);
    }
};