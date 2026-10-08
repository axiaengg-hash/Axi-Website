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
| `projects.html` | Notable projects grouped by discipline — fire protection, mechanical, structured cabling & CCTV, fit-out/plumbing, civil — with client, site and date |
| `about.html` | Company description, mission, owner profile and licences, client list, the six-point philosophy, who we work with |
| `contact.html` | Enquiry form, contact details, what happens next |

## Structure

```
.
├── index.html, construction.html, engineering.html, about.html, contact.html
├── assets/
│   ├── css/styles.css     all styling, design tokens at the top in :root
│   ├── js/main.js         nav, scroll reveal, anchor handling, enquiry form
│   └── img/               logo.png (ἀξία wordmark), favicon.png, apple-touch-icon.png, icon-512.png,
│       └── projects/      29 project photos extracted from the company profile, named by project
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

- **Photo banners** — the homepage hero uses `assets/img/hero.jpg`; each inner
  page's banner photo is set by one `--banner` line per page in the *UI upgrade*
  block at the end of `styles.css` (`.page-hero--construction` etc.). Swap the
  file named there to change a banner.
- **Client bar** — the scrolling "Trusted by" strip under the homepage hero
  lists each client twice (the second copy is `aria-hidden`) so the loop is
  seamless; add a new client to both copies. It stops scrolling for visitors
  who prefer reduced motion.
- **Projects** — each project on `projects.html` is a `.project` article inside a
  `.project-group`; a `.project--featured` one spans the row. Photos live in
  `assets/img/projects/` at up to 1200px wide and load lazily. To add a project,
  drop the photo there and copy one of the existing articles. Every project
  photo opens in a full-screen viewer when clicked (arrow keys move between
  photos, Esc closes); that needs no extra markup.
- **Services beyond MEPFS** — civil & building works, CCTV, and BFP/DOLE/PEZA
  permitting are described on `construction.html` (`#civil`, `#cctv`, `#permits`)
  along with the brands installed (`#brands`).
- **Owner and clients** — the owner section (`#leadership`) and client list
  (`#clients`) live on `about.html`; the homepage repeats the client names as a
  compact strip. Both lists are plain HTML `<li>` items, so adding a client is
  one line in each place. The portrait is `assets/img/cris-john-will-lim.jpg`.
- **Logo** — `assets/img/logo.png` is the ἀξία wordmark with its background
  removed, exported at 604×220 (2× the largest size it is shown at). It appears
  in the header and footer of every page via the `.brand` block; the browser-tab
  and home-screen icons in the same folder are cut from its first glyph on a
  navy tile. To replace the logo, overwrite `logo.png` with a transparent PNG or
  SVG of similar proportions and update the `width`/`height` attributes on the
  `<img>` tags.
- **Colours, fonts, spacing** — design tokens are defined in `:root` at the top
  of `assets/css/styles.css`. `--amber-ink` is a deliberately darkened amber
  used for text on light backgrounds; it meets WCAG AA at 5.09:1, whereas the
  brighter `--amber-500` does not and is reserved for dark backgrounds and
  decorative elements.
- **Contact details** — email, phone, hours and the call-out note appear in the
  footer of all five pages and in `contact.html`. The phone number is written
  locally as `0926-668-8988` but linked as `tel:+639266688988`, so it dials
  correctly from abroad as well as at home; change both if the number changes.
  The street address and second number come from the company profile and
  appear in the same two places.
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
