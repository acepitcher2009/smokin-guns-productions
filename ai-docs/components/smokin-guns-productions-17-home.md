# Component Build Story — Home page (composition)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #30; §E Build Order #17)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `Home` page
- Build-order position: `17`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need the Home page to assemble the hero, mission snippet, next-event highlight, and results teaser into one coherent landing page with correct meta and business schema, so that I am oriented and pushed toward the next race and registration.

---

## B. Background / Context (required)

Build-order step 17 — the first page composition. Per PRD §4.1 and plan §C #30, `Home` composes `Seo` (story 5), `BusinessJsonLd` (story 6), `Hero` (story 13), `MissionSnippet` (story 15), `NextEventCard` (story 14), and `ResultsTeaser` (story 16). It replaces the placeholder `Home.tsx` created in story 2. The Hero owns the single page `<h1>`; every other section heading is `<h2>`. Banding is applied via `SectionBand` (story 4): the Hero is its own full-bleed media; the three content blocks sit on cream bands. Only one CTA color (`brand-red`) appears site-wide.

---

## C. Acceptance Criteria (required)

1. Replaces the placeholder `src/pages/Home.tsx` from story 2 — no leftover stub `<h1>Home</h1>`.
2. Renders `<Seo pageKey="home" />` and `<BusinessJsonLd />` (default `SportsActivityLocation`) for head/meta/schema.
3. Composes, in order: `Hero` → `MissionSnippet` → `NextEventCard` → `ResultsTeaser` (mission/next-event/results may be arranged as a row/stack per PRD §4.1 "2–3 block row" but each is present).
4. **Exactly one `<h1>`** on the page — the Hero headline; all section headings are `<h2>`.
5. **One CTA color** across the whole page (`brand-red`) — verify no teal/pink/ghost button appears.
6. Content blocks are wrapped in `SectionBand` (cream) for consistent banding; the Hero is full-bleed.
7. **Token-cleanliness:** the page composition itself adds no hardcoded color/spacing/size — it relies on the child components and `SectionBand`; any layout utilities are on-scale spacing/flex/grid only.
8. `npm run typecheck` + `npm run lint` pass; `npm run build` succeeds; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§D File Organization** — page component in `src/pages/`; one component per route; composes section components from `src/components/`.
- **§C Component Structure** — functional component, **named export** `export function Home`, no `any`.
- **§A / §E** — single `brand-red` CTA; banding via `SectionBand` (red/teal/cream only); token classes only.
- **§B Code Style** — single quotes, semicolons, import groups (external none here → internal components → none for data).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/pages/Home.tsx` | modify (replace placeholder) | Compose the Home page |

> This is the composition edit: the page is wired into the app via the existing `<Route path="/" element={<Home />} />` in `App.tsx` (story 2) — no `App.tsx` change is needed because the route already points at `Home`; this story replaces the placeholder body.

### E.2 Component example

`src/pages/Home.tsx`:

```tsx
import { BusinessJsonLd } from '../components/BusinessJsonLd';
import { Hero } from '../components/Hero';
import { MissionSnippet } from '../components/MissionSnippet';
import { NextEventCard } from '../components/NextEventCard';
import { ResultsTeaser } from '../components/ResultsTeaser';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

export function Home() {
  return (
    <>
      <Seo pageKey="home" />
      <BusinessJsonLd />

      <Hero />

      <SectionBand tone="cream">
        <NextEventCard />
      </SectionBand>

      <SectionBand tone="cream">
        <div className="grid gap-12 md:grid-cols-2">
          <MissionSnippet />
          <ResultsTeaser />
        </div>
      </SectionBand>
    </>
  );
}
```

> **Heading discipline:** `Hero` renders the page's only `<h1>`; `NextEventCard`, `MissionSnippet`, and `ResultsTeaser` each render an `<h2>` — no skipped levels, one `<h1>`. The two-up grid (`md:grid-cols-2`) places mission + results side by side on desktop and stacks on mobile, satisfying the PRD's "2–3 block row." `gap-12` (48px) is on the approved scale.
>
> **CTA discipline:** the only solid `brand-red` buttons are the Hero's Register and the NextEventCard Register (plus the per-event Register inside `EventCard`). Mission/Results "Read more"/"Series Points" are text links, not buttons — keeping a single solid CTA color.

### E.4 Design tokens used

- No new tokens introduced by the page. Layout utilities only: `grid`, `gap-12` (48px, approved), `md:grid-cols-2`. All visual tokens come from the child components + `SectionBand`.

### E.5 Interactions / behavior

- None at the page level beyond the children (Hero CTA, NextEventCard selection/CTAs, links).

### E.6 Responsive behavior

- Hero full-bleed at all breakpoints; the mission/results grid is two columns on `md:`+ and a single stacked column on mobile.

### E.7 Accessibility

- One `<main>` (provided by the `App` shell) wraps the page; exactly one `<h1>` (Hero); section headings `<h2>`.
- `SectionBand` regions can be `aria-labelledby` their `<h2>` if the builder wires `labelledBy` (optional).

---

## F. Testing Strategy (required — Tier: light)

Create `src/pages/Home.test.tsx` (render inside `MemoryRouter` + `HelmetProvider`; mock the system date so `NextEventCard` is deterministic, e.g. `vi.setSystemTime('2026-05-01')`):

- Renders exactly one `<h1>` (assert `getAllByRole('heading', { level: 1 }).length === 1`) and its text is the Hero headline.
- Renders the mission excerpt (text starting "At Smokin' Guns Productions") and a "Read more" link to `/about`.
- Renders a results link to `/results` and the rendered text does **not** contain `tinyurl`.
- Renders the next-event section (a Register link to `/contact` is present).

**Manual check (all tiers):**
1. `npm run dev`, visit `/`: hero, next event, mission, results teaser all present and coherent.
2. Inspect: exactly one `<h1>`; every CTA is solid `brand-red`; no teal/pink buttons.
3. View `<head>`: Home title/description + BusinessJsonLd script present.

---

## G. Definition of Done (required)

- [ ] Placeholder `Home.tsx` replaced; composes Seo + BusinessJsonLd + Hero + NextEventCard + MissionSnippet + ResultsTeaser.
- [ ] Exactly one `<h1>` (Hero); section headings `<h2>`.
- [ ] One CTA color (`brand-red`) across the page; no teal/pink/ghost buttons.
- [ ] Banding via `SectionBand` (cream); Hero full-bleed.
- [ ] Only design-system tokens + on-scale layout utilities (no hardcoded values).
- [ ] TypeScript zero new errors; lint passes; `npm run build` succeeds.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `Seo` (5), `BusinessJsonLd` (6), `Hero` (13), `NextEventCard` (14), `MissionSnippet` (15), `ResultsTeaser` (16), `SectionBand` (4). Route already wired in `App` (2).
- **Blockers:** None identified.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #30, §E #17)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.1, §7, §9)
- Related components: Hero (13), NextEventCard (14), MissionSnippet (15), ResultsTeaser (16), Seo (5), BusinessJsonLd (6), SectionBand (4).
