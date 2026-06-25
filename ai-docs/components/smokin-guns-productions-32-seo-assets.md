# Component Build Story — SEO assets (sitemap.xml + robots.txt)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§B §7 row; §E Build Order #32)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: SEO build assets — `public/sitemap.xml` + `public/robots.txt`
- Build-order position: `32`
- Test tier: `light`

---

## A. Story Summary (required)

As the site owner, I need a sitemap listing all six pages and a robots.txt that allows crawling and points to the sitemap, so that search engines can discover and index every page of the rebuilt multi-page site — something the old single-URL build could not offer.

---

## B. Background / Context (required)

Build-order step 32 — the final build-asset task. Per PRD §7 ("`sitemap.xml` listing every real page + `robots.txt` allow crawl, reference sitemap") and plan §B (§7 row) / §E #32, these are **static files in `public/`**, **not React components** — Vite copies `public/` to the build output root verbatim, so they ship at `/sitemap.xml` and `/robots.txt`. The six routes are the clean URLs defined in `nav.ts` (story 1) / `App` (story 2): `/`, `/events`, `/results`, `/about`, `/sponsors`, `/contact`. The canonical origin matches the one used by `Seo` (story 5: `https://smokingunsproductions.com`). No CONVENTIONS.md §E token rules apply (these are not markup).

---

## C. Acceptance Criteria (required)

1. `public/sitemap.xml` exists and is valid `urlset` XML listing **all six** pages at the canonical origin: `/`, `/events`, `/results`, `/about`, `/sponsors`, `/contact`.
2. Each `<url>` has a `<loc>` with the absolute URL (origin + clean path); optional `<changefreq>`/`<priority>` allowed but not required.
3. `public/robots.txt` exists, **allows crawling** (`User-agent: *` / `Allow: /`), and references the sitemap (`Sitemap: https://smokingunsproductions.com/sitemap.xml`).
4. The canonical origin matches `Seo`'s `SITE_ORIGIN` (`https://smokingunsproductions.com`) — no trailing-slash/host mismatch with the canonical tags.
5. The URL list is **consistent with `nav.ts`** (the same six clean paths) — no extra/missing routes, no `*` SPA fallback route in the sitemap.
6. Files live in `public/` so Vite emits them at the site root (`/sitemap.xml`, `/robots.txt`).
7. **Token-cleanliness:** N/A — these are static XML/text files with no markup styling, color, spacing, or font size.
8. `npm run build` succeeds and the two files appear in `dist/` at the root.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§D File Organization** — static public assets belong in `public/` (Vite copies them to the build root). They are explicitly **not** React components and not in `src/components`/`src/pages`.
- No §C component-structure or §E token rules apply (non-React static files).
- Origin consistency: match the `SITE_ORIGIN` constant used by `Seo` (story 5) so canonical URLs, sitemap `<loc>`s, and robots `Sitemap:` all agree.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `public/sitemap.xml` | create | Lists all six clean-URL pages for crawlers |
| `public/robots.txt` | create | Allows crawl; references the sitemap |

> No composition edit / no React wiring — Vite serves `public/` at the site root automatically; nothing imports these files.

### E.2 File content (the deliverable)

`public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://smokingunsproductions.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://smokingunsproductions.com/events</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://smokingunsproductions.com/results</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://smokingunsproductions.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://smokingunsproductions.com/sponsors</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://smokingunsproductions.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://smokingunsproductions.com/sitemap.xml
```

> **Origin consistency:** the host `https://smokingunsproductions.com` matches `Seo`'s `SITE_ORIGIN` (story 5) and `businessInfo.url` (story 1) so canonical tags, sitemap `<loc>`s, and the `Sitemap:` line all agree. **Six pages only** — the same clean paths as `nav.ts`; do **not** add the SPA `*` fallback route. `changefreq`/`priority` are advisory and optional; the builder may omit them. If the owner confirms a different canonical host before launch (PRD §7 pre-launch gate is about city, not host, but verify the domain), update the origin in all three places (`Seo`, sitemap, robots) together.
>
> **SPA routing note:** these are static crawler hints; the app's client-side routing (story 2) already resolves the clean URLs. For deep-link/refresh on a static host, a host-level SPA rewrite (serve `index.html` for unknown paths) may be needed — that is a hosting-config concern, not part of these two files.

### E.4 Design tokens used

None — static XML/text files, no markup styling.

### E.5 Interactions / behavior

None — static files served at the site root.

### E.6 Responsive behavior

N/A.

### E.7 Accessibility

N/A (not rendered UI). These improve crawler discoverability per PRD §7.

---

## F. Testing Strategy (required — Tier: light)

These are static files, not React — no component test. A light asset-presence test is appropriate. Create `src/data/seoAssets.test.ts` (or a `tests/` file) that reads the files from disk:

- `public/robots.txt` exists, contains `Allow: /`, and contains `Sitemap: https://smokingunsproductions.com/sitemap.xml`.
- `public/sitemap.xml` exists and contains a `<loc>` for each of the six paths: `/`, `/events`, `/results`, `/about`, `/sponsors`, `/contact` (assert the six absolute URLs appear).
- The sitemap does **not** contain a wildcard/`*` entry.

(Use Node `fs.readFileSync` with paths relative to `process.cwd()`; vitest runs in the project root.)

**Manual check (all tiers):**
1. `npm run build`; confirm `dist/sitemap.xml` and `dist/robots.txt` exist at the root.
2. `npm run preview`; open `/sitemap.xml` and `/robots.txt` — both serve; the sitemap validates (e.g. paste into a sitemap validator).
3. Confirm every `<loc>` matches a real route and the canonical tag host.

---

## G. Definition of Done (required)

- [ ] `public/sitemap.xml` lists all six clean-URL pages with absolute `<loc>`s at the canonical origin.
- [ ] `public/robots.txt` allows crawl and references the sitemap.
- [ ] Origin matches `Seo`'s `SITE_ORIGIN` / `businessInfo.url`; paths match `nav.ts`; no `*` route.
- [ ] Files in `public/`; `npm run build` emits them at `dist/` root.
- [ ] Light asset-presence test present and passing.
- [ ] (N/A) No token usage — static files.

---

## H. Dependencies & Blockers (required)

- **Depends on:** the finalized route list (`nav.ts`, story 1 / `App`, story 2) and the canonical origin (`Seo`, story 5). No npm packages.
- **Blockers:** None for the build. The canonical host/city is a pre-launch gate (PRD §7 — Snook vs Somerville is about NAP locality, not the domain); if the owner changes the canonical domain before launch, update the origin in `Seo`, the sitemap, and robots together.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§B §7 row, §E #32)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§D file organization — `public/`)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§7 sitemap/robots, §9 SEO)
- Related: route list `nav.ts` (1) / `App` (2); canonical origin `Seo` (5); `businessInfo.url` (1).
