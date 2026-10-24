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

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home page (Services section shows 6 Digital Marketing services + "View More") |
| `services.html` | All services in two sections: Digital Marketing (7) and Branding (8) |
| `<service-name>.html` | One detail page per service (15), e.g. `search-engine-optimisation.html`, `logo-design.html` |

Digital Marketing: Search Engine Optimisation, Generative Engine Optimization, Social Media Management,
Performance Marketing, Content Marketing, Marketing Automation, Analytics.
Branding: Brand Consulting, Logo Design, Industrial / Product Design, Graphic Design, 2D / 3D Visualisation,
Content Creation & Marketing, Website Design & Development, E-Commerce.

The 15 detail pages share one layout. To change something that appears on all of them (sidebar, footer,
CTA), edit it in each file or regenerate the pages from a single template.

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
