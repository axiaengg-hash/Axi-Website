# Axia Engineering Services — Website

Marketing website for Axia Engineering Services, built as plain static HTML, CSS
and JavaScript. No build step, no framework, no package install — open
`index.html` in a browser and it works.

## The two services

The site is organised around the company's two service tracks, which the
homepage presents side by side:

| | **Construction** | **Engineering Services** |
|---|---|---|
| Duration | Long — weeks to months | Short — hours to days |
| Work | New MEPFS installation and full system build-out | Repairs, maintenance and minor works |
| Page | `construction.html` | `engineering.html` |

**Construction** covers the full MEPFS scope — **M**echanical, **E**lectrical,
**P**lumbing, **F**ire protection, **S**anitary — with structured cabling and
fire protection highlighted as the two headline installations.

**Engineering Services** covers short-duration work: reactive repairs and
emergency call-outs, planned preventive maintenance, and annual service
contracts.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — "Construction and Engineering Services", both tracks, MEPFS disciplines, comparison table, process, why Axia |
| `construction.html` | Long-duration MEPFS projects, full discipline breakdown, 8-stage delivery process, handover deliverables, FAQ |
| `engineering.html` | Repairs and maintenance, coverage by discipline, call-out process, service contracts, FAQ |
| `about.html` | Company positioning, operating principles, who we work with |
| `contact.html` | Enquiry form, contact details, what happens next |

## Structure

```
.
├── index.html, construction.html, engineering.html, about.html, contact.html
├── assets/
│   ├── css/styles.css     all styling, design tokens at the top in :root
│   ├── js/main.js         nav, scroll reveal, anchor handling, enquiry form
│   └── img/favicon.svg
├── robots.txt, sitemap.xml
└── .nojekyll              so GitHub Pages serves the files as-is
```

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

- **Colours, fonts, spacing** — design tokens are defined in `:root` at the top
  of `assets/css/styles.css`. `--amber-ink` is a deliberately darkened amber
  used for text on light backgrounds; it meets WCAG AA at 5.09:1, whereas the
  brighter `--amber-500` does not and is reserved for dark backgrounds and
  decorative elements.
- **Contact details** — email, hours and the call-out note appear in the footer
  of all five pages and in `contact.html`. A phone number and street address are
  not yet included; add them to the footer block and the contact page's
  `.info-list` when available.
- **Navigation** — the header and footer are duplicated per page (there is no
  templating). Editing one means editing all five.

## Accessibility and browser notes

- Skip link, single `<h1>` per page, no heading-level jumps, labelled form
  fields, visible focus rings, landmark elements throughout.
- All text/background pairings meet WCAG AA contrast.
- Respects `prefers-reduced-motion`: reveal animations and smooth scrolling are
  disabled for visitors who ask for that.
- Responsive from 320px up; the comparison table scrolls horizontally on narrow
  screens with shadow affordances and a swipe hint.
- Google Fonts are loaded from a CDN with a system fallback stack, so the site
  still renders correctly if the fonts are blocked or unavailable.
- Includes a print stylesheet.
