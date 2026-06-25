# Component Build Story — SeasonBuckleBanner (22 Champion Buckles)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #16; §E Build Order #18)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `SeasonBuckleBanner`
- Build-order position: `18`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor on the Events page, I need a bold banner announcing the "22 Champion Buckles" up for grabs and the categories they span, so that the series' headline draw is unmistakable.

---

## B. Background / Context (required)

Build-order step 18 — first Events page section. Per PRD §4.2 / §8 item 28 and plan §C #16, `SeasonBuckleBanner` renders the "22 Champion Buckles" line and the buckle categories (Open, Youth, Rookie, PeeWee, Senior, Adult) as text. It reads from `seriesInfo` in `events.ts` (story 1: `championBucklesLine`, `buckleCategories`) — not hardcoded. It sits on the **red** Series-Points band via `SectionBand tone="red"` with `font-display uppercase tracking-wide text-white`. No prior story renders this banner.

---

## C. Acceptance Criteria (required)

1. Renders `seriesInfo.championBucklesLine` (`'22 Champion Buckles'`) prominently as text — from `events.ts`, not a hardcoded string.
2. Renders the six categories from `seriesInfo.buckleCategories` (`Open, Youth, Rookie, PeeWee, Senior, Adult`) as a readable list.
3. Sits on a **red** ground via `SectionBand tone="red"`; heading uses `font-display uppercase tracking-wide text-white`.
4. The banner's prominent line is an `<h2>` (the Events page `<h1>` is owned by the page) — no skipped heading levels.
5. **Token-cleanliness:** only design-system tokens — `font-display`, `text-white`, `uppercase`, `tracking-wide`, type-scale sizes, spacing scale. **No hardcoded color/spacing/size.** Red ground comes from `SectionBand`, not a raw `bg-[#...]`.
6. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — `red` is the Series-Points band ground (via `SectionBand`); white text on red meets AA.
- **§C Component Structure** — functional component, **named export** `export function SeasonBuckleBanner`, inline props (likely none), no `any`; imports `seriesInfo` from `src/data/events`.
- **§D File Organization** — component in `src/components/`; banner content from `src/data/events.ts` (`seriesInfo`).
- **§E Token Consumption** — token classes only; uses the `SectionBand` primitive for the red ground.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/SeasonBuckleBanner.tsx` | create | 22 Champion Buckles banner on red, categories as text |

> Composition: rendered by the Events page (story 22). This story builds the component only.

### E.2 Component example

`src/components/SeasonBuckleBanner.tsx`:

```tsx
import { SectionBand } from './SectionBand';

import { seriesInfo } from '../data/events';

export function SeasonBuckleBanner() {
  return (
    <SectionBand tone="red">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-5xl uppercase tracking-wide text-white">
          {seriesInfo.championBucklesLine}
        </h2>
        <ul className="flex flex-wrap justify-center gap-4 font-display text-xl uppercase tracking-wide text-white">
          {seriesInfo.buckleCategories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>
    </SectionBand>
  );
}
```

> All content comes from `seriesInfo` (`events.ts`). The red ground is supplied by `SectionBand tone="red"` — never a raw hex. White-on-red is the established AA-safe pairing from `SectionBand`. The categories render as a real `<ul>` (selectable, screen-reader-accessible) — not an image.

### E.4 Design tokens used

- **Color:** `text-white` (text); `bg-brand-red` via `SectionBand tone="red"`
- **Font family:** `font-display` (`uppercase tracking-wide`)
- **Type size:** `text-5xl` (banner line), `text-xl` (categories)
- **Spacing:** `gap-4` (16px) — approved scale; layout `flex`, `flex-wrap`, `text-center`

### E.5 Interactions / behavior

None — presentational banner.

### E.6 Responsive behavior

- Categories wrap (`flex-wrap`) onto multiple lines on mobile; centered at all breakpoints; `SectionBand` handles full-bleed + padding.

### E.7 Accessibility

- Banner line is an `<h2>`; categories are a semantic `<ul>`/`<li>`.
- White on red meets AA (verified by `SectionBand`).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/SeasonBuckleBanner.test.tsx`:

- Renders the text `22 Champion Buckles` (from `seriesInfo.championBucklesLine`).
- Renders all six categories: `Open`, `Youth`, `Rookie`, `PeeWee`, `Senior`, `Adult` (assert each appears).
- The banner line renders as a heading (`getByRole('heading')`).
- The rendered tree contains `bg-brand-red` (via `SectionBand`) — assert `text-white` present (proxy for the red ground/white text pairing).

**Manual check (all tiers):**
1. `npm run dev`, visit `/events`: a bold red banner reads "22 Champion Buckles" with the six categories.
2. Confirm text is selectable (not an image) and white-on-red is legible.

---

## G. Definition of Done (required)

- [ ] "22 Champion Buckles" + six categories rendered from `seriesInfo` (not hardcoded).
- [ ] Red ground via `SectionBand tone="red"`; `font-display uppercase tracking-wide text-white`.
- [ ] Banner line is `<h2>`.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `SectionBand` (4), `events.ts` (`seriesInfo`, story 1). Composed by Events page (22).
- **Blockers:** None identified.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #16, §E #18)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.2, §8 item 28)
- Related components: `SectionBand` (4), `events.ts` (1); composed by Events (22).
