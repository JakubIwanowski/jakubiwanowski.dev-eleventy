---
meta:
    title: "A Beginner's Guide to Eleventy - part two"
    description: "Second part of a beginner's guide to eleventy"
date: 2023-01-20
dateDisplay: 20-01-2023
title: "A Beginner's Guide to Eleventy - part two"
slug: "eleventy-guide-part-two"
highlighter: true
excerpt: "Layouts and Sass in Eleventy"
stage: "Budding"
---

# A Beginner's Guide to Eleventy - part two

As I have said in [the previous part of our series](/garden/programming/eleventy-guide-part-one), we'll talk today about Sass and layouts. Pure CSS is great, but sometimes you may need/want to use some extra features of Sass, so here's how you do it!.

## Sass

In order to add scss files to your project you can either use built in functions, Eleventy supports Sass out of the box, or install one of the many plugins. You can check out [Eleventy's documentation about adding Sass support](https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy). In this guide we'll be using Kentaro Imai's plugin - [eleventy-sass](https://www.npmjs.com/package/eleventy-sass). It's just a matter of preference, Whatever option you'll choose, it'll be fine.

```bash
npm install eleventy-sass
```

```js
const eleventySass = require("eleventy-sass");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventySass);
};
```

This how your configuration in **.eleventy.js** should look like. I like to add PostCSS plugin to add some extra fromatting to my CSS files.

```bash
npm install postcss autoprefixer
```

and in the configuration file:

```js
const eleventySass = require("eleventy-sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventySass, {
    postcss: postcss([autoprefixer]),
  });
};
```

The plugin will detect our scss files and put them inside _\_site_ in respective folders, for example _assets/css/global.scss_ will end up in _\_site/assets/css/global.css_. The autoprefixer plugin will add prefixes to declarations that need them. Like I said before, there are a few ways you can configure your Sass processing. Only recently I had the following configuration:

```json
    "watch:sass": "npx sass assets/css:_site/assets/css/ --watch",
    "start": "npm run watch:eleventy & npm run watch:sass",
```

This is a snippet from my **package.json**, as you can see it is quite simple.

## Layouts

You don't want to write HTML for each of your posts or pages manually, this is where layouts come in. Layouts are stored in **\_includes** folder by default. You can also store them in subdirectories. If you want to change the default settings, you can do it following [Eleventy's docs](<https://www.11ty.dev/docs/config/#directory-for-layouts-(optional)>).
Let's create our first layout. Create file **postlayout.njk** in **\_includes** directory.
{% raw %}

```njk
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <meta name="description" content="{{description}}">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    {% include '_navigation.njk' %}
    <main>
       <div class="post-content container">
       <h1>{{title}}</h1>
        {{content | safe}}
       </div>
    </main>
</body>
</html>
```

{% endraw %}
As you can see it's almost plain ol'HTML, but there are some small differences. We're inserting title and description from each post into our template. _Content_ is our post content. We also add `safe` filter to prevent double-escaping. For example, if we didn't use the filter, tags, and special characters in general, like `<strong>` would be presented like this: `&lt;strong&gt;`. But how does Eleventy know what's the title or description? Front matter.

### Front matter{#front-matter}

In the previous part of the guide I didn't explain what front matter is, sooo.. front matter is our meta data. We can use it in out templates things like titles, descriptions, dates, and other useful things. You open and close it with three dashes: `---`.

```markdown
---
title: "Post title"
description: "Post description"
---

Some content
```

## Using layouts

So how do we tell Eleventy, we want use a given layout? We can do this using front matter:

```yaml
---
layout: postlayout.njk
title: "Page title"
---
```

You might ask: what if I don't want to set layout every time I write a new post? And that would be a very good question. Remember **\_posts.json** in **\_posts** folder?

```json
{
  "permalink": "/blog/{% raw %}{{ page.fileSlug }}{% endraw %}/index.html",
  "tags": ["posts"]
}
```

You can set here a layout which will be used for all posts, just like this:

```json
{
  "permalink": "/blog/eleventy-guide-part-one/index.html",
  "tags": ["posts"],
  "layout": "postslayout.njk"
}
```

## Limiting the number of post you want to display

Let's get back for a moment to our homepage, where we are displaying newest posts. If you don't want to show all posts that you have ever published, you can limit the loop to 3/4 etc. most recent posts.
{% raw %}

```njk
<ul class="post__list">
    {%- for post in collections.posts | reverse -%}
        {% if (loop.index <= 3) %}
            <li
            class="post__list__el"
            >
                <div class="post__date">
                    {{post.data.date}}
                </div>
                <a href="{{post.url}}">{{post.data.title}}</a>
                    {{post.data.excerpt}}
            </li>
        {% endif %}
            {%- endfor -%}
</ul>
```

{% endraw %}
The loop goes through the posts, in a reverse order, see `reverse` filter, and limits the output to three latest posts. You can provide a publication date in front matter, if you don't do that, file's (post's) creation date will be used instead.

## Wrapping up

We've learned how to use Sass in our Eleventy project, and how to use layouts. I hope you enjoyed it, and that this short guide will be helpful to someone. If you haven any comments you can reach me by mail. You can also find me on Mastodon: [@dzajew@fosstodon.org](https://fosstodon.org/@dzajew){target=\_blank}.
