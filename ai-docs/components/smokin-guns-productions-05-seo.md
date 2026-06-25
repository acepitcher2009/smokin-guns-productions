# Component Build Story — Seo (per-page head manager)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #2; §E Build Order #5)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `Seo`
- Build-order position: `5`
- Test tier: `light`

---

## A. Story Summary (required)

As the site owner, I need each page to emit a unique, clean (single-encoded) title, description, canonical URL, and Open Graph + Twitter tags, so that search engines and social shares present each page correctly — fixing the old single-page build's missing per-page meta and the `&amp;#39;` double-encoding bug.

---

## B. Background / Context (required)

Build-order step 5. Per PRD §7 (per-page unique titles/descriptions, canonical, OG/Twitter `summary_large_image`, single-encoded entities) and plan §C #2, `Seo` is a head-only component that reads per-page copy from `seo.ts` (story 1) keyed by `PageKey` and renders the head tags via `react-helmet-async`. It relies on the `HelmetProvider` wired in `App` (story 2). Each page component drops `<Seo pageKey="..." />` near its top. No prior story manages the head — this is canonical.

---

## C. Acceptance Criteria (required)

1. Accepts a `pageKey: PageKey` prop and looks up its entry in `seo` from `src/data/seo.ts`.
2. Renders into `<head>` via `react-helmet-async`'s `<Helmet>`:
   - `<title>` = `seo[pageKey].title`
   - `<meta name="description">` = `seo[pageKey].description`
   - `<link rel="canonical">` = site origin + `seo[pageKey].canonicalPath`
   - Open Graph: `og:title` (falls back to `title`), `og:description` (falls back to `description`), `og:type` (`website`), `og:url` (canonical), `og:image` (`seo[pageKey].ogImage`), `og:locale` (`en_US`)
   - Twitter: `twitter:card` = `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
3. **Single-encoding:** apostrophes in the rendered title/description appear exactly once-encoded (the literal `'`), never `&#39;` or `&amp;#39;` — i.e. the component passes the raw strings from `seo.ts` straight through (it must NOT pre-escape).
4. Each of the six pages, given its `pageKey`, produces a distinct title and description matching the PRD §7 strings (sourced from `seo.ts`).
5. Canonical/OG `url` are absolute (origin prepended to `canonicalPath`); origin comes from a single constant (or `window.location.origin` guarded for SSR/test) — not hardcoded per page.
6. **Token-cleanliness:** head-only component — no JSX styling, no color/spacing/font-size classes at all.
7. `npm run typecheck` + `npm run lint` pass.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§C Component Structure** — functional component, inline `interface SeoProps`, **named export** `export function Seo`, no `any`; imports the `PageKey` type and `seo` constant from `src/data/seo.ts`.
- **§D File Organization** — component in `src/components/`; reads content from `src/data/seo.ts` (no meta strings hardcoded in the component).
- **§B Code Style** — single quotes, semicolons, import groups (external `react-helmet-async` → internal `../data/seo`).
- Note: no §E token rules apply (head-only, no markup styling).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/Seo.tsx` | create | Per-page head manager reading `seo.ts` by `PageKey` |

Composition: each page component (built later) renders `<Seo pageKey="home" />` etc. near its top — those edits belong to the page-composition stories, not this one. This story may demonstrate the wiring in the placeholder `Home.tsx` from story 2 as a verification convenience, but the canonical wiring is per-page.

### E.2 Component example

`src/components/Seo.tsx`:

```tsx
import { Helmet } from 'react-helmet-async';

import { seo } from '../data/seo';
import type { PageKey } from '../data/seo';

const SITE_ORIGIN = 'https://smokingunsproductions.com';

interface SeoProps {
  pageKey: PageKey;
}

export function Seo({ pageKey }: SeoProps) {
  const page = seo[pageKey];
  const canonicalUrl = `${SITE_ORIGIN}${page.canonicalPath}`;
  const ogTitle = page.ogTitle ?? page.title;
  const ogDescription = page.ogDescription ?? page.description;
  const ogImageUrl = `${SITE_ORIGIN}${page.ogImage}`;

  return (
    <Helmet>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  );
}
```

> **Why this is single-encoded:** the strings in `seo.ts` use literal apostrophes (`'`). Passing them as `content={...}` / as `<title>` children lets React/Helmet handle escaping exactly once. The component must **not** call any HTML-entity encoder — that is what produced the old `&amp;#39;` bug.

### E.4 Design tokens used

None — head-only component with no rendered visual markup.

### E.5 Interactions / behavior

None. Helmet manages head tags on mount/update; on SPA route change the next page's `Seo` replaces them. `HelmetProvider` (story 2) is required in the tree.

### E.6 Responsive behavior

N/A (no visual output).

### E.7 Accessibility

- A correct, unique `<title>` per page aids screen-reader page identification and tab labeling.
- Clean single-encoded text means assistive tech and crawlers read the real apostrophes, not entity noise.
- This component does not affect headings; the one-`<h1>`-per-page rule is each page's responsibility.

---

## F. Testing Strategy (required — Tier: light)

`react-helmet-async` updates `document.head` asynchronously; tests assert via `document.title` / `document.head` after a tick, wrapping in `HelmetProvider`. Create `src/components/Seo.test.tsx`:

- Rendering `<HelmetProvider><Seo pageKey="home" /></HelmetProvider>` sets `document.title` to the Home title from `seo.ts` (await a microtask / `waitFor`).
- The rendered title contains a literal apostrophe and does **not** contain the substring `&#39;` or `&amp;`.
- A canonical `<link rel="canonical">` is added to `document.head` with href ending in `/` for `home` and `/events` for `events`.
- An `og:image` meta is present.

**Manual check (all tiers):**
1. `npm run dev`; on each page view source / inspect `<head>`: unique title + description, canonical, og:* and twitter:* present.
2. Confirm the title bar shows a real apostrophe (e.g. "Smokin' Guns"), not `&#39;`.
3. Navigate between pages — head tags update per route.

---

## G. Definition of Done (required)

- [ ] Reads per-page copy from `seo.ts` by `PageKey`; no meta strings hardcoded in the component.
- [ ] Emits title, description, canonical, OG (title/description/type/url/image/locale), and Twitter `summary_large_image` tags.
- [ ] Output is single-encoded (no `&#39;`/`&amp;#39;`).
- [ ] Canonical/OG urls absolute from one origin constant.
- [ ] No styling/token usage (head-only).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.

---

## H. Dependencies & Blockers (required)

- **Depends on:** story 1 `seo.ts` (`PageKey`, `seo`); story 2 `App` (`HelmetProvider` in the tree). `react-helmet-async` already installed.
- **Blockers:** None identified. `og:image` points at the `seo.ts` placeholder (`/og-default.jpg`) until the owner supplies a high-fidelity brand image (PRD §10 item 1) — marked TBC in `seo.ts`, not a code blocker.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #2, §E #5)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§B, §C, §D)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§7 universal SEO checklist)
- Related components this depends on: `seo.ts` (story 1), `App`/`HelmetProvider` (story 2); consumed by every page composition.
