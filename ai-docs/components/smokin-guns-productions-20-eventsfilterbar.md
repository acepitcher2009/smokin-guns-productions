# Component Build Story — EventsFilterBar (filter/group by venue & kind)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #18; §E Build Order #20)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `EventsFilterBar`
- Build-order position: `20`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor on the Events page, I need labeled, keyboard-accessible controls to filter the season by venue (Snook / Magnolia / Waller) and by event kind (Series, Jackpot, Day Shows, Shootout, Playdays), so that I can quickly find the events that matter to me without scrolling the whole season.

---

## B. Background / Context (required)

Build-order step 20. Per PRD §4.2 (filter/group by venue & event type) and plan §C #18, `EventsFilterBar` exposes two filter controls whose options are **derived from the data** (`venues.ts` venue ids/names and the `EventKind` values present in `season` from `events.ts`, story 1) — never a hardcoded option list. It is a **controlled** component: filter state is **lifted to the Events page** (story 22), which applies the filters to the rendered `EventCard` list. The default is "all" (full season shown). Controls are labeled and keyboard-accessible. Per CONVENTIONS.md §A, **no teal/pink buttons** — controls use `bg-cream-deep`/`text-ink` form styling. No prior story builds filter controls.

---

## C. Acceptance Criteria (required)

1. Renders two controls: a **venue** filter (Snook, Magnolia, Waller + "All venues") and a **kind** filter (Series, Jackpot, Day Shows, Shootout Qualifier/Finals, Playdays + "All types").
2. **Options derive from data:** venue options come from `venues` (id → `venue.name`); kind options come from the distinct `EventKind` values present in `season` (mapped to readable labels). No hardcoded option arrays of venues/kinds.
3. **Controlled component:** accepts `venue`, `kind`, `onVenueChange`, `onKindChange` props; the Events page owns the state. The bar does not own the filtered list — it only reports selection changes.
4. **"All" default:** the special "all" value selects every event; the page shows the full season when both filters are "all".
5. Controls are **labeled** (`<label htmlFor>` + `<select id>` or a labeled fieldset) and fully keyboard-accessible.
6. **No teal/pink buttons** — controls use neutral form styling (`bg-cream-deep`/`bg-white`, `text-ink`); no solid CTA color here (the page's CTAs live in the cards).
7. **Token-cleanliness:** only design-system tokens — `bg-cream-deep`/`bg-white`, `text-ink`, `font-sans`, type-scale sizes, spacing scale, `rounded-md`. **No hardcoded color/spacing/size; no teal/pink button.**
8. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — controls on `cream-deep`/`white`; **no teal/pink buttons**; `brand-red` is not used here (no CTA in the filter bar).
- **§C Component Structure** — functional component, inline `interface EventsFilterBarProps`, **named export** `export function EventsFilterBar`, no `any`, **variants/state as typed props** (controlled); imports `VenueId`/`venues` from `src/data/venues` and `EventKind` from `src/data/events`.
- **§D File Organization** — component in `src/components/`; option lists derived from `src/data/`.
- **§E Token Consumption** — token classes only; `bg-cream-deep` controls per plan §C #18.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/EventsFilterBar.tsx` | create | Controlled venue + kind filter controls, options derived from data |

> Composition: the Events page (story 22) owns `venue`/`kind` state, renders `<EventsFilterBar ... />`, and filters `season` before mapping to `EventCard`s. This story builds the controlled component (and exports the filter types/labels it needs so the page can reuse them).

### E.2 Component example

`src/components/EventsFilterBar.tsx`:

```tsx
import type { EventKind } from '../data/events';
import { venues } from '../data/venues';
import type { VenueId } from '../data/venues';

export type VenueFilter = VenueId | 'all';
export type KindFilter = EventKind | 'all';

/** Human-readable labels for each event kind (the only place kinds map to copy). */
export const kindLabels: Record<EventKind, string> = {
  series: 'Series',
  jackpot: 'Jackpot',
  dayShow: 'Day Shows',
  shootout: 'Shootout Qualifier / Finals',
  playday: 'Playdays',
};

interface EventsFilterBarProps {
  venue: VenueFilter;
  kind: KindFilter;
  /** The kinds actually present in the season (derived by the page from `season`). */
  availableKinds: EventKind[];
  onVenueChange: (value: VenueFilter) => void;
  onKindChange: (value: KindFilter) => void;
}

const controlClasses =
  'rounded-md bg-cream-deep px-4 py-3 font-sans text-base text-ink ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark';

export function EventsFilterBar({
  venue,
  kind,
  availableKinds,
  onVenueChange,
  onKindChange,
}: EventsFilterBarProps) {
  const venueIds = Object.keys(venues) as VenueId[];

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="venue-filter" className="font-sans text-sm text-ink">
          Filter by venue
        </label>
        <select
          id="venue-filter"
          className={controlClasses}
          value={venue}
          onChange={(e) => onVenueChange(e.target.value as VenueFilter)}
        >
          <option value="all">All venues</option>
          {venueIds.map((id) => (
            <option key={id} value={id}>
              {venues[id].name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="kind-filter" className="font-sans text-sm text-ink">
          Filter by type
        </label>
        <select
          id="kind-filter"
          className={controlClasses}
          value={kind}
          onChange={(e) => onKindChange(e.target.value as KindFilter)}
        >
          <option value="all">All types</option>
          {availableKinds.map((k) => (
            <option key={k} value={k}>
              {kindLabels[k]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

> **Data-derived options:** venue `<option>`s come from `Object.keys(venues)` → `venues[id].name`; kind `<option>`s come from `availableKinds` (the page computes `[...new Set(season.map((e) => e.kind))]` so only kinds actually in the data appear). The `kindLabels` map is the single readable-label source — exported so the page and any group headings reuse it. No venue/kind option strings are hand-listed in JSX. Controls are `<select>` with associated `<label htmlFor>` — keyboard- and screen-reader-accessible. `bg-cream-deep` + `text-ink` per plan §C #18; the focus ring reuses the brand token (not a teal/pink button).

### E.4 Design tokens used

- **Color:** `bg-cream-deep` (controls), `text-ink`, `ring-brand-red-dark` (focus ring)
- **Font family:** `font-sans`
- **Type size:** `text-base` (control), `text-sm` (label)
- **Spacing:** `gap-6` (24px), `gap-2` (8px), `px-4` (16px), `py-3` (12px) — approved scale
- **Radius:** `rounded-md` (8px)

### E.5 Interactions / behavior

- Controlled: `onVenueChange`/`onKindChange` report selection to the parent page, which filters the list. No internal filtering state in the bar itself.
- Keyboard: native `<select>` keyboard behavior; visible focus ring.

### E.6 Responsive behavior

- Controls wrap (`flex-wrap`) and stack on mobile; sit in a row on wider screens. Tap targets ≥44px (`py-3` + text).

### E.7 Accessibility

- Each `<select>` has a programmatically associated `<label>`.
- Native form controls — full keyboard support and screen-reader announcement.
- Visible focus-visible ring.

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/EventsFilterBar.test.tsx` (use `@testing-library/user-event`). Because the bar is controlled, test it with a small stateful wrapper, OR assert it calls the change handlers. Concrete tests:

- Renders a venue `<select>` whose options include "All venues", "Snook Rodeo Arena", "Magnolia Cowboy Church", "Waller Co. Fairgrounds" (from `venues`).
- Renders a kind `<select>` whose options match `availableKinds` mapped through `kindLabels` (e.g. pass `['series','jackpot','playday']` → options "Series", "Jackpot", "Playdays").
- Selecting a venue option calls `onVenueChange` with the venue id (e.g. `'magnolia'`).
- Selecting a kind option calls `onKindChange` with the kind (e.g. `'jackpot'`).
- Each `<select>` has an accessible name (queryable via `getByLabelText('Filter by venue')`).

> The page-level proof that filtering **narrows the list** lives in the Events page test (story 22) — that test selects a venue/kind and asserts the rendered card count drops. This bar test proves the controls derive options from data and report changes.

**Manual check (all tiers):**
1. `npm run dev`, visit `/events`: select "Magnolia Cowboy Church" → only Magnolia events show; select kind "Jackpot" → only the Snook Jackpot shows; reset to "All" → full season returns.
2. Tab to each control; operate with the keyboard; focus ring visible.

---

## G. Definition of Done (required)

- [ ] Venue + kind controls with options **derived from `venues`/`season`** (not hardcoded lists).
- [ ] Controlled component (state lifted to the Events page); "all" default supported.
- [ ] Labeled, keyboard-accessible `<select>` controls; visible focus ring.
- [ ] No teal/pink buttons; controls on `cream-deep`/neutral.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test (options-from-data + change handlers) present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `venues.ts` (`venues`, `VenueId`), `events.ts` (`EventKind`), story 1. State + list filtering owned by the Events page (22).
- **Blockers:** None identified.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #18, §E #20)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.2)
- Related components: `venues.ts` + `events.ts` (1); consumed/owned by Events page (22) with `EventCard` (12).
