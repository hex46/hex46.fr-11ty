const fs = require('fs');
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');

const generateHash = require('../lib/generateHash');

module.exports = class SCSSBuild {

    // Cache raw CSS & output path
    static rawCss;
    static permalink;

    async data() {
        if (!SCSSBuild.rawCss || !SCSSBuild.permalink) {
            const scssDir = path.join(__dirname, '.');
            const rawFilepath = path.join(scssDir, 'styles.scss');

            SCSSBuild.rawCss = this.sassRender(rawFilepath, scssDir);
            const hash = generateHash('styles', SCSSBuild.rawCss);
            SCSSBuild.permalink = `css/styles.${hash}.css`;
        }

        return {
            permalink: SCSSBuild.permalink,
            rawCss: SCSSBuild.rawCss
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