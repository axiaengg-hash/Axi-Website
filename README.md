# Axia Engineering Services — Website

Marketing website for Axia Engineering Services, built as plain static HTML, CSS
and JavaScript. No build step, no framework, no package install — open
`index.html` in a browser and it works.

## What the site sells

Four services:

| Service | For | Covers |
|---|---|---|
| **Electromechanical** | Manufacturing plants | Installation of production machines and equipment; compressed air (compressor rooms, receivers, headers); cooling water (cooling towers, pump stations, chilled water loops); power to machines |
| **CCTV and structured cabling** | Warehouses | IP cameras, NVR and monitoring; Cat6 and fibre; Wi-Fi for scanners; racks, patching, labelling and tested links |
| **Fire protection and FDAS** | Plants and buildings | Sprinklers, fire pumps, hydrants and hose reels; detection and alarm; BFP, DOLE and PEZA permit support |
| **Complete kitchen requirements** | Commercial and canteen kitchens | Hood and exhaust, LPG gas line, gas leak detection, wet-chemical suppression (Lehavot) |

Repairs, planned maintenance and service contracts for all four are on
`services.html#maintenance`. Plumbing and civil works are not offered and should
not be reintroduced in copy.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage: full-screen hero, the "Across your site" diagram (pick a service to light it up), recent work, how a job runs, clients, about, contact card |
| `services.html` | One chapter per service (`#electromechanical`, `#cctv`, `#fire`, `#kitchen`), repairs and upkeep (`#maintenance`), FAQ |
| `projects.html` | Projects grouped by service, each with photos and client / site / date / scope; filter buttons by service |
| `about.html` | Why one contractor, the owner and licences (`#leadership`), values, client list (`#clients`) |
| `contact.html` | Enquiry form, contact details, what happens next |
| `construction.html`, `engineering.html` | Redirect stubs to `services.html`, kept so old links still work |

## Structure

```
.
├── index.html, services.html, projects.html, about.html, contact.html
├── construction.html, engineering.html   redirects to services.html
├── assets/
│   ├── css/styles.css     all styling, design tokens at the top in :root
│   ├── js/main.js         nav, reveal on scroll, site diagram tabs, project filter,
│   │                      photo viewer, enquiry form
│   └── img/               logo, icons, hero.jpg, owner portrait
│       └── projects/      project photos (the DKSH office, solar light and civil photos are not used)
├── robots.txt, sitemap.xml
└── .nojekyll              so GitHub Pages serves the files as-is
```

## Design

- **Colour**: bare-concrete grey ground (`--bg`), Axia navy ink and fields, and the
  logo's amber (`--accent`) kept for buttons and the live diagram only.
- **Type**: Barlow Condensed for headings, Barlow for text, five sizes set as
  `--step-*` tokens.
- **Motion**: amber "Powered · Watched · Wired" marquee band, staggered reveals
  (`data-reveal`), picture openings on scroll. Everything respects
  `prefers-reduced-motion` and stays visible without JavaScript.

## Running it locally

Open `index.html` directly, or serve the folder to exercise it the way a host
would:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Any static host works. For **GitHub Pages**: repository *Settings → Pages*, set
the source to this branch, root folder. The `.nojekyll` file is already present
so Jekyll does not reprocess the files.

## The enquiry form

The contact form has no server behind it. On submit it builds a `mailto:` link
with the enquiry details filled in and hands it to the visitor's email client;
nothing is sent until they press send there. This is stated on the page so the
behaviour is not a surprise.

To switch to a real backend, replace the submit handler at the bottom of
`assets/js/main.js` with a `fetch()` POST to your endpoint (Formspree, Netlify
Forms, a serverless function). The destination address is held in one place —
the `data-mailto` attribute on the `<form>` in `contact.html`.

## Customising

- **Header and footer** are duplicated in every page (no templating). Editing one
  means editing all five content pages.
- **Hero photo** is `assets/img/hero.jpg`.
- **Site diagram** is an inline SVG in `index.html` (`#shed`). Each service's
  parts sit in a `<g class="sys sys--em|cctv|fire|kitchen">`; shapes with class `hl`
  (fill) or `hs` (stroke) turn amber when that service's tab is selected, and
  `lbl` text labels appear.
- **Projects**: each project on `projects.html` is an `<article class="project">`
  with `data-sys` listing its services (`em`, `cctv`, `fire`, `kitchen`) for the filter. Each
  photo `<figure>` carries `style="--r: width/height"` (as a decimal) so the row
  lines up at one height. Clicking a photo opens the full-screen viewer.
- **Clients** are plain `<li>` items on `index.html` and `about.html`.
- **Contact details** appear in the footer of every page, the home contact card
  and `contact.html`. The phone is written `0926-668-8988` and linked as
  `tel:+639266688988`.

## Accessibility and browser notes

- Skip link, single `<h1>` per page, no heading-level jumps, labelled form
  fields, visible focus rings, landmark elements throughout.
- All text/background pairings meet WCAG AA contrast.
- Respects `prefers-reduced-motion`: reveal animations and smooth scrolling are
  disabled for visitors who ask for that.
- Responsive from 320px up.
- The diagram tabs follow the ARIA tabs pattern (arrow keys, Home, End).
- Google Fonts are loaded from a CDN with a system fallback stack, so the site
  still renders correctly if the fonts are blocked or unavailable.
- Includes a print stylesheet.
