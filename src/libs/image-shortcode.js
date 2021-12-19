const Image = require("@11ty/eleventy-img");

// Src : https://www.11ty.dev/docs/plugins/image/
module.exports = (dir) => {
    return async function imageShortcode(src, alt, cls, sizes) {
        let metadata = await Image(src, {
          widths: [null],
          formats: ["jpeg"],
          outputDir: `./${dir.output}/img/`
        });

        let imageAttributes = {
            class: cls,
            alt,
            sizes,
            loading: "lazy",
            decoding: "async",
        };

        // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
        return Image.generateHTML(metadata, imageAttributes);
      }
}