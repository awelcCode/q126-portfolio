module.exports = function (eleventyConfig) {
  // Tell Eleventy to pass these through to the final site
  eleventyConfig.addPassthroughCopy("./src/styleSheets");
  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPassthroughCopy("./src/scripts");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  return {
    dir: {
      input: "src",
      output: "_site", // This is the folder Netlify will eventually show
    },
  };
};
