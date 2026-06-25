# Component Build Story — BuckleSeriesDetail (re-authored buckle-series flyer as text)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #19; §E Build Order #21)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `BuckleSeriesDetail`
- Build-order position: `21`
- Test tier: `light`

---

## A. Story Summary (required)

As a competitor on the Events page, I need the full Snook Summer Buckle Series detail — schedule, pre-entry rules, nominations, classes with pricing, and rules — as real, selectable, accessible text rather than a flyer image, so that I can read every entry requirement on any device and so search engines can index it.

---

## B. Background / Context (required)

Build-order step 21 and a core content-migration task (PRD §8 — the single biggest defect was flyer-locked text). Per PRD §4.2 (B) / §8 item 24 and plan §C #19, `BuckleSeriesDetail` re-authors the buckle-series flyer as semantic HTML, reading the structured `seriesDetail` block carried by the Snook series events in `events.ts` (story 1: `BuckleSeriesDetail` shape — `schedule`, `preEntries`, `nominations`, `classes[]`, `rules[]`). **Obscured values are rendered as their `TBC` strings, never invented** (Leadline price, office-fee amount, Venmo handle — all already marked TBC in `events.ts`). It also notes the May 23 series date and the June 20 rain date. It sits on a **cream** ground via `SectionBand`, with `font-display` sub-headings and `font-sans` body/lists. No part of this content may appear only as a flyer image.

The data shape (from story 1 `events.ts`):
```ts
interface SeriesSchedule { books: string; exhibitions: string; race: string; }
interface PreEntryRules { window: string; contact: string; officeFee: string; walkUps: string; }
interface EventClass { name: string; price: string; } // price may be 'TBC'
interface BuckleSeriesDetail { schedule: SeriesSchedule; preEntries: PreEntryRules; nominations: string; classes: EventClass[]; rules: string[]; }
```
The shared `buckleSeriesDetail` constant is attached to every Snook series event's `seriesDetail`. This component reads **one** `BuckleSeriesDetail` (passed as a prop, or read from the first series event).

---

## C. Acceptance Criteria (required)

1. Renders, **as real text** (selectable, screen-reader-accessible — not an image):
   - **Schedule:** books open 3:30pm, exhibitions 3:30pm–5:45pm, race starts 6:00pm (from `seriesDetail.schedule`).
   - **Pre-entries:** the window (Wed 10am → Fri 6pm), TEXT 832-857-2826, the $10 non-refundable Venmo office fee (handle TBC), walk-ups welcome (from `seriesDetail.preEntries`).
   - **Nominations:** $20 per horse/rider combo per class, not mandatory (from `seriesDetail.nominations`).
   - **Classes + pricing:** the full list — 5D Open $50, 3D Youth $30, 2D PeeWee $20, 3D Rookie $25, 3D Senior $25, 3D Novice Horse $25, High Stakes $75, Leadline (TBC), Office fee (TBC) (from `seriesDetail.classes`).
   - **Rules:** Negative Coggins Required · Cash Only (from `seriesDetail.rules`).
2. **Obscured values render as their `TBC` strings** exactly as stored — never guessed/invented. Where a class `price === 'TBC'`, display it clearly as to-be-confirmed (e.g. "Leadline — price TBC").
3. Notes the **May 23** series date and the **June 20 rain date** as text (the series dates / rain date; may read from the series events' dates or a short note).
4. All content read from `events.ts` (the `seriesDetail` block / series events) — no prices/times/class names hardcoded in JSX.
5. Cream ground via `SectionBand tone="cream"`; sub-headings `font-display uppercase tracking-wide`; classes/pricing presented as a list or simple table; body `font-sans`.
6. Headings within are `<h2>`/`<h3>` (the page owns `<h1>`) — no skipped levels.
7. **Token-cleanliness:** only design-system tokens — `font-display`/`font-sans`, `text-ink`, type-scale sizes, spacing scale. **No hardcoded color/spacing/size.**
8. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — cream content ground (via `SectionBand`); `text-ink` body; no CTA color needed (per-event Register lives in `EventCard`).
- **§C Component Structure** — functional component, inline `interface BuckleSeriesDetailProps`, **named export** `export function BuckleSeriesDetail`, no `any`; imports the `BuckleSeriesDetail` **type** + `season` from `src/data/events` (note: a component named `BuckleSeriesDetail` and a data type named `BuckleSeriesDetail` — import the type aliased, e.g. `import type { BuckleSeriesDetail as SeriesDetailData }`, to avoid a name clash).
- **§D File Organization** — component in `src/components/`; all schedule/classes/pricing/rules text from `src/data/events.ts`.
- **§E Token Consumption** — token classes only; lists/tables styled with type-scale + spacing tokens.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/BuckleSeriesDetail.tsx` | create | Re-authored buckle-series flyer content as semantic text |

> Composition: rendered by the Events page (story 22), below the series event cards. This story builds the component only.

### E.2 Component example

`src/components/BuckleSeriesDetail.tsx`:

```tsx
import { SectionBand } from './SectionBand';

import { season } from '../data/events';
import type { BuckleSeriesDetail as SeriesDetailData } from '../data/events';

interface BuckleSeriesDetailProps {
  /** The buckle-series detail block; defaults to the first series event's seriesDetail. */
  detail?: SeriesDetailData;
}

/** Pull the shared series detail off the first Snook series event (single source). */
function defaultDetail(): SeriesDetailData | undefined {
  return season.find((event) => event.kind === 'series')?.seriesDetail;
}

export function BuckleSeriesDetail({ detail = defaultDetail() }: BuckleSeriesDetailProps) {
  if (!detail) return null;

  return (
    <SectionBand tone="cream">
      <div className="flex flex-col gap-8">
        <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
          Snook Summer Buckle Series — Entry Details
        </h2>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Schedule</h3>
          <p className="font-sans text-base text-ink">{detail.schedule.books}</p>
          <p className="font-sans text-base text-ink">{detail.schedule.exhibitions}</p>
          <p className="font-sans text-base text-ink">{detail.schedule.race}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Pre-Entries</h3>
          <p className="font-sans text-base text-ink">{detail.preEntries.window}</p>
          <p className="font-sans text-base text-ink">{detail.preEntries.contact}</p>
          <p className="font-sans text-base text-ink">{detail.preEntries.officeFee}</p>
          <p className="font-sans text-base text-ink">{detail.preEntries.walkUps}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Nominations</h3>
          <p className="font-sans text-base text-ink">{detail.nominations}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Classes &amp; Pricing</h3>
          <ul className="flex flex-col gap-1 font-sans text-base text-ink">
            {detail.classes.map((klass) => (
              <li key={klass.name}>
                {klass.name} —{' '}
                {klass.price === 'TBC' ? <span>price TBC (confirm with owner)</span> : klass.price}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Rules</h3>
          <ul className="flex flex-col gap-1 font-sans text-base text-ink">
            {detail.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <p className="font-sans text-sm text-ink">
          Series dates include May 23, 2026. June 20, 2026 is the series rain date (and the Snook
          Jackpot).
        </p>
      </div>
    </SectionBand>
  );
}
```

> **TBC discipline:** classes whose `price === 'TBC'` (Leadline, Office fee) and the office-fee Venmo handle (already embedded in `preEntries.officeFee` as "...handle TBC") render their to-be-confirmed text verbatim — the component **never** fabricates a value (PRD §10 item 3; plan §G). All schedule/pre-entry/nomination/class/rule text comes from `events.ts` — none hardcoded here. The May 23 / June 20 note reflects PRD §4.2 (B); the builder may instead derive the May 23 date from the `series` events and the June 20 rain date from the jackpot event's `notes`, but a short static note referencing those data-backed dates is acceptable. No part of this content is a flyer image.

### E.4 Design tokens used

- **Color:** `text-ink`; cream ground via `SectionBand tone="cream"`
- **Font family:** `font-display` (h2/h3, `uppercase tracking-wide`), `font-sans` (body/lists)
- **Type size:** `text-4xl` (h2), `text-3xl` (h3), `text-base` (body/lists), `text-sm` (note)
- **Spacing:** `gap-8` (32px), `gap-2` (8px), `gap-1` (4px) — approved scale

### E.5 Interactions / behavior

None — static re-authored content. (Optional expand/collapse for long lists is allowed but must be keyboard-accessible and `motion-safe:`; not required.)

### E.6 Responsive behavior

- Single-column stack on mobile; comfortable measure on desktop. Classes/pricing list reflows; if rendered as a table, it must scroll within an `overflow-x-auto` wrapper on narrow screens (no horizontal page scroll).

### E.7 Accessibility

- Sub-headings `<h2>`/`<h3>` (page owns `<h1>`); no skipped levels.
- Classes/pricing and rules are semantic `<ul>`/`<li>` (or a `<table>` with headers) — fully readable by assistive tech.
- All values are real text (selectable, translatable, indexable) — the central PRD §8 fix.

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/BuckleSeriesDetail.test.tsx`:

- Renders the schedule lines: `Books open 3:30pm`, `Exhibitions 3:30pm–5:45pm`, `Race starts 6:00pm`.
- Renders `TEXT 832-857-2826` and the nominations text containing `$20 per horse/rider combo`.
- Renders the class list including `5D Open` / `$50` and `High Stakes` / `$75`.
- Renders the rules `Negative Coggins Required` and `Cash Only`.
- For the `Leadline` class (price `'TBC'`), the rendered text contains `TBC` (and the component does **not** show an invented dollar price for it).
- The Venmo handle area shows `TBC` text, not a fabricated handle.

**Manual check (all tiers):**
1. `npm run dev`, visit `/events`: the full series detail reads as text; select-and-copy works (not an image).
2. Confirm Leadline/office-fee show "TBC" and no invented values appear.

---

## G. Definition of Done (required)

- [ ] Schedule, pre-entries, nominations, classes+pricing, and rules rendered as real text from `events.ts` (`seriesDetail`).
- [ ] Obscured values (Leadline, office fee, Venmo handle) render as `TBC`, never invented.
- [ ] May 23 series date + June 20 rain date noted as text.
- [ ] No part presented only as a flyer image.
- [ ] Headings `<h2>`/`<h3>`; cream ground; `font-display`/`font-sans`.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `SectionBand` (4), `events.ts` (`BuckleSeriesDetail` type, `season`, story 1). Composed by Events page (22).
- **Blockers:** None for the build. Leadline price, office-fee amount, and the Venmo handle remain `TBC` in `events.ts` until owner-confirmed (PRD §10 item 3) — rendered as marked placeholders, not invented.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #19, §E #21)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.2 B, §8 item 24, §10 item 3)
- Related components: `SectionBand` (4), `events.ts` (1); composed by Events (22) with `EventCard` (12).
