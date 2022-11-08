const markdownIt = require("markdown-it");
const pluginRss = require("@11ty/eleventy-plugin-rss");
module.exports = function(eleventyConfig) {
	eleventyConfig.setBrowserSyncConfig({
		files: './_site/assets/css/**/*.css'
	});
	eleventyConfig.setTemplateFormats("html,liquid,njk,md");
	eleventyConfig.addPassthroughCopy("assets/fonts");
	eleventyConfig.addPassthroughCopy("assets/images");
	eleventyConfig.addCollection("posts", function(collectionApi) {
		return collectionApi.getFilteredByGlob("./_posts/*.md");
	  });
	  let options = {
		html: true,
		breaks: true,
		linkify: true
	  };
	
	  eleventyConfig.setLibrary("md", markdownIt(options));
	  eleventyConfig.addPlugin(pluginRss);
	  
	  return {
		"dataTemplateEngine": 'njk',
		"htmlTemplateEngine": "njk",
		"markdownTemplateEngine": "liquid"
	};
};