---
meta:
    title: "A Beginner's Guide to Eleventy - part one"
    description: "First part of a beginner's guide to eleventy"
date: 2023-01-09
dateDisplay: 09-01-2023
title: "A Beginner's Guide to Eleventy - part one"
slug: "eleventy-guide-part-one"
highlighter: true
excerpt: "The first part of my beginner's guide to Eleventy"
---

#  A Beginner's Guide to Eleventy - part one
Recently I've moved my blog from Remix to Eleventy. I really like Remix, and I think it's a great tool but it felt like an overkill for a simple site like this.

Eleventy is a static site generator (SSG), which means that it generates a website at build time, static files are uploaded to a hosting, and served to users. Setting up an eleventy site is quite easy, but I missed a step by step instruction, which would take me through basic setup, hence the guide. It'll be divided into a few parts, how many, I don't know yet. Let's get down to business.

First, we start with **npm init** to start our project 
```bash
npm init -y
```
Then we install Eleventy
```bash
npm install --save-dev @11ty/eleventy
```
To run our project type:
```bash
npx @11ty/eleventy
```
This command will build our website. If we want to rerun build process everytime we save a file, we should run:
```bash
npx @11ty/eleventy --serve
```
Our project is ready for development, but we still need to add some content. Eleventy lets us choose one from many templating languages out of the box: HTML, Markdown, WebC, JavaScript, Liquid, Nunjucks (my personal choice), Handlebars, Mustache, EJS, Haml, Pug. You can use a custom language of your choice as well!

## Adding content
```html
<!DOCTYPE HTML>
<html lang="en">
<head>
	<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title></title>
</head>
<body>
<main>
<h1>
My awesome website
</h1>
<p>
A paragraph
</p>
</main>
</body>
</html>
```
Add index.njk to your root folder. Eleventy will generate your webiste in **_site** folder.
For now the output page doesn't differ much from our source file. Let's add some magic to it. Create **_data** folder and **navigation.json** inside it.
```json
[
    {
        "label": "Home",
        "href": "/"
    },
    {
        "label": "Blog",
        "href": "/blog/"
    },
    {
        "label": "Contact",
        "href": "mailto:your-mail@example.com"
    },
    {
        "label": "RSS",
        "href": "/path/to/rss-feed"
    }
]
```
Our data is ready to be used. Let's create **_navigation.njk** in **_includes** folder, which holds our layouts and template parts
{% raw %}
```njk
<header>
      <nav>
        <ul>
  {%- for nav in navigation -%} 
          {% set regExp = r/\b(blog)\b/i %}
  <li>
    <a href="{{ nav.href }}" class="{% if page.url == nav.href or (regExp.test(page.url) === true and nav.href === '/blog/') %}active{% endif %}">{{ nav.label }}</a>
  </li>  
  {%- endfor -%}
        </ul>
      </nav>
</header>
```
{% endraw %}
What we're doing here is taking navigation data from **_data** folder and looping through the array to generate our navigation. If the url of an element matches our current address, we add 'active' class. I've also added a regex, to check if we're somewhere inside *blog* directory. If yes, we also add 'active' class. 

{% raw %}
```njk
<!DOCTYPE HTML>
<html lang="en">
<head>
	<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title></title>
</head>
<body>
    {% include '_navigation.njk' %}
<main>
<h1>
My awesome website
</h1>
<p>
A paragraph
</p>
</main>
</body>
</html>
```
{% endraw %} 
Now we have navigation on our home page, great. If we're creating a blog, some posts would be nice. There are a few ways of fetching data in Eleventy. For now, I'd like to focus on some basic setup. Create **_posts** folder. Create two or three sample posts inside it:
```yaml
---
date: 2022-11-10
title: 'Example post'
excerpt: 'Example excerpt'
---
```
Add ***_posts.json*** to our folder holding posts:
```json
{
  "permalink": "/blog/{{ page.fileSlug }}/index.html",
  "tags": ["posts"]
}
```
"permalink" tells Eleventy where output files should placed. In this case it's: */blog/file-slug/index.html*. If a post file is named **my-first-post&period;md**, the output will be: */blog/my-first-post/index.html*. "tags" field assigns files to collections. One file can belong to more than one collection. That's how we can list our posts anywhere we want. Now let's fetch them on our homepage, in index.njk:
{% raw %}
```njk
<!DOCTYPE HTML>
<html lang="en">
<head>
	<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title></title>
</head>
<body>
    {% include '_navigation.njk' %}
<main>
<h1>
My awesome website
</h1>
<p>
A paragraph
</p>
            <ul>
                {%- for post in collections.posts | reverse -%}
                            <li>
                                <a href="{{post.url}}">{{post.data.title}}</a>
                               {{post.data.excerpt}}
                            </li>
                {%- endfor -%}
            </ul>
</main>
</body>
</html>
```
{% endraw %}
We're looping through our posts, and showing title, excerpt, and we add link to each post.
Let's add some styling. Create **style.css** and **.eleventy.js** in the root folder. The dotfile is Eleventy configuration file. We'll use it to copy CSS file from development to production build:
```js
module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("style.css");
};
```
You may need to restart serve command in order to see the changes.
Just add link to the stylesheet in the `<head>`
```html
<link rel="stylesheet" href="style.css">
```
And that's all for today. In next parts I'll discuss adding layouts and Sass to our blog. Hopefully, what I wrote, and will write, will be helpful to someone. Do you have comments or suggestions? Feel free to send me an email (my address is in the navigation). You can also find me on Mastodon: **@dzajew@fosstodon.org**.
