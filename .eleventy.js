const fs = require('fs')
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");
const mila = require("markdown-it-link-attributes");

module.exports = function(eleventyConfig) {

    // Project architecture
    const dir = {
        input: "src",
        includes: "includes",
        data: "data", // default value
        output: "output" // default value
    }

    // Configuration
    const config = {
        dir: { ...dir },
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk'
    }

    // Some constants
    const environment = process.env.ELEVENTY_ENV;
    const isProd = environment === "prod";

    // Some static files
    eleventyConfig.addPassthroughCopy(`${dir.input}/.htaccess`);
    eleventyConfig.addPassthroughCopy(`${dir.input}/robots.txt`);
    eleventyConfig.addPassthroughCopy(`${dir.input}/img/`);

    // Add watcher
    eleventyConfig.addWatchTarget(`${dir.input}/css/`);
    eleventyConfig.addWatchTarget(`${dir.input}/js/`);
    eleventyConfig.addWatchTarget(`${dir.input}/img/`);

    // Markdown configuration
    // Src : https://github.com/11ty/eleventy/issues/563
    const markdownItOptions = {
      html: true
    };

    const milaOptions = {
        pattern: /^(https|http).*$/gm,
        attrs: {
            target: "_blank",
            rel: "noopener noreferrer"
        }
    };

    let markdownLib = markdownIt(markdownItOptions).use(mila, milaOptions);
    eleventyConfig.setLibrary("md", markdownLib);
  
    // 404
    // src : https://www.11ty.dev/docs/quicktips/not-found/
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
          ready: function(err, bs) {    
            bs.addMiddleware("*", (req, res) => {
              const content_404 = fs.readFileSync(`${dir.output}/404.html`);
              // Add 404 http status code in request header.
              res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
              // Provides the 404 content without redirect.
              res.write(content_404);
              res.end();
            });
          }
        }
    });

    // HTML minify
    // https://www.11ty.dev/docs/config/#transforms-example-minify-html-output
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
        if(isProd && outputPath && outputPath.endsWith(".html")) {
          let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true
          });
          return minified;
        }    
        return content;
    });

    return config;
};