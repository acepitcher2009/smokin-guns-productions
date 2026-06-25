# Design System & Conventions — Smokin' Guns Productions LLC

## Document Metadata

- **PRD path:** `ai-docs/prd/smokin-guns-productions.md`
- **Date:** 2026-06-25
- **Business / site name:** Smokin' Guns Productions LLC
- **Business-type profile:** `general-local` (fallback), layered with event-producer / equestrian-sports needs
- **Design system location:** `src/index.css` (Tailwind v4 `@theme`)
- **Visual anchoring:** screenshot-anchored (PRD §2, 23 screenshots)

---

## A. Design Token Source

Every token in `src/index.css` traces to a row here. Where the PRD specifies a value it is used **exactly**; designer-chosen defaults are in section F.

| Token group | PRD source | Value(s) |
|---|---|---|
| `--color-brand-red` | §2 palette table — Primary (hero/footer bands, Series Points band, CTAs, phone) | `#E31914` |
| `--color-brand-red-dark` | §2 palette table — CTA hover/pressed (derived, AA) | `#B5120E` |
| `--color-teal` | §2 palette table — Co-primary/secondary, owns sponsor program | `#2EB8A8` |
| `--color-teal-deep` | §2 palette table — teal hover/pressed (derived, AA) | `#239A8D` |
| `--color-pink` | §2 palette table — accent only (never a button) | `#E5398E` |
| `--color-cream` | §2 palette table — connective background (NOT stark white) | `#F3EBDD` |
| `--color-cream-deep` | §2 palette table — warmer cream, dividers/nested panels | `#E8DCC2` |
| `--color-ink` | §2 palette table — headings & body text on light | `#121212` |
| `--color-white` | §2 palette table — form fields, cards on red/teal | `#FFFFFF` |
| `--font-display` | §2 Typography — strong slab in wide-tracked uppercase (PRD recommends Roboto Slab) | `"Roboto Slab", serif` |
| `--font-sans` | §2 Typography — clean sans (PRD recommends Inter) | `"Inter", sans-serif` |
| Type scale (`--text-sm` … `--text-6xl`) | §2 Typography — rem scale 3.0 / 2.25 / 1.75 / 1.375 / 1.125 / 1.0 / 0.875 | see §G |
| Spacing scale (`--spacing-*`) | §2 Spacing — px scale 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 | see §G |
| Radii (`--radius-sm/md/lg`) | §2 Radii — sm 4px, md 8px (cards), lg 16px (hero media) | 4px / 8px / 16px |
| `--shadow-card` | §2 Shadows — subtle elevation on event/standings cards only | `0 2px 8px rgba(18,18,18,0.08)` |

**Color role discipline (PRD §2 — enforce in every component):**

- `brand-red` is the **single** CTA color site-wide. Solid, high-contrast buttons — never ghost/outline.
- `teal` is a **section / background** color (the sponsor program). **Never** a CTA.
- `pink` is an **accent only** — highlights, standings/award emphasis. **Never** a button. Not used for body text (esp. not pink-on-teal).
- `cream` (not white) is the connective ground for most content bands.

**Text-on-ground contrast (WCAG AA — verified, PRD §2 "deepen if needed"):** the PRD's instinct to deepen teal for white text does **not** reach AA (white-on-`teal-deep` is only 3.45:1). Resolved at the system level by setting the text color per ground rather than adding another teal — see the **Text on coloured grounds** rule in §E. Summary: **text on any teal ground = `text-ink`; white text is reserved for the `brand-red` ground only.**

---

## B. Code Style

Aligned with the installed Prettier config (`.prettierrc`: `semi: true`, `singleQuote: true`, `trailingComma: "es5"`, `printWidth: 100`). Run `npm run format` before committing.

- **Semicolons:** required.
- **Quotes:** single quotes in TS/JS (`'./Hero'`); double quotes only where JSX attribute values conventionally use them — keep JSX attribute strings in double quotes for readability (`className="..."`), single quotes everywhere else.
- **Trailing commas:** `es5` (multiline arrays/objects yes; function params no).
- **Line width:** 100 characters.
- **Indentation:** 2 spaces, no tabs.
- **Import ordering** (blank line between groups):
  1. External packages (`react`, etc.)
  2. Internal modules — components, then data/types (`../data/events`)
  3. Assets / styles (`../assets/hero.png`)
- **Imports are relative** (`../data/events`). No path aliases are configured; do not introduce one without updating `tsconfig`.

---

## C. Component Structure

- **One component per file.** File name is PascalCase matching the component: `Hero.tsx`, `EventCard.tsx`, `SponsorTierCard.tsx`.
- **Functional components only**, with typed props.
- **Named exports** (not default) for components — `export function Hero(...)`. This keeps import names consistent across the codebase. (`src/main.tsx`'s existing default `App` import is the one pre-scaffolded exception and may stay.)
- **Props types live inline** as an `interface <Component>Props` directly above the component in the same file. Shared/domain types (event, venue, sponsor shapes) live with their data file in `src/data/` and are imported.
- **No `any`.** Every prop and every data shape is explicitly typed. Prefer precise unions (e.g. `type EventKind = 'series' | 'jackpot' | 'dayShow' | 'shootout' | 'playday'`) over `string`.
- **Variants** are expressed as typed props (a `tone: 'red' | 'teal' | 'cream'` prop), never as free-form class strings passed in by callers.
- **Markup uses only design-system tokens** via Tailwind classes (see §E).

Canonical skeleton every component copies:

```tsx
import type { SeasonEvent } from '../data/events';

interface EventCardProps {
  event: SeasonEvent;
  tone?: 'cream' | 'white';
}

export function EventCard({ event, tone = 'cream' }: EventCardProps) {
  return (
    <article className="rounded-md bg-cream-deep p-6 shadow-card">
      <h3 className="font-display text-3xl uppercase tracking-wide text-ink">{event.title}</h3>
      <p className="mt-2 font-sans text-base text-ink">{event.dateLabel}</p>
    </article>
  );
}
```

---

## D. File Organization

Multi-page Vite + React + TypeScript static site with **clean URLs per page** (`/events`, `/results`, `/about`, `/sponsors`, `/contact`, plus `/` home). A routing package (the decomposer specifies it in `DEPENDENCIES.md`) maps each path to a page component; the build emits clean per-page URLs.

```
src/
  assets/
    fonts/            ← self-hosted .woff2 files (see §G self-hosting note)
    hero.png, ...     ← imagery
  components/         ← reusable UI + section components (Header, Footer, EventCard, SponsorTierCard, ...)
  pages/              ← one component per route: Home.tsx, Events.tsx, Results.tsx, About.tsx, Sponsors.tsx, Contact.tsx
  data/               ← editable, typed content files (the owner edits these, not markup)
  App.tsx             ← composes the router: maps clean URLs → page components, renders Header/Footer shell
  main.tsx           ← entry (pre-scaffolded)
  index.css          ← the design system (@theme tokens)
```

- **Components** in `src/components/`. **Page components** (one per route) in `src/pages/`.
- **`App.tsx`** owns the route table (path → page component) and the persistent Header/Footer shell.
- **Editable data files** in `src/data/`. Per PRD §6, content the owner must update without touching components lives here, each with an exported type and an exported typed constant. Required data files:
  - `events.ts` — the **full 2026 multi-venue season** (Snook series incl. May 23, Snook Jackpot, Day Shows, Waller Shootout Qualifier & Finals, Pick Your Poison Playday, three Magnolia Cowboy Church Playdays), each event with per-event **times** (AM/PM races + exhibitions), **classes**, and **pricing** stored **exactly** as preserved. Export `type SeasonEvent`, `type EventKind`, `const season: SeasonEvent[]`.
  - `venues.ts` — per-venue **NAP + geo** for Snook Rodeo Arena, Magnolia Cowboy Church, Waller Co. Fairgrounds. Export `type Venue`, `const venues: Record<VenueId, Venue>`.
  - `businessInfo.ts` — primary NAP, phone, email, and **hours** (used in header/footer/Contact/schema). Export `type BusinessInfo`, `const businessInfo`.
  - `results.ts` — the **results destination** (Rodeo Results App link/embed config). Export `type ResultsSource`, `const results`.
  - `sponsorTiers.ts` — the **three sponsorship tiers** (Platinum $5,000 / Gold $1,500 / Silver $1,000) with prices and benefit lists. Export `type SponsorTier`, `const sponsorTiers: SponsorTier[]`.
  - `sponsors.ts` — the **sponsor list** (≥8 named sponsors with name + contact info). Export `type Sponsor`, `const sponsors: Sponsor[]`.
  - `nav.ts` — primary nav items (clean URLs). Export `type NavItem`, `const nav: NavItem[]`.
- **Data file naming:** lowerCamelCase filename; exported type is PascalCase singular (`Sponsor`), exported data constant is lowerCamelCase (`sponsors`).
- **Content / markup separation rule:** components receive data as typed props or import it from `src/data/`. **No hardcoded times, prices, class names, NAP, or sponsor data inside JSX.** Exact preserved values (times, prices, class names, NAP) live only in `src/data/`.

---

## E. Token Consumption Rules (anti-drift core)

Components consume the design system through Tailwind utility classes that map to the `@theme` tokens — **never** hardcoded values. If a value is missing, **add a token to `src/index.css`** — never inline a one-off.

Approved class families (all map to §G tokens):

- **Color:** `bg-brand-red`, `bg-brand-red-dark`, `bg-teal`, `bg-teal-deep`, `bg-cream`, `bg-cream-deep`, `bg-white`, `text-ink`, `text-white`, `text-brand-red`, `text-pink`, `border-*` from the same palette. Use **only** these palette tokens — no other colors exist in the system.
- **Type size:** `text-sm` / `text-base` / `text-xl` / `text-3xl` / `text-4xl` / `text-5xl` / `text-6xl` (the PRD scale). No arbitrary sizes.
- **Font family:** `font-display` (headings/lockups, paired with `uppercase tracking-wide`) and `font-sans` (body/dense content).
- **Spacing:** the PRD scale keys only — `1, 2, 3, 4, 6, 8, 12, 16, 24` (e.g. `mt-6`, `p-8`, `gap-4`). Do **not** use off-scale keys (`5, 7, 9, 10, 11, ...`) or arbitrary values.
- **Radius:** `rounded-sm` (4px), `rounded-md` (8px, cards), `rounded-lg` (16px, hero media).
- **Shadow:** `shadow-card` only (event/standings cards). Avoid heavy drop shadows.

```
✅  <button className="bg-brand-red text-white text-base px-6 py-3 rounded-md shadow-card">
✅  <h2 className="font-display text-4xl uppercase tracking-wide text-ink mt-12">
❌  <button className="bg-[#E31914] text-[15px] px-[26px] rounded-[7px] shadow-[0_4px_20px_#000]">
❌  <h2 className="text-[28px] mt-[50px] text-[#121212]">   (hardcoded hex, off-scale spacing, arbitrary size — drift)
```

### Text on coloured grounds (WCAG AA — MANDATORY, single rule)

White text does **not** meet AA on either teal brand ground, so the text color is fixed by the ground. This is the one rule every text-bearing coloured panel (SectionBand, SponsorTierCard, sponsor program, the crossed-pistols ground, any teal band) must follow — **no per-component exceptions:**

| Ground (`bg-…`) | Hex | Text class to use | Verified contrast | AA |
|---|---|---|---|---|
| `bg-teal` | `#2EB8A8` | **`text-ink`** (never `text-white`) | **7.62:1** | PASS (normal + large) |
| `bg-teal-deep` | `#239A8D` | **`text-ink`** (never `text-white`) | **5.42:1** | PASS (normal + large) |
| `bg-brand-red` | `#E31914` | **`text-white`** | **4.76:1** | PASS (normal + large) |
| `bg-brand-red-dark` | `#B5120E` | `text-white` | 6.87:1 | PASS (normal + large) |
| `bg-cream` / `bg-cream-deep` / `bg-white` | — | `text-ink` | ≥13.7:1 | PASS |

- **On teal (both shades): `text-ink`, never `text-white`.** `white-on-teal` is 2.46:1 and `white-on-teal-deep` is 3.45:1 — both **fail** AA. There is intentionally **no** third "dark teal text" token: the screenshot-anchored `teal #2EB8A8` stays the visible sponsor/section brand ground, and `text-ink` on it passes cleanly — one token, one rule, no drift.
- **White-on-colour is reserved for the `brand-red` ground only** (`brand-red` 4.76:1, `brand-red-dark` 6.87:1 — both pass). The single `brand-red` CTA therefore keeps its white label.
- `pink` remains accent/logo only and is never a text-on-color body treatment (PRD §2: pink-on-teal is decorative only).

```
✅  <section className="bg-teal text-ink ...">        (7.62:1 — passes AA)
✅  <article className="bg-teal text-ink ...">         (SponsorTierCard on the teal program ground)
✅  <button className="bg-brand-red text-white ...">  (4.76:1 — passes AA; the single CTA)
❌  <section className="bg-teal text-white ...">       (2.46:1 — FAILS AA; never white text on teal)
❌  <div className="bg-teal-deep text-white ...">      (3.45:1 — FAILS AA normal text)
```

Additional discipline tied to the PRD:

- **Single CTA color:** every actionable button is `bg-brand-red` (hover `bg-brand-red-dark`). Never make a `teal` or `pink` button.
- **No ghost/outline primary buttons** — solid, high-contrast (PRD discards the weak outline CTAs).
- **All motion** (fade/slide on cards) must be gated behind `motion-safe:` / `prefers-reduced-motion` (PRD §5).

---

## F. Designer-Chosen Defaults

Values the build needs that the PRD did not pin to an exact number. All others trace to §A.

- **Display font = Roboto Slab; body font = Inter** — the PRD *recommends* these by name in §2 (display: "Roboto Slab or a Western-leaning slab"; body: "Inter or Source Sans 3"). Chose the first recommendation in each pair for a strong slab + highly readable sans. Both are open-license (Apache 2.0 / SIL OFL) and self-hostable per §6.
- **Type-scale naming → Tailwind keys:** the PRD gives 7 rem sizes but no names. Mapped largest→smallest to `--text-6xl` (3.0rem), `--text-5xl` (2.25), `--text-4xl` (1.75), `--text-3xl` (1.375), `--text-xl` (1.125), `--text-base` (1.0), `--text-sm` (0.875). Reason: keeps Tailwind's familiar size-key vocabulary while honoring the exact rem values.
- **Line-heights:** the PRD specifies sizes but not line-heights. Chose tight on display (1.05–1.25) and comfortable on body (1.5–1.6) for readability of dense event/time/class content. Conventional, AA-friendly.
- **Spacing-key naming:** the PRD's px scale (4/8/12/16/24/32/48/64/96) is named with Tailwind's rem-based keys (`1/2/3/4/6/8/12/16/24`) so each PRD value maps to an existing default key — reinforcing, not fighting, Tailwind's scale. No new arbitrary keys introduced.
- **Font weights self-hosted:** Roboto Slab 700/800 (display lockups), Inter 400/600/700 (body, emphasis, strong). Chosen to cover heading + body + emphasis without shipping unused weights (CWV). PRD silent on weights.
- **`font-display: swap`** on all `@font-face` — chosen to avoid invisible text during load (FOIT) and protect LCP (PRD §6 CWV targets). PRD silent on swap behavior.

No invented **colors** or **scales** — every color, the type scale, spacing scale, radii, and shadow value comes from PRD §2 exactly.

---

## G. The Design System in `src/index.css`

`src/index.css` retains `@import "tailwindcss";` at the top, then the `@font-face` blocks, then the populated `@theme`. Token summary (full literal CSS lives in the file):

- **Colors (9):** `--color-brand-red`, `--color-brand-red-dark`, `--color-teal`, `--color-teal-deep`, `--color-pink`, `--color-cream`, `--color-cream-deep`, `--color-ink`, `--color-white`.
- **Fonts (2):** `--font-display` (Roboto Slab + serif fallbacks), `--font-sans` (Inter + system-sans fallbacks).
- **Type scale (7 steps):** `--text-6xl` 3rem … `--text-sm` 0.875rem, each with a `--line-height`.
- **Spacing (9 steps):** `--spacing-1` (4px) … `--spacing-24` (96px) on the PRD's px scale.
- **Radii (3):** `--radius-sm` 4px, `--radius-md` 8px, `--radius-lg` 16px.
- **Shadow (1):** `--shadow-card` `0 2px 8px rgba(18,18,18,0.08)`.

### Self-hosting the fonts (PRD §6/§7 — NO external CDN)

The fonts are loaded **only** via the `@font-face` rules in `src/index.css` — there is **no** Google Fonts `<link>` and no external stylesheet. Procedure:

1. Obtain the open-license `.woff2` files (Roboto Slab — Apache 2.0; Inter — SIL OFL). Acceptable sources: the official font repos, `npm` font packages (`@fontsource/roboto-slab`, `@fontsource/inter` — copy the `.woff2` out), or `google-webfonts-helper`. Do **not** reference any remote URL at runtime.
2. Place them in `src/assets/fonts/` with the exact filenames the `@font-face` rules expect:
   - `roboto-slab-700.woff2`, `roboto-slab-800.woff2`
   - `inter-400.woff2`, `inter-600.woff2`, `inter-700.woff2`
3. Vite fingerprints and bundles these as local assets at build time — they ship from the site's own origin.
4. Until the files are added, the CSS still compiles and the system falls back to the named serif/sans fallbacks; supplying the files activates the brand type. (Adding the font files is a build/asset task, not a designer deliverable — flagged for the component build phase.)

### Literal `@theme` (excerpt — see `src/index.css` for the full file)

```css
@import "tailwindcss";

/* @font-face blocks for Roboto Slab (700/800) and Inter (400/600/700) — self-hosted */

@theme {
  --color-brand-red: #e31914;
  --color-brand-red-dark: #b5120e;
  --color-teal: #2eb8a8;
  --color-teal-deep: #239a8d;
  --color-pink: #e5398e;
  --color-cream: #f3ebdd;
  --color-cream-deep: #e8dcc2;
  --color-ink: #121212;
  --color-white: #ffffff;

  --font-display: "Roboto Slab", ui-serif, Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --text-6xl: 3rem;        --text-6xl--line-height: 1.05;
  --text-5xl: 2.25rem;     --text-5xl--line-height: 1.1;
  --text-4xl: 1.75rem;     --text-4xl--line-height: 1.15;
  --text-3xl: 1.375rem;    --text-3xl--line-height: 1.25;
  --text-xl: 1.125rem;     --text-xl--line-height: 1.5;
  --text-base: 1rem;       --text-base--line-height: 1.6;
  --text-sm: 0.875rem;     --text-sm--line-height: 1.5;

  --spacing-1: 0.25rem;  --spacing-2: 0.5rem;  --spacing-3: 0.75rem;
  --spacing-4: 1rem;     --spacing-6: 1.5rem;  --spacing-8: 2rem;
  --spacing-12: 3rem;    --spacing-16: 4rem;   --spacing-24: 6rem;

  --radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 16px;

  --shadow-card: 0 2px 8px rgba(18, 18, 18, 0.08);
}
```

---

## H. Verification

- [x] `src/index.css` retains `@import "tailwindcss";` and contains a populated `@theme` block
- [x] Every PRD palette color, the type scale, fonts, spacing scale, radii, and shadow are present as tokens
- [x] No token contradicts a PRD-specified value (colors used exactly as given)
- [x] Every token traces to §A, or is listed in §F as a designer-chosen default
- [x] Token consumption rules (§E) stated with a ✅/❌ example
- [x] `npm run typecheck` passes and the CSS compiles (`npm run build`)
