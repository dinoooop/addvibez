# Addvibez – Home Page HTML Template

Home page only. Open `index.html` in a browser (or serve the folder with any static server).

## Stack (all via CDN)
Bootstrap 5.3.8 · jQuery 4.0.0 · Font Awesome Free 7.3.1 · Google Fonts (Plus Jakarta Sans 600/700, Lato 400)

## Structure
```
index.html
services.html
service-single.html
assets/
  scss/   abstracts, base, components, layout (main.scss is the entry point)
  css/    main.css (+ map), main.min.css  (compiled output)
  js/     main.js (jQuery)
  images/ optimised WebP/PNG and logo files
```

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home page (Services section shows 6 Digital Marketing services + "View More") |
| `services.html` | All services in two sections: Digital Marketing (7) and Branding (8) |
| `service-single.html` | Service detail page template; every service card and link points here |

Digital Marketing: Search Engine Optimisation, Generative Engine Optimization, Social Media Management,
Performance Marketing, Content Marketing, Marketing Automation, Analytics.
Branding: Brand Consulting, Logo Design, Industrial / Product Design, Graphic Design, 2D / 3D Visualisation,
Content Creation & Marketing, Website Design & Development, E-Commerce.

`service-single.html` currently holds the Search Engine Optimisation content. Copy it to make a page per
service when the content is ready, then point that service's links at the new file.

## Build CSS
```
npm install
npm run build        # main.css + main.min.css
npm run sass:watch   # while developing
```
Use `assets/css/main.min.css` in production.

## Placeholder content to replace
Service descriptions and FAQs, social links (`#`) and the form handler (front-end validation only, no mailer).
`service-single.html` currently holds the Search Engine Optimisation content and every service links to it.
