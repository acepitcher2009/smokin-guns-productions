# Component Build Story — Hero (Home full-bleed hero)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #12; §E Build Order #13)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `Hero`
- Build-order position: `13`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor landing on the Home page, I need a bold full-bleed hero with the barrel-racing action photo, the brand headline "RUN WHERE THE MONEY IS AT," the tagline "WELCOME TO THE HOUSE OF SMOKIN' RUNS!", and a single obvious Register button, so that I immediately understand what the business does and how to enter a race.

---

## B. Background / Context (required)

Build-order step 13 — the first Home page section. Per PRD §4.1 and §8 items 2, 3, 5, 19, the hero preserves the exact headline + tagline copy, frames "Experience Thrilling Speed Events," and routes its single `brand-red` CTA to the registration/Contact flow (never a `mailto:`, discard item 7). It uses the `Button` primitive (story 3, `as="link"`) for the CTA and may sit inside a `SectionBand tone="red"` (story 4) or render its own full-bleed media with an `ink` overlay. The hero image must ship with explicit `width`/`height` and a responsive `srcset` to protect LCP/CLS (PRD §6, §5). No prior story renders page content — this is the first visible page section.

The headline/tagline are fixed brand copy, not varying owner-editable data; they may live as Home-page constants (the tagline is already mirrored into `seo.ts` as `ogTitle` from story 1). Do **not** invent a data file for them.

---

## C. Acceptance Criteria (required)

1. Renders the **exact** headline `RUN WHERE THE MONEY IS AT` as the single page `<h1>` and the **exact** sub-headline `WELCOME TO THE HOUSE OF SMOKIN' RUNS!` (apostrophe single-encoded — literal `'`).
2. Includes the framing line **"Experience Thrilling Speed Events"** as supporting copy.
3. Full-bleed media: the barrel-racing action photo as the background/feature image with a dark `ink` overlay so white headline text meets WCAG AA over the photo.
4. A single CTA — `Button` `as="link"` `to="/contact"` labeled e.g. "Register" — and **no second CTA color** anywhere in the hero (only `brand-red`).
5. The hero image has **explicit `width` and `height` attributes** (no layout shift) and a responsive `srcset`/`sizes` (or `<picture>`); below-the-fold images lazy-load, but the hero LCP image is eager (`loading="eager"`, `fetchpriority="high"`).
6. Headline uses `font-display text-6xl uppercase tracking-wide text-white`; hero media corners are `rounded-lg` (16px) where the media is a contained element.
7. Any entrance animation is gated behind `motion-safe:` (`prefers-reduced-motion` honored); no autoplay video.
8. The CTA routes to `/contact` (registration), **not** a `mailto:`.
9. **Token-cleanliness:** only design-system tokens — `bg-ink`/overlay via `bg-ink/NN` opacity, `text-white`, `font-display`, `text-6xl`/`text-xl`, `tracking-wide`, `uppercase`, `rounded-lg`, spacing-scale padding. **No hardcoded hex, no arbitrary px, no off-scale spacing, no arbitrary font sizes.**
10. `npm run typecheck` + `npm run lint` pass; renders correctly at mobile / tablet / desktop.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — single `brand-red` CTA (via `Button`); `ink` overlay for legibility; no teal/pink in the hero.
- **§C Component Structure** — functional component, inline `interface HeroProps` (likely no props), **named export** `export function Hero`, mirrors the canonical skeleton.
- **§E Token Consumption** — only `@theme` token classes; `font-display` paired with `uppercase tracking-wide`; motion behind `motion-safe:`/`motion-reduce:`; lazy-load + explicit width/height per the §E/PRD §5 image rules.
- **§B Code Style** — single quotes, semicolons, import groups (external → internal component → asset import for the hero image).
- **§D File Organization** — component in `src/components/`; hero image imported from `src/assets/`.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/Hero.tsx` | create | Full-bleed Home hero (headline, tagline, framing, CTA, media) |

> Composition: `Hero` is rendered by the Home page (story 17), which owns the `<Seo pageKey="home" />` and `BusinessJsonLd`. This story builds the component only. The hero image asset (`src/assets/hero.png` is a placeholder already in the repo) is imported here; the owner supplies a high-fidelity action photo + `srcset` variants later (PRD §10 item 1) — see Blockers.

### E.2 Component example

`src/components/Hero.tsx` (mirrors the CONVENTIONS.md §C skeleton — named export, tokens only; reuses the `Button` primitive from story 3):

```tsx
import { Button } from './Button';

import heroImage from '../assets/hero.png';

export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden">
      <img
        src={heroImage}
        alt="Barrel racer rounding a barrel at full speed in the arena"
        width={1920}
        height={1080}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 -z-10 h-full w-full rounded-lg object-cover"
      />
      {/* Ink overlay for AA contrast of white text over the photo */}
      <div className="absolute inset-0 -z-10 rounded-lg bg-ink/60" aria-hidden="true" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-24 md:py-24">
        <p className="font-display text-xl uppercase tracking-wide text-white">
          Experience Thrilling Speed Events
        </p>
        <h1 className="font-display text-6xl uppercase tracking-wide text-white">
          Run Where the Money Is At
        </h1>
        <p className="font-display text-3xl uppercase tracking-wide text-white">
          Welcome to the House of Smokin&rsquo; Runs!
        </p>
        <Button as="link" to="/contact">
          Register
        </Button>
      </div>
    </section>
  );
}
```

> **Copy fidelity note:** the source copy is ALL-CAPS (`RUN WHERE THE MONEY IS AT`, `WELCOME TO THE HOUSE OF SMOKIN' RUNS!`). The example uses `uppercase` to render the caps from sentence-case text — acceptable since the visual output is identical and avoids shouting in source. The builder may instead write the literal uppercase strings; either is fine as long as the **rendered** text is the exact preserved copy and the apostrophe is single-encoded (use `Smokin&rsquo;` or a literal `'` — never `&amp;#39;`). The `<h1>` must contain the headline and be the page's only `<h1>`.
>
> **Image note:** `hero.png` is the scaffold placeholder. When the owner supplies real assets, swap to a `<picture>` with `srcset` (e.g. `hero-768.webp 768w, hero-1280.webp 1280w, hero-1920.webp 1920w`) + `sizes="100vw"`, keeping explicit `width`/`height` on the `<img>` to hold CLS at 0. Do not introduce arbitrary inline dimensions in CSS — width/height are HTML attributes for aspect-ratio reservation.

### E.4 Design tokens used

- **Color:** `bg-ink` (as `bg-ink/60` overlay opacity), `text-white`
- **Font family:** `font-display` (paired with `uppercase tracking-wide`)
- **Type size:** `text-6xl` (h1), `text-3xl` (tagline), `text-xl` (framing line)
- **Radius:** `rounded-lg` (16px hero media)
- **Spacing:** `gap-6` (24px), `px-4` (16px), `py-24` (96px) — approved scale; layout utilities `max-w-6xl`, `mx-auto`, `relative`, `isolate`, `object-cover`
- **Motion:** none required; any entrance gated behind `motion-safe:`

### E.5 Interactions / behavior

- CTA navigates client-side to `/contact` via the `Button` `Link`.
- Optional entrance fade/slide must be `motion-safe:` only; default is static.

### E.6 Responsive behavior

- **Mobile (≤640px):** headline reflows; `text-6xl` may feel large — it is acceptable per PRD ("hero display may exceed scale top on desktop"); content padding `py-24` gives breathing room; CTA full-width optional via a wrapper (`w-full sm:w-auto`).
- **Tablet/Desktop:** full-bleed media with left-aligned content in the `max-w-6xl` container.
- Image holds aspect ratio at all breakpoints (explicit width/height) — no CLS.

### E.7 Accessibility

- Exactly one `<h1>` (the headline) — preserves the one-h1/no-skipped-levels rule.
- Hero `<img>` has descriptive `alt` (the action photo described); the overlay `<div>` is `aria-hidden`.
- White text over the `ink/60` overlay meets WCAG AA (builder verifies contrast against the actual photo's bright regions; deepen overlay opacity on-scale if needed).
- CTA is the `Button` primitive — keyboard-reachable with a visible focus ring.

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/Hero.test.tsx` (render inside `MemoryRouter` because of the `Button` `Link`):

- Renders an `<h1>` whose text matches the headline "Run Where the Money Is At" (case-insensitive).
- Renders the tagline text "Welcome to the House of Smokin' Runs!" and the framing "Experience Thrilling Speed Events".
- Renders a Register link with `href="/contact"` (assert the anchor's `href`), and there is exactly one link styled as the CTA.
- The hero `<img>` has non-empty `alt`, and explicit `width` and `height` attributes (assert both are present/numeric).
- The rendered title/tagline contain a literal apostrophe and **not** the substring `&#39;` or `&amp;`.

**Manual check (all tiers):**
1. `npm run dev`, visit `/`: hero fills the width, photo with dark overlay, white headline legible.
2. Tab to the CTA — visible focus ring; Enter navigates to `/contact`.
3. Throttle network / open dev tools Performance: confirm no layout shift as the hero image loads (CLS ≈ 0).
4. Toggle `prefers-reduced-motion` — no animation plays.

---

## G. Definition of Done (required)

- [ ] Exact headline as the single `<h1>`; exact tagline; "Experience Thrilling Speed Events" framing present.
- [ ] Single `brand-red` CTA (via `Button`) → `/contact`; no `mailto:`; no second CTA color.
- [ ] Full-bleed media + `ink` overlay; white text meets AA.
- [ ] Hero image has explicit width/height (no CLS) and is `srcset`-ready; eager/high-priority for LCP.
- [ ] `font-display text-6xl uppercase tracking-wide`; `rounded-lg` media.
- [ ] Only design-system tokens (no hardcoded color/spacing/size); motion behind `motion-safe:`.
- [ ] Apostrophe single-encoded.
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `Button` (story 3), `react-router-dom` (`Link`, already installed). Sits inside the Home composition (story 17).
- **Blockers:** None for the build. The high-fidelity action photo + `srcset` variants and the OG image are owner-pending (PRD §10 item 1); `src/assets/hero.png` (the scaffold placeholder) is used in the interim with a descriptive alt and explicit dimensions — a marked placeholder, not a code blocker.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #12, §E #13)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.1, §5, §6, §8 items 2/3/5/19, §10 item 1)
- Related components: `Button` (3), `SectionBand` (4); composed by Home (17).
