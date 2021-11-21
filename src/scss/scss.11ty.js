const fs = require('fs');
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');

const generateHash = require('../libs/generate-hash');

module.exports = class SCSSBuild {

    async data() {
        const scssDir = path.join(__dirname, '.');
        const rawFilepath = path.join(scssDir, 'styles.scss');

        const rawCss = this.sassRender(rawFilepath, scssDir);
        const hash = generateHash('styles', rawCss);
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
        return await postcss([
            require('autoprefixer'),
            require('cssnano')])
        .process(rawCss)
        .then((result) => result.css);
    }
};