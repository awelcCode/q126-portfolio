module.exports = function (eleventyConfig) {
  // 1. Copy static assets to the output folder (_site)
  eleventyConfig.addPassthroughCopy("src/styleSheets");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/scripts");

  // 2. Configure the directory structure
  return {
    dir: {
      input: "src", // Everything Eleventy processes is in 'src'
      includes: "_includes", // Look for layouts in 'src/_includes'
      data: "_data", // Look for global data in 'src/_data'
      output: "_site", // Build the final site into '_site'
    },
    // Optional: Set default template engine to HTML
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
