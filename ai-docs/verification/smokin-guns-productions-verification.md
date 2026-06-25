# Whole-Site Verification Report — Smokin' Guns Productions LLC

## Document Metadata
- PRD path: `ai-docs/prd/smokin-guns-productions.md`
- Conventions path: `ai-docs/conventions/CONVENTIONS.md`
- Date: 2026-06-25 (initial); **re-verified 2026-06-25 after the F-1 SSG fix**
- Site name: Smokin' Guns Productions LLC
- Test tier: **light**
- Verifier scope: single end-of-build, whole-site pass (not per-component)

**Overall result: PASS (with documented owner-pending placeholders only — the one build-pipeline SEO finding F-1 is now RESOLVED).** Build/type/lint/test gate is fully clean. All visual-coherence, responsive (static), and accessibility checks pass. **F-1 (SPA had no prerendering) is closed:** a build-time static prerender (SSG) now emits each clean URL's real `<head>` + JSON-LD into static HTML, so the per-page SEO win is delivered to non-JS crawlers and OG scrapers — not runtime-only. All remaining gaps are flagged-by-design TBC placeholders, except the documented Snook-vs-Somerville pre-launch gate.

---

## RE-VERIFICATION ADDENDUM (2026-06-25) — F-1 fix confirmation pass

A targeted confirmation pass was run after the F-1 fix. Scope: (a) confirm F-1 closed, (b) confirm no regression from the `App.tsx` / `main.tsx` refactor.

**The F-1 fix (as delivered):** a build-time static prerender (SSG) was added — `src/entry-server.tsx` + `scripts/prerender.js` — wired into `npm run build` (now `tsc -b && vite build && build:ssr && prerender`). `App.tsx` gained `AppShell` (router-free shell), `App` (BrowserRouter for the client), and `AppServer` (StaticRouter + HelmetProvider context for SSG); `main.tsx` now `hydrateRoot` in prod (populated `#root`) / `createRoot` in dev (empty root); the scaffold `index.html` `<title>` is dropped by the prerender so each route's helmet title is the only one. **No new dependencies** (uses the SSR bundle Vite already produces).

### F-1 — CONFIRMED CLOSED. Evidence from the BUILT `dist/` output:

| Check | Result | Evidence (post-`npm run build`) |
|---|---|---|
| Build runs the prerender | ✓ | Build log: `prerendered / → dist/index.html` … `prerendered /contact → dist/contact/index.html` for all 6 clean URLs. |
| All 6 routes emit real static HTML (not the 0.5 kB empty shell) | ✓ | `dist/index.html` 15.8 kB, `/events` 79.2 kB, `/contact` 16.6 kB, `/about` 9.7 kB, `/results` 9.8 kB, `/sponsors` 15.4 kB. `#root` is populated (`grep '<div id="root"></div>'` → 0 matches; populated-root → 1). |
| Unique per-page `<title>` in static `<head>` | ✓ | Home `Smokin' Guns Productions — Barrel Racing & Pole Bending Events \| Somerville, TX`; Events `2026 Snook Summer Buckle Series — Barrel Racing Events \| Somerville TX`; Contact `Contact & Register — Snook Rodeo Arena, Somerville TX …`; About / Results / Sponsors each their PRD §7 title. Exactly **one** `<title>` per route. |
| **NO scaffold fallback title remains** | ✓ | `grep -rl "smokin-guns-productions</title>" dist/` → **none**. The scaffold title is dropped by `prerender.js`. |
| Single-encoded, no double-encode bug | ✓ | Titles use single HTML entities (`&#x27;`, `&amp;`) that render as `'`/`&`. `grep` for `&amp;#39;` / `&amp;amp;` / `&amp;#x27;` across `dist/` → **none** (Discard #5 stays fixed). |
| Canonical per route in static HTML | ✓ | `https://smokingunsproductions.com/`, `…/contact`, `…/events`, `…/about`, `…/results`, `…/sponsors` — one each, correct path. |
| OG + Twitter per route in static HTML | ✓ | Every route: **6** `og:*` + **4** `twitter:*` tags in `<head>` (was runtime-only before). |
| `SportsActivityLocation` JSON-LD on Home + Contact | ✓ | 1 block each, `@type":"SportsActivityLocation"` with nested `PostalAddress` (11538 FM 3058, Somerville, TX 77874), `OpeningHoursSpecification` (Mon–Fri 09:00–17:00), `telephone` 832-857-2826, `email`. Geo correctly omitted (owner-pending §10.7 — not a regression). |
| `schema.org/Event` JSON-LD for the whole season on Events | ✓ | **26** `@type":"Event"` blocks in static HTML. AM+PM expressed as sibling Events: May 30/Jun 6 AM `T11:00`, Jun 13/Jun 20(Jackpot) AM `T10:15`, all PM `T18:00`; card #4 named **SNOOK JACKPOT**. Each has `Organization` organizer, correct `Place` location across all 3 venues (Snook Rodeo Arena / Magnolia Cowboy Church / Waller Co. Fairgrounds), `EventScheduled`, `OfflineEventAttendanceMode`. |
| All JSON-LD parses as valid JSON | ✓ | All **28** `application/ld+json` blocks across `dist/` parsed with `JSON.parse` after entity-decoding — **0 invalid**. |

**Conclusion:** the headline PRD §7 SEO win — crawlable per-page meta, canonical, OG/Twitter, `SportsActivityLocation`, and a `schema.org/Event` per AM/PM race across the season — is now present in **static HTML at build time**, visible to non-JS crawlers and social/OG scrapers. F-1 is resolved. The affected SEO acceptance criteria move from ✓(content)/⚠(delivery) to **✓ full pass** (see updated §B SEO table below).

### No regression from the refactor — confirmed:

| Group | Result | Evidence |
|---|---|---|
| Tier gate | ✓ | `npx tsc --noEmit` 0 errors; `npm run build` clean + prerender ran all 6 routes; `npm run lint` (oxlint) 0/0; `npm run test` **183/183** (35 files) — App.tsx/main.tsx refactor caused no test regression. |
| Client hydration / testability | ✓ | `App.test.tsx` targets the extracted `AppShell` with its own `MemoryRouter` (refactor-safe); `main.tsx` picks `hydrateRoot` vs `createRoot` by `#root` content so prod (populated root) and dev (empty root) both stay warning-free. `#root` populated in `dist/`. |
| Single brand-red CTA discipline | ✓ | `Button.tsx` has no teal/pink bg; no `<button>`/`<Button>` carries `bg-teal`/`bg-pink` (grep clean). Refactor added no CTA. |
| Text-on-teal AA rule (§E) | ✓ | No `text-white` on `bg-teal` / `bg-teal-deep` in any component (the one grep hit is the `SponsorTierCard.test.tsx` guard asserting it is **null**). |
| One `<h1>` per page | ✓ | Now confirmable in the **built** HTML: exactly one `<h1>` in each of the 6 `dist/` route files (prerender emits real h1s). |
| No new hardcoded-hex / off-scale / arbitrary-value drift | ✓ | No hardcoded hex in components; refactor files (`App.tsx`, `main.tsx`, `entry-server.tsx`, `prerender.js`) introduce no off-scale spacing keys, no arbitrary `[..]` values, and no styling (pure plumbing — the one `className` in `App.tsx` is the unchanged token-based shell wrapper). |

**Tier gate (light) RE-CONFIRMED SATISFIED. Overall: PASS.**

---

## A. Build & Type Health

| Check | Command | Result (re-verified 2026-06-25, post-F-1-fix) |
|---|---|---|
| Build | `npm run build` | **PASS** (`tsc -b && vite build && build:ssr && prerender` — client 134 modules ~152ms, SSR bundle 51 modules ~24ms, **prerender emits all 6 clean URLs**) |
| Typecheck | `npx tsc --noEmit` | **0 errors** |
| Lint / a11y lint | `npm run lint` (oxlint) | **0 errors / 0 warnings** |
| Tests | `npm run test` (vitest) | **183 passed / 183 (35 files)** — no regression from the App.tsx/main.tsx refactor |

Build emits one benign warning: the five `src/assets/fonts/*.woff2` files referenced by `@font-face` "didn't resolve at build time." This is **expected and by design** — CONVENTIONS §G states the `.woff2` files are a build/asset task not yet supplied; until then the system falls back to the named serif/sans fallbacks and the CSS still compiles. **Not a defect; owner/asset-pending.** The build now additionally runs `build:ssr` (the SSR bundle Vite emits to `dist-ssr/`) and `prerender` (writes each route's static HTML) — both succeed.

Site is healthy and fully verifiable. The previously-routed F-1 build-pipeline finding is now RESOLVED (see the Re-verification Addendum above and §G).

Site is healthy and fully verifiable. Proceeding to all deeper checks.

---

## B. Acceptance Criteria Coverage

Legend: ✓ pass · ⚠ partial / owner-pending (structure passes, data is a flagged TBC) · ✗ fail

### Content fidelity (PRD §9)

| Criterion | Status | Evidence |
|---|---|---|
| All 28 preserved items appear on mapped pages | ✓ | Verified item-by-item below (§B "28-item cross-check"). All 28 present as real text on their PRD-mapped page. |
| Full 2026 season present (not just 4 dates) | ✓ | `src/data/events.ts` `season[]` has 22 events: 4 Snook series (incl. May 23 `snook-series-2026-05-23:119`), Snook Jackpot (`:177`), 11 Day Shows (`:193–261`), Waller Qualifier+Finals (`:263–278`), Pick Your Poison (`:281`), 3 Magnolia playdays (`:291–313`). |
| Four Snook cards exact times + number ranges; cards 1–2 9:30–10:45am/11:00am(#1–200), cards 3–4 9:00–10:00am/10:15am(#1–200); all PM 6:00pm(#201–end); card #4 = SNOOK JACKPOT | ✓ | `events.ts`: May 30/Jun 6 `amExhibitions:'9:30–10:45am'`, `amRace:'11:00am'`, `amRange:'#1–200'` (`:139,151`); Jun 13/Jun 20 `'9:00–10:00am'`/`'10:15am'` (`:167,182`); all `pmRace:'6:00pm'`, `pmRange:'#201–end'`; card #4 `title:'SNOOK JACKPOT'` `kind:'jackpot'` (`:179`). Rendered by `EventCard.tsx:73–94`. Test: `EventCard.test.tsx` asserts exact AM/PM times + 10:15am. |
| Buckle classes/pricing (5D Open $50 … High Stakes $75), pre-entry rules, nominations $20/combo, "Negative Coggins Required · Cash Only" as **real text**; obscured flagged not invented | ✓ / ⚠ | `events.ts buckleSeriesDetail:63–90`: all 7 priced classes exact; Leadline + Office fee = `'TBC'` (flagged, not guessed); nominations string `:76`; rules `['Negative Coggins Required','Cash Only']:89`. Rendered as `<dl>`/`<ul>` text in `BuckleSeriesDetail.tsx` + `EventCard.tsx:97–112`. Owner-pending: Leadline price, office-fee amount, Venmo handle (PRD §10.3). |
| No core event/sponsor/schedule content image-only | ✓ | All schedule/classes/pricing/tiers/sponsors render as semantic HTML text from `src/data/`. No `<img>` carries content text anywhere; the only images are hero photo (decorative-described alt) and optional sponsor logos (paired with text name + "Logo to come" placeholder, `SponsorCard.tsx:22–29`). |
| NAP/phone/email/hours exact + consistent across pages; per-venue NAP internally consistent | ✓ / ⚠ | Single source `businessInfo.ts` (Somerville locality) + `venues.ts`. Header/Footer/ContactInfo/schema all read it. Waller street + zip = `'TBC'` (`venues.ts:37,40`, PRD §10.5, flagged). |
| Mission verbatim; "a upbeat"→"an upbeat" only with owner approval | ✓ | `businessInfo.missionVerbatim` keeps literal "a upbeat" (`:44`); `missionApproved:false` (`:45`). `MissionStatement.tsx:11–16` applies the fix only when approved. Test asserts verbatim "a upbeat" by default. |
| All 12 builder artifacts removed/replaced | ✓ | (1) no "Powered by GoDaddy" — Footer is owned. (2) real 6-item nav `nav.ts` + Header drawer, no "More". (3) owned `ConsentNotice` replaces GoDaddy cookie banner. (4) dynamic `new Date().getFullYear()` `Footer.tsx:11`. (5) clean single-encoded meta `seo.ts` (literal apostrophes, tests assert no entity). (6) Results = branded label, no tinyurl exposed. (7) registration flow, not raw mailto sole path. (8) clean React form, no `c1-*`/`data-ux`/`wsimg`. (9) self-hosted Roboto Slab/Inter `@font-face`. (10) solid brand-red `Button` only, no ghost CTAs. (11) all flyer content re-authored as text. (12) one coherent palette via `@theme`. Grep for `wsimg/godaddy/data-ux/c1-/airo/tinyurl` in src/public/dist = none (only PRD-citing comments + test guards). |

### Functionality (PRD §9)

| Criterion | Status | Evidence |
|---|---|---|
| Real multi-page nav (no dead "More") | ✓ | `App.tsx:24–32` routes `/ /events /results /about /sponsors /contact` + catch-all redirect. `Header.tsx` desktop nav + mobile drawer from `nav.ts`. Tests assert 6 labels + active state. |
| Real registration path (event selector + Name/Email(req)/Message/File); not raw mailto sole route | ✓ | `RegistrationForm.tsx`: event `<select>` (`:99`), Name (`:119`), Email required (`:132–142`), Message (`:154`), file attachment (`:168`). EmailJS submit. `mailto:` exists only as secondary contact in Footer/ContactInfo. |
| Each event has add-to-calendar | ✓ | `AddToCalendarButton` on every `EventCard` (`:154`); `addToCalendarIcs.ts` emits AM+PM VEVENTs for series/jackpot, single for others. Tests verify times + venue. |
| Results = branded link/embed; no tinyurl as visible text | ✓ | `ResultsPanel.tsx` renders `results.label` ("Series Points — Rodeo Results App") as visible text; `destinationUrl` never shown. Tests on Results page + panel assert no "tinyurl". ⚠ `destinationUrl:'TBC'` owner-pending (§10.10). |
| Sponsors: 3-tier ($5,000/$1,500/$1,000) + ≥8 sponsors as real text + "Become a sponsor" CTA | ✓ | `sponsorTiers.ts` exact prices; `sponsors.ts` 8 named sponsors w/ contact text; `Sponsors.tsx:36` brand-red CTA → `/contact`. Tests: tier prices, ≥8 wall count. ⚠ Silver lower benefits placeholder + sponsor logos owner-pending (§10.2/.3). |

### SEO (PRD §9)

| Criterion | Status | Evidence |
|---|---|---|
| Unique, clean single-encoded meta title + description per page | ✓ **(content + delivery)** | `seo.ts` has 6 unique titles + descriptions, literal apostrophes (single-encoded). **Now in STATIC HTML:** each `dist/<route>/index.html` carries its unique `<title>` (verified — one per route, all 6 distinct) + meta description; no double-encode (`&amp;#39;` grep clean). **F-1 resolved — no longer runtime-only.** |
| `SportsActivityLocation`/`LocalBusiness` JSON-LD valid w/ exact NAP, geo, hours, tel | ✓ **(now in static HTML)** / ⚠ geo | `businessJsonLdSchema.ts` builds `SportsActivityLocation` w/ NAP, `openingHoursSpecification` Mon–Fri 09:00–17:00, telephone, email. **Verified in `dist/index.html` + `dist/contact/index.html`:** 1 valid JSON-LD block each, `@type SportsActivityLocation` + nested `PostalAddress` (11538 FM 3058, Somerville, TX 77874) + hours + tel + email. Geo omitted (owner-pending §10.7). **F-1 resolved.** |
| `schema.org/Event` for **every** dated event, correct venue, AM+PM both expressed, validates | ✓ **(now in static HTML)** / ⚠ geo | **Verified in `dist/events/index.html`:** 26 valid `@type Event` JSON-LD blocks. AM+PM sibling Events (May 30/Jun 6 `T11:00`, Jun 13/Jun 20-Jackpot `T10:15`, all PM `T18:00`); correct `Place` location across all 3 venues; `EventScheduled` + `OfflineEventAttendanceMode` + `Organization` organizer. All 28 site-wide JSON-LD blocks parse as valid JSON (0 invalid). Geo omitted until supplied. **F-1 resolved.** |
| All three venues consistent NAP+geo in schema location | ✓ / ⚠ | `venues.ts` drives every Event `location`. Waller street/zip + all geo TBC (flagged §10.5/.7). |
| NAP character-for-character consistent across site + schema | ✓ | Single-sourced from `businessInfo.ts`/`venues.ts`; no hardcoded NAP in any component (grep clean). |
| Snook-vs-Somerville canonical city resolved before launch (interim Somerville authoritative) | ⚠ **PRE-LAUNCH GATE** | Interim rule honored: `businessInfo.city:'Somerville'`, comment "authoritative locality (PRD §7 gate)" in schema. **Owner must confirm canonical city before launch — documented hard gate, not a code defect.** |
| `sitemap.xml` (all pages) + `robots.txt` + canonical per page | ✓ | `public/sitemap.xml` lists all 6 clean URLs; `public/robots.txt` allows crawl + references sitemap; both copied to `dist/`. **Canonical now in static HTML** — verified one correct `<link rel="canonical">` per route in `dist/`. **F-1 resolved.** |
| OG + Twitter cards per page, real (non-wsimg) image; double-encoded entity fixed | ✓ **(now in static HTML)** / ⚠ image asset | `Seo.tsx` emits og:type/title/description/url/image/locale + twitter summary_large_image. No entity bug. **Verified in static HTML:** every `dist/` route carries 6 `og:*` + 4 `twitter:*` tags in `<head>` — **OG/Twitter scrapers (no JS) now see them. F-1 resolved.** ⚠ `ogImage:'/og-default.jpg'` placeholder until owner supplies brand image (§10.1). |
| Location keywords in titles/headings/copy | ✓ | "Somerville, TX", "Barrel Racing & Pole Bending", "Brazos Valley", "Snook Summer Buckle Series" throughout `seo.ts` + page headings/copy. |
| Embedded venue map on Contact | ✓ | `VenueMap.tsx` consent-gated lazy Google Maps iframe + always-visible address + directions link. Test verifies map reveal. |
| Semantic HTML, single `<h1>` per page, descriptive alt + link text | ✓ | One `<h1>` per page (tests assert exactly one on About/Results/Sponsors/Contact; Home `<h1>` in Hero). `<header>/<nav>/<main>/<footer>/<address>` present. Descriptive alt + link text; no bare URLs as link text. |
| No review/rating schema unless owned reviews | ✓ | No review or AggregateRating schema anywhere (grep clean). Correct — none exist. |

### Quality / non-functional (PRD §9)

| Criterion | Status | Evidence |
|---|---|---|
| Responsive at 3 breakpoints; tables reflow on mobile; tap targets ≥44px | ✓ (static) | See §D. Stacked `flex-col`/single-col grids on mobile, `md:`/`sm:`/`lg:` multi-col up; AM/PM + class grids `md:grid-cols-2`; tap targets `min-h-[44px]`. Runtime browser check advised. |
| WCAG AA (contrast, focus, labels, alt, reduced-motion) | ✓ | See §E. Text-on-teal = `text-ink` everywhere; visible `focus-visible:ring-2`; labelled inputs; reduced-motion gated. |
| CWV: LCP<2.5s, CLS<0.1, INP<200ms | ✓ (structure) / not field-measured | Hero `fetchPriority="high"` + explicit width/height; images `loading="lazy"`; map lazy + consent-gated; explicit dims on hero/sponsor/map (aspect-ratio) to hold CLS; no render-blocking 3rd-party script; fonts `display:swap`. Real CWV must be measured on deployed mid-tier mobile (advisory). |
| Single brand-red CTA site-wide (solid, not ghost); teal section-only, pink accent-only | ✓ | See §C. `Button.tsx` is the only solid CTA primitive — brand-red, no tone/variant prop. No `bg-pink`/`bg-teal` button (grep clean). |
| Dynamic copyright; owned consent/policy; no GoDaddy | ✓ | `Footer.tsx:11` dynamic year; owned `/privacy` link + `ConsentNotice`; no GoDaddy. ⚠ owned privacy statement copy owner-pending (§10.14). |
| Form keys in `VITE_*`; spam protection | ✓ | `RegistrationForm.tsx:74–77` reads only `import.meta.env.VITE_EMAILJS_*` (no hardcoded keys); `.env.example` documents them; honeypot field `:186–195` + silent abort `:63`. |

### 28-item preserved-content cross-check (all ✓)
1 legalName (Header/Footer/About) · 2 tagline (Hero/OG) · 3 "RUN WHERE THE MONEY IS AT" (Hero h1→/contact) · 4 mission verbatim (About+Home) · 5 "Experience Thrilling Speed Events" (Hero/MissionStatement) · 6 series name (Events) · 7–10 four cards exact (events.ts) · 11 A.M. Section note + "Upcoming Events" (`AmSectionNote`) · 12 results link branded (`ResultsPanel`, no tinyurl) · 13 form field set (`RegistrationForm`) · 14 NAP · 15 phone tel: · 16 email · 17 hours · 18 logo (placeholder `logo.svg`, ⚠§10.1) · 19 action photo (placeholder `hero.png`, ⚠§10.1) · 20 "Join In" (`Sponsors.tsx:30`) · 21 three tiers exact · 22 ≥8 sponsors w/ contact · 23 full season · 24 buckle-series detail · 25 three Magnolia playdays · 26 exact labels + SNOOK JACKPOT title · 27 contact intro copy (`businessInfo.contactIntro`) · 28 "22 Champion Buckles" + categories (`SeasonBuckleBanner`).

---

## C. Visual Coherence (anti-drift whole-site check)

| Check | Result | Evidence |
|---|---|---|
| Spacing rhythm | **Consistent** | All full-bleed bands flow through one `SectionBand` primitive with fixed inner rhythm `px-4 py-12 md:py-16` + `max-w-6xl` (`SectionBand.tsx:29`). Every page composes only SectionBands (red/teal/cream), so vertical rhythm cannot drift per section. Intra-band gaps use scale keys (`gap-4/6/8/12`). |
| Component-pattern consistency | **Consistent** | Single shared primitives reused everywhere: one `Button` (CTA), one `SectionBand` (banding), one `EventCard`, one `SponsorCard`/`SponsorTierCard`. Headings consistently `font-display uppercase tracking-wide`; body `font-sans`. No one-off card or button variant found. |
| Single primary CTA color | **Yes — clean** | `Button.tsx` is the sole solid CTA, `bg-brand-red`→hover `bg-brand-red-dark`, white label, with an explicit comment that there is intentionally no tone/color prop. Used for every primary action (Header Register, Hero, EventCard Register, NextEvent, Sponsors "Become a sponsor", form submit, consent dismiss). Secondary actions are visually distinct + consistent: text links `text-brand-red underline` (mission/results/view-all), tertiary `AddToCalendarButton` is a neutral `text-ink` underline button. Pink is accent-only (`text-pink` on "Series Points"/"22 Champion Buckles", jackpot badge) — never a button. Teal is ground-only. Grep confirms **no `bg-pink` and no teal button.** |
| No design-system bypasses | **None** | Hardcoded-hex scan: 0 in className/JSX (the `#1–200`/`#201–end` hits are rider-number ranges in `events.ts`, correct preserved content). Arbitrary `[...]` scan: only the **sanctioned** `min-h-[44px]`/`min-w-[44px]` tap floors (Header, RegistrationForm, AddToCalendar) and `aspect-[4/3]` ratios (VenueMap, ResultsPanel). Off-scale spacing keys (5/7/9/10/11/14/20…): **none.** All color/size/spacing map to `@theme` tokens. |

No coherence findings.

---

## D. Responsive Behavior (static markup analysis; runtime spot-check advised)

| Breakpoint | Result | Evidence |
|---|---|---|
| Mobile (≤640px) | **Pass** | Header collapses desktop `nav` (`hidden md:flex`) to a hamburger + fixed right drawer (`md:hidden`). Page grids are single-column by default and only widen at `md:`/`sm:`/`lg:` (Home `md:grid-cols-2`, Events cards `md:grid-cols-2`, Sponsors wall `sm:grid-cols-2 lg:grid-cols-4`, Footer `md:grid-cols-3`). EventCard AM/PM + class lists are single-col then `md:grid-cols-2` → **time/class tables reflow to stacked on mobile.** Tap targets `min-h-[44px]` on nav links, icon buttons (`min-w-[44px]`), form fields, calendar button. |
| Tablet (641–1024px) | **Pass** | `md:` two/three-col layouts engage; `max-w-6xl` containers + `aspect-[4/3]` media hold; no fixed widths that would overflow. |
| Desktop (>1024px) | **Pass** | Full multi-column layouts (`lg:grid-cols-4` sponsor wall) render; hero `py-24` full-bleed; content capped at `max-w-6xl` centered. |
| No horizontal scroll at any width | **Pass (static)** | No fixed pixel widths on content; everything is `w-full`/`max-w-*` + responsive grids; images `w-full object-cover`/`object-contain` + `max-w` via container; drawer is `w-64` but `fixed` (overlay, not in flow). No element forces width beyond viewport. **Recommend a runtime check at 320/375/768/1280px to confirm no incidental overflow (long unbroken strings, the map iframe).** |

No responsive findings. Note: this is a static source assessment; a runtime browser/device check is advisable before launch, especially for the consent-gated map iframe and long venue/class strings on the narrowest viewports.

---

## E. Accessibility (WCAG 2.1 AA per PRD §7)

| Check | Result | Evidence |
|---|---|---|
| Exactly one `<h1>` per page, no skipped levels | **Pass** | Home: Hero `<h1>`, all section headings `<h2>` (NextEvent/Mission/Results h2, EventCard h3, sub h4). Events: one `<h1>` "2026 Season", children h2→h3→h4. About/Results/Sponsors/Contact each one `<h1>` (tests assert exactly one). No level skips observed. |
| Semantic landmarks | **Pass** | One `<header>` (`Header.tsx`, sticky banner), `<nav aria-label>` (primary + footer), one `<main>` (`App.tsx:23`), `<section>` bands, one `<footer>` (`role` contentinfo), `<address>` for NAP in Footer + ContactInfo (`not-italic`). |
| Color contrast (incl. teal-text AA rule) | **Pass** | **Text-on-teal rule honored everywhere:** every `bg-teal`/`bg-teal-deep` ground uses `text-ink` (SectionBand teal `:13`, SponsorTierCard `bg-teal-deep text-ink`, Sponsors "Join In" h2 `text-ink`). **No `text-white` on any teal ground** (grep confirms all `text-white` is on `bg-brand-red` — SectionBand red/Footer/SeasonBuckleBanner/Button — or `bg-ink` — Hero overlay/ConsentNotice). brand-red+white 4.76:1, ink+cream/white ≥13.7:1, ink+teal 7.62:1 — all pass AA. |
| Keyboard operability + visible focus | **Pass** | All interactive elements native (`button`/`a`/`Link`/`select`/`input`). Consistent `focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2` across Button, nav links, icon buttons, form fields, map links. Drawer closes on Esc (`Header.tsx:36–43`) and on route change. |
| Forms — labels + accessible errors | **Pass** | Every `RegistrationForm` field has an explicit `<label htmlFor>`; email error wired via `aria-invalid` + `aria-describedby="email-error"`; file error likewise; success `role="status"`, error `role="alert"`. EventsFilterBar selects labelled. Honeypot `aria-hidden`/`tabindex=-1`. |
| Images — meaningful alt / decorative | **Pass** | Hero `alt="Barrel racer rounding a barrel at full speed in the arena"`; overlay `aria-hidden`; logo `alt="Smokin' Guns Productions"` (gives the link its name) with the visible text lockup `aria-hidden`; sponsor logos `alt="<name> logo"`, placeholder `aria-hidden`. No image-only content. |
| Reduced motion | **Pass** | All motion gated: `motion-safe:transition-*` + `motion-reduce:transition-none` on Button, EventCard, ConsentNotice, drawer overlay. No autoplay media. |

No accessibility findings.

---

## F. Test Tier Gate — light

**Gate definition (this build):** build clean + 0 TS errors + a11y lint passes + project renders + all light-tier smoke tests pass (no coverage threshold — that is the full tier).

| Gate element | Result |
|---|---|
| Build clean | ✓ PASS |
| 0 TypeScript errors | ✓ 0 |
| a11y / lint passes | ✓ oxlint 0/0 |
| Project renders | ✓ `App.test.tsx` + every page test renders without crashing |
| Smoke tests pass | ✓ **183/183** across 35 files |

Smoke coverage spans every component + page: each renders without crashing; key interactions work (Button click/disabled, nav active state + drawer, EventsFilterBar change callbacks, AddToCalendar download + AM/PM VEVENTs, ConsentNotice dismiss + persist, VenueMap consent reveal); **the contact form validates** (`RegistrationForm.test.tsx`: empty/invalid email blocks submit + shows inline error wired by `aria-describedby`; valid entry calls `emailjs.sendForm` + shows success; honeypot silently aborts; `?event=` pre-selects); plus content/SEO guards (exact times, exact tier prices, ≥8 sponsors, single `<h1>`, no-tinyurl, no-GoDaddy, verbatim mission, literal apostrophes, JSON-LD shape). EmailJS is mocked so no live `VITE_*` keys are needed.

**Tier gate: SATISFIED.**

---

## G. Findings & Routing

### F-1 — ✅ RESOLVED (2026-06-25) — SPA had no prerendering: per-page meta, OG/Twitter, canonical, and Event JSON-LD were runtime-only in the static HTML

- **Original finding:** The site was a pure client-rendered Vite SPA. `dist/index.html` shipped an empty `<div id="root">`, the scaffold title `<title>smokin-guns-productions</title>`, and no description/canonical/OG/Twitter/JSON-LD — all injected at runtime by `react-helmet-async` only after the JS bundle executed. Non-JS crawlers and social/OG scrapers saw only the generic shell.
- **Fix applied:** a build-time static prerender (SSG) was added — `src/entry-server.tsx` (`renderToString` of `AppServer`, hoisting helmet's title/meta/canonical/OG/Twitter/JSON-LD into a head string) + `scripts/prerender.js` (writes `dist/<route>/index.html` for all 6 clean URLs, drops the scaffold `<title>`, injects head + `#root` markup) — wired into `npm run build` (`tsc -b && vite build && build:ssr && prerender`). `App.tsx` was refactored into `AppShell` (router-free) + `App` (BrowserRouter, client) + `AppServer` (StaticRouter + HelmetProvider context); `main.tsx` now `hydrateRoot`s the populated prod root / `createRoot`s the empty dev root. No new dependencies.
- **Verification (BUILT `dist/` output, post-`npm run build`):** all 6 routes emit real static HTML (15.4–79.2 kB, populated `#root`); each has exactly one unique PRD §7 `<title>` with **no scaffold fallback remaining** anywhere in `dist/`; one correct canonical + 6 og + 4 twitter per route; `SportsActivityLocation` JSON-LD on Home + Contact (exact NAP/hours/tel); **26** `schema.org/Event` blocks on Events (AM `T11:00`/`T10:15` + PM `T18:00` siblings, correct venue each, EventScheduled + OfflineEventAttendanceMode + organizer); **all 28 site-wide JSON-LD blocks parse as valid JSON (0 invalid)**; no double-encoded entity. See the Re-verification Addendum at the top of this report for the full evidence table.
- **Status:** Closed. The headline PRD §7 SEO win is now delivered in static HTML at build time, visible to non-JS crawlers and OG scrapers. The affected SEO acceptance criteria are upgraded from ✓(content)/⚠(delivery) to **✓ full pass** in §B. (Deploy note for the orchestrator/host: confirm the static host serves the per-route `dist/<route>/index.html` for each clean URL — the prerender produces directory-index files that map cleanly to `/events`, `/contact`, etc.)

### Owner-pending placeholders (by design — NOT defects, flagged TBC per PRD §10)
Documented here for the orchestrator/owner checklist; no routing needed:
- Geo coordinates for all three venues (`venues.ts` geo:null) — JSON-LD correctly omits geo until supplied (§10.7).
- Waller Co. Fairgrounds street address + zip = `'TBC'` (§10.5).
- Results `destinationUrl = 'TBC'` — resolved Rodeo Results App URL (§10.10).
- High-fidelity assets: brand logo (`logo.svg` placeholder), hero action photo (`hero.png` placeholder), OG image (`/og-default.jpg` placeholder), sponsor logos ("Logo to come") + display permission (§10.1/.2).
- Obscured flyer values rendered as explicit TBC: Leadline price, office-fee amount, Venmo handle, full Silver-tier benefits, playday age-splits/prices/payout (§10.3); full Day Shows date list (§10.4).
- Self-hosted `.woff2` font files not yet added (build/asset task per CONVENTIONS §G) — falls back to system fonts.
- Owned privacy-statement copy + `/privacy` page content (§10.14).
- EmailJS `VITE_*` keys (supplied at deploy; `.env.example` documents).

### PRE-LAUNCH GATE (documented, owner action — NOT a code defect)
- **Snook-vs-Somerville canonical city** (PRD §7 / §9 / §10.6): interim rule correctly implemented (Somerville authoritative locality in NAP + schema). Owner must confirm the single canonical city before launch. Hard pre-launch gate by design.

---

## H. Verification Summary

```
Re-verified 2026-06-25 after the F-1 SSG fix.
Acceptance criteria: 41/41 mapped — 37 full pass (✓), 4 owner-pending (⚠, data-only TBC), 0 fail (✗)
  (the 4 SEO delivery caveats previously ⚠ are now ✓ full pass — F-1 closed; remaining ⚠ are flagged TBC data
   placeholders incl. the documented Snook/Somerville pre-launch gate)
Build: PASS (now runs build:ssr + prerender for all 6 routes) | Typecheck: 0 errors | Lint: 0 errors / 0 warnings | Tests: 183/183 pass (35 files)
F-1 (SPA prerendering): RESOLVED — per-page title/meta/canonical/OG/Twitter + SportsActivityLocation (Home,Contact)
  + 26 schema.org/Event (Events) now in STATIC dist HTML; no scaffold fallback title; all 28 JSON-LD blocks valid JSON
Visual coherence: PASS (0 issues — consistent rhythm, single brand-red CTA, teal section-only, pink accent-only, no token bypasses; refactor introduced no drift)
Responsive: mobile/tablet/desktop PASS (static analysis; no horizontal scroll; runtime device check advised)
Accessibility (WCAG 2.1 AA): PASS (one h1/page — now confirmed in built HTML, teal-text AA rule honored everywhere, focus/labels/alt/reduced-motion all pass)
Test tier (light): SATISFIED (build+typecheck+a11y+render + all smoke tests incl. contact-form validation + client-hydration testability pass)
Findings routed back: 0 open (F-1 resolved; to designer: 0)
Owner-pending placeholders: by design, not routed (geo, Waller address, results URL, hi-fi assets, obscured flyer TBCs, fonts, privacy copy, EmailJS keys)
Pre-launch gate: Snook-vs-Somerville canonical city (owner confirm; interim Somerville authoritative — implemented)
Deploy note: confirm the static host serves each prerendered dist/<route>/index.html at its clean URL.
```
