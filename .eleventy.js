const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const eleventySass = require("eleventy-sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const UpgradeHelper = require("@11ty/eleventy-upgrade-help");
module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(eleventySass, {
    postcss: postcss([autoprefixer])
  });
	eleventyConfig.setTemplateFormats("html,liquid,njk,md");
	eleventyConfig.addPassthroughCopy("assets/fonts");
	eleventyConfig.addPassthroughCopy("assets/images");
	  let options = {
		html: true,
		breaks: true,
		linkify: true
	  };
	  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAttrs));
	  eleventyConfig.addPlugin(pluginRss);
      eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(UpgradeHelper);
    eleventyConfig.addPassthroughCopy({
    '_redirects': '_redirects',
  });
	  return {
		"dataTemplateEngine": 'njk',
		"htmlTemplateEngine": "njk",
		"markdownTemplateEngine": "liquid"
	};
};
