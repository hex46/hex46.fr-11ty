// Replace link of /page/**
// Src: https://jec.fyi/blog/customizing-file-structure-urls-browsersync
module.exports = {
    permalink: "{{page.filePathStem | replace('/page/', '/')}}.html"
};