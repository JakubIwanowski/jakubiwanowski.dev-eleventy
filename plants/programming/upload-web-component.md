---
meta:
  title: "File Upload Web Component"
  description: "Where I try myself at web components art."
date: 2023-11-19
dateDisplay: 19-11-2023
title: "File Upload Web Component"
highlighter: true
excerpt: "Where I try myself at web components art."
---

# File Upload Web Component

I've noticed that a lot of people in my Mastodon feed have been talking about web components recently. To mention just a few:

- [Zach Leatherman has a couple of posts](https://www.zachleat.com/web/?category=web-components)
- [HTML Web Components are Just JavaScript?](https://www.oddbird.net/2023/11/17/components/) by Miriam Suzanne
- [Jim Nielsen's posts about web components](https://blog.jim-nielsen.com/tags/#webComponents)
- [Blinded By the Light DOM](https://meyerweb.com/eric/thoughts/2023/11/01/blinded-by-the-light-dom/) by Eric Meyer
- [And Robin Rendel writes about web components too](https://buttondown.email/cascade/archive/005-why-web-components/)

I'be heard about web components before, but I didn't have chance to use them in my work, so I wanted to check, what can be built with them. I decided to go with a file upload component, that has a file preview. Here's HTML markup:

```html
<custom-upload maxsize="1000000" nojs>
  <div class="file">
    <label for="file"> Upload your profile picture </label>
    <input type="file" name="file" id="file" />
  </div>
  <p class="error"></p>
  <p class="file-name"></p>
  <img src="" alt="" class="preview" />
</custom-upload>
```

Our custom element tag has two attributes set at start: `maxsize`, and `nojs`. I'll talk more about them later. `.file ` holds label and input, the main parts of the component. `.error` is where we'll display errors if something goes wrong, while uploading a file; `.preview`, here we'll display our image before uploading it to a server. Now let's discuss the styling.

```css
custom-upload {
  display: block;
  margin: 0 auto;
  --radius: 8px;
  font-size: 1rem;
}
.file {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 0 auto;
  position: relative;
  width: max(10em, 20vmin);
  height: max(10em, 20vmin);
}
label[for="file"] {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #9bb5f3;
  color: #000000;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  border-radius: var(--radius);
  font-size: 1.2em;
}
label[for="file"]:hover {
  background-color: #6fe594;
}
custom-upload[nojs] label {
  position: relative;
}
input[type="file"] {
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
}
input[type="file"]:focus {
  outline: 2px solid #000;
}
.preview {
  max-width: 100%;
  margin: 1em auto 0;
}
.file-name {
  padding: 10px 0;
  font-size: 1em;
  line-height: 1.2;
}
.file-name:empty {
  display: none;
}
.error {
  padding: 10px 0;
  color: red;
  font-size: 1em;
  line-height: 1.2;
}
.error:empty {
  display: none;
}
```

Just some basic styles. We hide the input behind the label, but we still want to show user, if the input is in a focused state.

```css
custom-upload[nojs] label {
  position: relative;
}
```

If the user turns off JavaScript, or JS fails to load/work for some reason, we want to show our input. The neat part in web components is that you can use custom tags, and standard HTML tags will load just normally, if we don't use JS to show them.

```js
class CustomUpload extends HTMLElement {
  static observedAttributes = ["imagesrc", "filename", "error"];
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.img = this.querySelector("img");
    this.filename = this.querySelector(".file-name");
    this.error = this.querySelector(".error");
    this.maxSize = this.getAttribute("maxsize");
    this.mappedAttributes = {
      imagesrc: {
        default: "",
        target: {
          name: this.img,
          innerHTML: false,
          attribute: "src",
        },
      },
      filename: {
        default: "",
        target: {
          name: this.filename,
          innerHTML: true,
        },
      },
      error: {
        default: "",
        target: {
          name: this.error,
          innerHTML: true,
        },
      },
    };
  }
  connectedCallback() {
    this.removeAttribute("nojs");
    this.input.addEventListener("change", (e) => {
      this.setAttribute("error", "");
      const files = e.target.files;
      const isValid = this.validate(files);
      if (isValid) {
        this.onUpload(files);
      }
    });
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.mappedAttributes[name]) {
      const mapped = this.mappedAttributes[name];
      const target = mapped.target.name;

      mapped.target?.innerHTML
        ? (target.innerHTML = newValue)
        : target.setAttribute(mapped.target.attribute, newValue);
    }
  }
  onUpload(files) {
    const imageSrc = URL.createObjectURL(files[0]);
    const fileName = files[0].name;
    this.setAttribute("filename", "Uploaded file: " + fileName);
    this.setAttribute("imagesrc", imageSrc);
  }
  validate(files) {
    const file = files[0];
    if (file.size > this.maxSize) {
      this.setAttribute("error", "File's weight shouldn't exceed 1 MB");
      return false;
    }
    return true;
  }
}
customElements.define("custom-upload", CustomUpload);
```

We define observable attributes in `static observedAttributes = ["imagesrc", "label","error"];`. Later, we assign HTML elements to class fields. Then, we define a `mappedAttributes` field, which will be helpful in updating our component. Web components have different lifecylce callbacks, they're quite nicely described on [MDN's website](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). In this example, we'll be using `connectedCallback()`, which is run, when a component is added to the document, and `attributeChangedCallback()`, fired when one of the observedAttributes changes.

In the connectedCallback we remove `nojs` attribute, so our component is still usable, if JavaScript fails us. Then, we add onchange event listener to our input. First, we validate the file with `validate()` method, and only if file's weight doesn't exceed the value set in `maxsize` attriubte, we handle the upload with `onUpload()` method, set previews source, and display uploaded file's name. But how do we update and pass component's attributes to HTML elements?

`attributeChangedCallback()` fires whenever one of the attributes in `observedAttributes` changes. It takes three arguments: name of the changed attribute, attribute's old value, and attribute's new value. Inside the callback define, what we want to do with these values. Since I'm a lazy potato, I wanted to simplify the process, or at least make it automated.

```js
this.mappedAttributes = {
  imagesrc: {
    default: "",
    target: {
      name: this.img,
      innerHTML: false,
      attribute: "src",
    },
  },
  filename: {
    default: "",
    target: {
      name: this.filename,
      innerHTML: true,
    },
  },
  error: {
    default: "",
    target: {
      name: this.error,
      innerHTML: true,
    },
  },
};
```

`mappedAttributes` is an object holding observed attributes, and target HTML elements, which should change if one of the attributes changes. It also holds information whether we should update target's innerHTML/attribute.

```js
if (this.mappedAttributes[name]) {
  const mapped = this.mappedAttributes[name];
  const target = mapped.target.name;

  mapped.target?.innerHTML
    ? (target.innerHTML = newValue)
    : target.setAttribute(mapped.target.attribute, newValue);
}
```

First, we check if a given attribute is mapped, if yes, we get the target element, in this case I assigned targets to class fields. If `target.innerHTML` is set to true, we update HTML element's innerHTML, otherwise, we update element's attribute. Here's the finished component:

<custom-upload maxsize="1000000" nojs>

 <div class="file">
   <label for="file">
     Upload your profile picture
   </label>
   <input type="file" name="file" id="file">
 </div>
  <p class="error"></p>
  <p class="file-name"></p>
    <img src="" alt="" class="preview">
 </custom-upload>

And that's it. If we wanted to use it in production, we'd have to tweak the styles, probably connect the component to a form etc. If you want to read more about web components, I'd recommend one of the links mentioned at the beginning of this post, MDN pages, or [HTML with Superpowers website](https://htmlwithsuperpowers.netlify.app/). If you want to play with the File Upload Component, [here's a Codepen link](https://codepen.io/dzajew/pen/QWYQOvq).

Comments? Feel free to [contact me](/contact).

<style>
custom-upload {
display:block;
margin: 0 auto;
--radius: 8px;
font-size: 1rem;
}
.file {
display:flex;
flex-direction: column;
gap:1em;
margin:0 auto;
position:relative;
width:max(10em,20vmin);
height:max(10em,20vmin);
  }
label[for="file"] {
position: absolute;
left:0;
top:0;
width:100%;
height:100%;
background-color: #9BB5F3;
color:#000000;
text-align:center;
display:flex;
justify-content:center;
align-items:center;
padding:0 10px;
cursor:pointer;
border-radius: var(--radius);
font-size: 1.2em;
}
label[for="file"]:hover {
background-color: #6FE594;
}
custom-upload[nojs] label {
position: relative;
}
input[type="file"] {
width:100%;
height:100%;
border-radius: var(--radius);
}
input[type="file"]:focus {
outline: 2px solid #000;
}
.preview {
max-width:100%;
margin: 1em auto 0;
}
.file-name {
  padding: 10px 0;
  font-size: 1em;
  line-height:1.2;
}
.file-name:empty {
  display: none;
}
.error {
padding: 10px 0;
color: red;
font-size: 1em;
line-height: 1.2;
}
.error:empty {
display: none;
}
</style>

<script>
class CustomUpload extends HTMLElement {
  static observedAttributes = ["imagesrc", "filename","error"];
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.img = this.querySelector("img");
    this.filename = this.querySelector(".file-name");
    this.error = this.querySelector(".error");
    this.maxSize = this.getAttribute("maxsize");
    this.mappedAttributes = {
      imagesrc : {
        default: '',
        target: {
          name: this.img,
          innerHTML: false,
          attribute: 'src'
        }
      },
      filename : {
        default: '',
        target: {
          name: this.filename,
          innerHTML: true,
        }
      },
      error : {
        default: '',
        target: {
          name: this.error,
          innerHTML: true,
        }
      },
    } 
  }
  connectedCallback() {
    this.removeAttribute("nojs");
    this.input.addEventListener('change',(e)=>{
      this.setAttribute('error', '');
      const files = e.target.files
      const isValid = this.validate(files);
      if(isValid) {
        this.onUpload(files);  
      }
    })
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if(this.mappedAttributes[name]) {

      const mapped = this.mappedAttributes[name];
      const target = mapped.target.name;

      mapped.target?.innerHTML ? target.innerHTML = newValue : target.setAttribute(mapped.target.attribute, newValue);
    }
  }
  onUpload(files) {
    const imageSrc = URL.createObjectURL(files[0]);
    const fileName = files[0].name;
    this.setAttribute('filename', "Uploaded file: " + fileName);
    this.setAttribute('imagesrc',imageSrc);
  }
  validate(files) {
    const file = files[0];
    if(file.size > this.maxSize) {
      this.setAttribute("error", "File's weight shouldn't exceed 1 MB")
      return false;
    }
    return true;
  }
}
customElements.define("custom-upload", CustomUpload);
</script>
