const fs = require('fs')
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");
const mila = require("markdown-it-link-attributes");

// Plugins 11ty
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// Custom
const imageShortcode = require("./src/libs/image-shortcode");

module.exports = function(eleventyConfig) {

    // Project architecture
    const dir = {
        input: "src",
        includes: "includes",
        data: "data", // default value
        output: "output", // default value
        posts: "pages/posts"
    }

    // Configuration
    const config = {
        dir: { ...dir },
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk'
    }

    // Constants
    const environment = process.env.ELEVENTY_ENV;
    const isProd = environment === "prod";

    // Static files
    eleventyConfig.addPassthroughCopy(`${dir.input}/.htaccess`);
    eleventyConfig.addPassthroughCopy(`${dir.input}/robots.txt`);
    eleventyConfig.addPassthroughCopy(`${dir.input}/img/`);

    // Add watcher
    eleventyConfig.addWatchTarget(`${dir.input}/scss/`);
    eleventyConfig.addWatchTarget(`${dir.input}/js/`);
    eleventyConfig.addWatchTarget(`${dir.input}/img/`);

    // Get all elements in /posts
    // I don't use tags because I want to use it for taxonomies
    eleventyConfig.addCollection("postList", function (collection) {
        return collection.getFilteredByGlob(`./${dir.input}/${dir.posts}/**/*.md`);
    });

    // Tags list
    // Src: https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
    eleventyConfig.addCollection("tagList", function (collection) {
        let tagSet = new Set();

        collection.getAll().forEach(item => {
            (item.data.tags || []).forEach(tag => tagSet.add(tag));
        });

        return [...tagSet].sort();
    });

    // Filters
    eleventyConfig.addFilter("localdate", function(value) {
        const date = new Date(value);
        return date.toLocaleString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' });
    });
    eleventyConfig.addFilter("limit", function(array, limit) {
        return array.slice(0, limit);
    });
    eleventyConfig.addFilter("byTag", function(postList, tag) {
        let filteredArray = (postList || []).filter(post => {
            const tags = (post.data.tags || []);
            return tags.includes(tag);
        });
        return filteredArray;
    });

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
              const content_404 = fs.readFileSync(`${dir.output}/404/index.html`);
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

    // Plugins
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(syntaxHighlight);

    // Shortcode
    // Note : Markdown files are pre-processed as Liquid templates by default.
    // src : https://www.11ty.dev/docs/shortcodes/#shortcodes
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode(dir));
    eleventyConfig.addLiquidShortcode("image", imageShortcode(dir));

    return config;
};