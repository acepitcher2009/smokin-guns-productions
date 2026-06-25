# Component Build Story — SponsorCard + SponsorWall (sponsor grid)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #24; §E Build Order #26)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `SponsorCard` + `SponsorWall`
- Build-order position: `26`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need a unified grid of the 2026 sponsors with each sponsor's name and contact info as real text beside its logo, so that I can recognize and reach the businesses that support the series.

---

## B. Background / Context (required)

Build-order step 26. Per PRD §4.5 / §8 item 22 and plan §C #24, `SponsorWall` renders a coherent grid of `SponsorCard`s, one per sponsor in `sponsors.ts` (story 1: `Sponsor { name; tagline?; phone?; location?; url?; logo? }` — 8 named sponsors). Each `SponsorCard` shows the sponsor name + any captured contact info (phone/site/tagline/location) as **real text** beside the logo, with a unified card treatment on the brand palette (`bg-cream-deep`/`bg-white`, `rounded-md`, `shadow-card`). The logo (and/or name) links out when `url` is present (PRD §10 item 2 — optional `url`). No prior story renders sponsors.

The data shape (story 1 `sponsors.ts`):
```ts
interface Sponsor { name: string; tagline?: string; phone?: string; location?: string; url?: string; logo?: string; }
```

---

## C. Acceptance Criteria (required)

1. `SponsorWall` renders a grid of `SponsorCard`s — **one per sponsor in `sponsors.ts`** (currently 8). Count is data-driven (`sponsors.length`), not hardcoded.
2. Each `SponsorCard` shows the sponsor `name` and any present contact info (`phone`, `url`, `location`, `tagline`) as **real text** — not an image. (e.g. Teal Services LLC → tagline + 281-467-4407 + Tealtexas.com; Hay Girl → 281-686-8488 + Waller, TX + the coastal-squares tagline.)
3. **Unified card treatment** across all cards (same ground/radius/shadow/spacing) — replacing the old per-logo clashing styles.
4. When `url` is present, the logo/name links out (`<a target="_blank" rel="noopener noreferrer">`); when absent, no link.
5. Cards on `bg-cream-deep`/`bg-white` with `rounded-md` and `shadow-card`.
6. Phone numbers are `tel:` links; site URLs are real links (descriptive text — the domain is acceptable link text here since it is the sponsor's actual site, not a shortener).
7. Sponsor name is an appropriate heading level within the wall — the wall sits under the Sponsors page sections, so each card name is an `<h3>` (page `<h1>` / section `<h2>` owned by the page) — no skipped levels.
8. **Token-cleanliness:** only design-system tokens — `bg-cream-deep`/`bg-white`, `text-ink`, `text-brand-red` (phone link), `font-display`/`font-sans`, type-scale sizes, spacing scale, `rounded-md`, `shadow-card`. **No hardcoded color/spacing/size.**
9. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — cards on cream-deep/white; `text-brand-red` for phone links (brand color as a link, not a solid button); no teal/pink buttons.
- **§C Component Structure** — two components, **one per file** (`SponsorCard.tsx`, `SponsorWall.tsx`), inline props interfaces, **named exports**, no `any`; import the `Sponsor` type from `src/data/sponsors`, and `sponsors` in the wall.
- **§D File Organization** — components in `src/components/`; sponsor data from `src/data/sponsors.ts` (no names/contacts hardcoded).
- **§E Token Consumption** — token classes only; `shadow-card`.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/SponsorCard.tsx` | create | One sponsor: logo + name + contact text, optional link-out |
| `src/components/SponsorWall.tsx` | create | Grid of `SponsorCard`s from `sponsors.ts` |

> Composition: the Sponsors page (story 27) renders `<SponsorWall />`. This story builds both components (one per file, per CONVENTIONS.md §C).

### E.2 Component example

`src/components/SponsorCard.tsx`:

```tsx
import type { Sponsor } from '../data/sponsors';

interface SponsorCardProps {
  sponsor: Sponsor;
}

export function SponsorCard({ sponsor }: SponsorCardProps) {
  const name = <h3 className="font-display text-3xl uppercase tracking-wide text-ink">{sponsor.name}</h3>;

  return (
    <article className="flex flex-col gap-2 rounded-md bg-white p-6 shadow-card">
      {sponsor.logo ? (
        <img
          src={sponsor.logo}
          alt={`${sponsor.name} logo`}
          width={160}
          height={80}
          loading="lazy"
          className="h-auto w-40 object-contain"
        />
      ) : null}

      {sponsor.url ? (
        <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      ) : (
        name
      )}

      {sponsor.tagline ? (
        <p className="font-sans text-base text-ink">{sponsor.tagline}</p>
      ) : null}
      {sponsor.location ? (
        <p className="font-sans text-sm text-ink">{sponsor.location}</p>
      ) : null}
      {sponsor.phone ? (
        <a
          href={`tel:${sponsor.phone.replace(/[^0-9]/g, '')}`}
          className="font-sans text-base text-brand-red"
        >
          {sponsor.phone}
        </a>
      ) : null}
      {sponsor.url ? (
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm text-brand-red"
        >
          {sponsor.url.replace(/^https?:\/\//, '')}
        </a>
      ) : null}
    </article>
  );
}
```

`src/components/SponsorWall.tsx`:

```tsx
import { SponsorCard } from './SponsorCard';

import { sponsors } from '../data/sponsors';

export function SponsorWall() {
  return (
    <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
      {sponsors.map((sponsor) => (
        <li key={sponsor.name}>
          <SponsorCard sponsor={sponsor} />
        </li>
      ))}
    </ul>
  );
}
```

> **Data-driven count:** `SponsorWall` maps over `sponsors` — so it renders exactly as many cards as the data file holds (≥8). The contact info (phone/url/location/tagline) renders only when present, as real text — `text-brand-red` phone/site links (the brand color used as a link, not a solid CTA). When `url` is absent, no link is rendered. Logos lazy-load with explicit `width`/`height` (no CLS); until the owner supplies high-fidelity logos (PRD §10 item 2), `sponsor.logo` is undefined and the card is name+contact text only — fully valid. Sponsor name is `<h3>` so the page keeps one `<h1>` and the section `<h2>`.

### E.4 Design tokens used

- **Color:** `bg-white` (cards), `text-ink` (name/text), `text-brand-red` (phone/site links); page may place the wall on a `bg-cream-deep` band via `SectionBand`/the page
- **Font family:** `font-display` (name, `uppercase tracking-wide`), `font-sans` (contact text)
- **Type size:** `text-3xl` (name), `text-base` (tagline/phone), `text-sm` (location/site)
- **Spacing:** `p-6` (24px), `gap-6` (24px), `gap-2` (8px) — approved scale
- **Radius:** `rounded-md`; **Shadow:** `shadow-card`

### E.5 Interactions / behavior

- Optional logo/name + site link-out when `url` present (`target="_blank"`). Phone `tel:` links. No internal state.

### E.6 Responsive behavior

- Grid: 1 column mobile, 2 columns `sm:`, 4 columns `lg:` — unified cards reflow. Tap targets (links) ≥44px.

### E.7 Accessibility

- Each card name is an `<h3>`; the wall is a semantic `<ul>`/`<li>`.
- Logos have descriptive `alt` (`"<name> logo"`); external links use `rel="noopener noreferrer"`.
- Contact info is real, selectable text (PRD §8 — no sponsor content as raster-only).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/SponsorWall.test.tsx` (render inside `MemoryRouter` is not required — no router links; plain render):

- **Renders ≥8 sponsor cards:** assert the number of rendered card headings (`getAllByRole('heading', { level: 3 })`) is `>= 8` (and equals `sponsors.length`). This is the key SponsorWall guarantee.
- Renders the names `Teal Services LLC`, `Hay Girl Sales & Deliveries`, `Charlotte's Saddlery`, `The Jaeggi Team` (representative sponsors).

Create `src/components/SponsorCard.test.tsx`:

- Given Teal Services LLC, renders the tagline, a `tel:` link containing `2814674407`, and a site link whose visible text is `Tealtexas.com` (not a bare protocol).
- Given a sponsor with no `url` (e.g. Lavished Photography), renders the name with **no** external link.

**Manual check (all tiers):**
1. `npm run dev`, visit `/sponsors`: a unified grid of all 8 sponsors with names + contact text; cards look consistent.
2. Click a phone (dials) and a site link (opens in new tab); confirm no shortener text.

---

## G. Definition of Done (required)

- [ ] `SponsorWall` renders one card per sponsor in `sponsors.ts` (≥8, data-driven count).
- [ ] Each card shows name + contact info (phone/site/tagline/location) as real text beside the logo.
- [ ] Unified card treatment (cream-deep/white, rounded-md, shadow-card).
- [ ] Optional logo/name link-out when `url` present; `tel:` phone links.
- [ ] Sponsor name `<h3>`; logos have descriptive alt + explicit width/height.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test (≥8 cards) present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `sponsors.ts` (`Sponsor`, `sponsors`, story 1). Composed by Sponsors page (27).
- **Blockers:** None for the build. High-fidelity sponsor logos + display permission are owner-pending (PRD §10 item 2); cards render name+contact text now and accept logos when `sponsor.logo` is supplied — a data fill-in, not a code change.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #24, §E #26)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.5, §8 item 22, §10 item 2)
- Related components: `sponsors.ts` (1); composed by Sponsors (27) with SponsorTierCard (25).
