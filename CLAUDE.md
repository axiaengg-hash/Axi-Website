# CLAUDE.md

Guidance for Claude when working in this repository.

## Who I work for

- **Owner:** Cris John Will Lim — Owner of **Axia Engineering Services**
- **Licences:** Licensed Mechanical Engineer · Registered Master Electrician · Master Plumber
- **Experience:** 10 years across MEPFS works
- **Email:** axiaengg@gmail.com
- **Phone:** 0926-668-8988 (`tel:+639266688988`) · 0991-613-9400 (`tel:+639916139400`)
- **Address:** B17 L11 Plaincrest Subd., Brgy. Trapiche, Tanauan, Batangas, Philippines

Cris is the decision-maker for content, services and branding. When a request is
ambiguous about what the business offers, ask rather than invent.

## The business

Axia is an MEPFS contractor (mechanical, electrical, plumbing, fire protection)
with two service tracks:

- **Construction** — long-duration (weeks to months) new installation and full
  build-out: MEPFS, complete kitchen systems, structured cabling, CCTV, civil
  works, and BFP/DOLE/PEZA permitting. Headline installations: structured cabling
  and fire protection.
- **Engineering Services** — short-duration (hours to days) repairs, emergency
  call-outs, preventive maintenance and annual service contracts.

**Do not offer** sanitary works, water treatment or HVAC anywhere in the copy.

## The website

Plain static HTML/CSS/JS — no build step, no framework, no dependencies.
`README.md` is the detailed reference for structure and customising; keep it in
sync when behaviour or structure changes.

- Pages: `index.html`, `construction.html`, `engineering.html`, `projects.html`,
  `about.html`, `contact.html`.
- Styles: `assets/css/styles.css` (design tokens in `:root`). Script:
  `assets/js/main.js`.
- Preview locally: `python3 -m http.server 8000`.
- Hosted on GitHub Pages (`.nojekyll` must stay).

## Conventions

- **Header and footer are duplicated on all six pages** — an edit to one means
  editing all six. Same for contact details (footer of every page + `contact.html`).
- **Cache-busting:** asset URLs carry `?v=YYYYMMDD<letter>` (e.g. `?v=20261008f`).
  When changing CSS, JS or a replaced image, bump the version consistently across
  every page.
- **Phone numbers:** display local format, link in international `tel:+63…` form;
  change both together.
- **Accessibility:** one `<h1>` per page, no heading-level jumps, alt text on every
  image, WCAG AA contrast. Use `--amber-ink` for amber text on light backgrounds;
  `--amber-500` is only for dark backgrounds/decoration.
- **Images:** project photos go in `assets/img/projects/`, max 1200px wide,
  `loading="lazy"`, with explicit `width`/`height`.
- **Copy tone:** clear, professional, Philippine English; spell "licence" (noun)
  as the site already does.
- **Commits:** small, descriptive, imperative messages (e.g. "Add kitchen system photos").
