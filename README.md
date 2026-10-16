# Addvibez – Home Page HTML Template

Home page only. Open `index.html` in a browser (or serve the folder with any static server).

## Stack (all via CDN)
Bootstrap 5.3.8 · jQuery 4.0.0 · Font Awesome Free 7.3.1 · Animate.css 4.1.1 · WOW.js 1.1.2 · Google Fonts (Plus Jakarta Sans 600/700, Lato 400)

## Structure
```
index.html
assets/
  scss/   abstracts → base → components → layout (main.scss is the entry point)
  css/    main.css (+ map), main.min.css  (compiled output)
  js/     main.js (jQuery)
  images/ optimised WebP/PNG, logo files
  video/  showreel.mp4
```

## Build CSS
```
npm install
npm run build        # main.css + main.min.css
npm run sass:watch   # while developing
```
Use `assets/css/main.min.css` in production.

## Placeholder content to replace
Stats figures, testimonials, team names, work/portfolio items, blog posts, packages ("Custom Quote"),
social links (`#`) and the form handler (front-end validation only, no mailer).
