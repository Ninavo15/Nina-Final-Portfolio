# Nina-Final-Portfolio

Nina Vo Portfolio — live at https://ninavo15.github.io/Nina-Final-Portfolio/

## Folders

```
index.html            Home page
html/
  main-page/          About, Work, Extra
  project/            One page per project (yummeal.html, pitfall.html, …)
  partials/           Nav, footer and project quick-nav, loaded by js/components.js
css/
  main.css            Shared base styles and variables
  components/         nav.css, footer.css
  home.css, about.css, work.css, extra.css, project.css
  projects/           One stylesheet per project, named after its page
js/                   Page scripts (components.js runs on every page)
image/                One folder per project or section
files/                Downloadable files (resume)
```

## Naming

File and folder names are lowercase with dashes (`rush-hour-3.png`, `all-made-from-mom-luv/`).
Each project uses the same name for its page, stylesheet and image folder.

## Running locally

The nav and footer are loaded with `fetch`, so open the site through a local
server (for example VS Code Live Server at `http://127.0.0.1:5500/`), not by
double-clicking the HTML files.
