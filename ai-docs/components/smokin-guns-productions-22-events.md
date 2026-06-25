# Component Build Story — Events page (composition, full 2026 season)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #20; §E Build Order #22)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `Events` page
- Build-order position: `22`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need the Events page to present the entire 2026 multi-venue season as scannable, filterable event cards with full re-authored detail and machine-readable Event markup for every date, so that I can find and enter any race and search engines can surface each event.

---

## B. Background / Context (required)

Build-order step 22 — the primary content page. Per PRD §4.2 and plan §C #20, the `Events` page composes `Seo` (5), `SeasonBuckleBanner` (18), `AmSectionNote` (19), `EventsFilterBar` (20), the filtered list of `EventCard`s (12) for the **full 2026 season** from `season` (`events.ts`, story 1), `BuckleSeriesDetail` (21), and one `EventJsonLd` (7) per event (emitting AM+PM where applicable). It **owns the filter state** that `EventsFilterBar` controls and applies it to the rendered card list. It replaces the placeholder `Events.tsx` from story 2. Exactly one `<h1>` on the page; filtering narrows the visible cards.

---

## C. Acceptance Criteria (required)

1. Replaces the placeholder `src/pages/Events.tsx` — no leftover stub.
2. Renders `<Seo pageKey="events" />`.
3. Composes: `SeasonBuckleBanner` → `AmSectionNote` → `EventsFilterBar` → filtered `EventCard` list → `BuckleSeriesDetail`.
4. **Full 2026 season present** (not just four dates): the four Snook series cards + the May 23 series date + the Snook Jackpot + the Day Shows + the two Waller shootouts + Pick Your Poison + the three Magnolia playdays — i.e. every event in `season` renders an `EventCard` (subject to the active filter).
5. **`EventJsonLd` for every event:** the page renders `<EventJsonLd event={e} />` for **every** event in `season` (regardless of the visible filter — schema covers the whole season), each pointing to its correct venue (AM+PM emitted for the Snook cards by the component).
6. **One `<h1>`:** the page renders exactly one `<h1>` (e.g. "2026 Season" / the events page title). `AmSectionNote` renders "Upcoming Events" as an `<h2>` and `SeasonBuckleBanner` as an `<h2>` — confirm only one `<h1>` total.
7. **Filtering works:** the page owns `venue`/`kind` state, passes it + `availableKinds` (derived from `season`) to `EventsFilterBar`, and renders only events matching the active filters; "all/all" shows the full season.
8. Banding via `SectionBand` (red banner, cream content); single CTA color (`brand-red`) — only the per-event Register buttons inside `EventCard`s; no teal/pink buttons (the filter controls are neutral).
9. **Token-cleanliness:** the page adds no hardcoded color/spacing/size — only on-scale layout utilities; visual tokens come from the child components.
10. `npm run typecheck` + `npm run lint` pass; `npm run build` succeeds; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§D File Organization** — page in `src/pages/`; reads the season from `src/data/events.ts`; composes section components.
- **§C Component Structure** — functional component, **named export** `export function Events`, no `any`; uses `useState` for filter state with the typed `VenueFilter`/`KindFilter` from `EventsFilterBar`.
- **§A / §E** — single `brand-red` CTA (in cards); banding via `SectionBand`; token classes only.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/pages/Events.tsx` | modify (replace placeholder) | Compose the full-season Events page + filtering + Event JSON-LD |

> Composition edit: the page is already wired via `<Route path="/events" element={<Events />} />` in `App.tsx` (story 2); this story replaces the placeholder body. No `App.tsx` change needed.

### E.2 Component example

`src/pages/Events.tsx`:

```tsx
import { useState } from 'react';

import { AmSectionNote } from '../components/AmSectionNote';
import { BuckleSeriesDetail } from '../components/BuckleSeriesDetail';
import { EventCard } from '../components/EventCard';
import { EventJsonLd } from '../components/EventJsonLd';
import { EventsFilterBar } from '../components/EventsFilterBar';
import type { KindFilter, VenueFilter } from '../components/EventsFilterBar';
import { SeasonBuckleBanner } from '../components/SeasonBuckleBanner';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

import { season } from '../data/events';
import type { EventKind } from '../data/events';

export function Events() {
  const [venue, setVenue] = useState<VenueFilter>('all');
  const [kind, setKind] = useState<KindFilter>('all');

  const availableKinds = [...new Set(season.map((event) => event.kind))] as EventKind[];

  const visibleEvents = season.filter((event) => {
    const venueMatch = venue === 'all' || event.venueId === venue;
    const kindMatch = kind === 'all' || event.kind === kind;
    return venueMatch && kindMatch;
  });

  return (
    <>
      <Seo pageKey="events" />
      {/* Event JSON-LD for the WHOLE season (schema is filter-independent). */}
      {season.map((event) => (
        <EventJsonLd key={event.id} event={event} />
      ))}

      <SectionBand tone="cream">
        <h1 className="font-display text-5xl uppercase tracking-wide text-ink">2026 Season</h1>
      </SectionBand>

      <SeasonBuckleBanner />

      <SectionBand tone="cream">
        <div className="flex flex-col gap-12">
          <AmSectionNote />
          <EventsFilterBar
            venue={venue}
            kind={kind}
            availableKinds={availableKinds}
            onVenueChange={setVenue}
            onKindChange={setKind}
          />
          <div className="grid gap-8 md:grid-cols-2">
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} tone="white" />
            ))}
          </div>
        </div>
      </SectionBand>

      <BuckleSeriesDetail />
    </>
  );
}
```

> **One `<h1>`:** the page's lone `<h1>` is "2026 Season"; `SeasonBuckleBanner` and `AmSectionNote` emit `<h2>`s; `EventCard` titles are `<h3>` (per CONVENTIONS.md §C skeleton); `BuckleSeriesDetail` uses `<h2>`/`<h3>`. The builder must verify exactly one `<h1>`.
>
> **Whole-season schema vs filtered view:** the `EventJsonLd` blocks map over the full `season` (every event indexed regardless of the on-screen filter), while the visible `EventCard`s map over `visibleEvents` (the filtered subset). This satisfies "every event has an Event JSON-LD" (AC) and "filtering narrows the list."
>
> **AM/PM:** `EventJsonLd` (story 7) emits two Event blocks for events with both `amRace` and `pmRace` (the four Snook cards) — the page does nothing special; it just renders one `<EventJsonLd>` per `SeasonEvent`.

### E.4 Design tokens used

- No new tokens. Layout utilities only: `grid`, `gap-12`/`gap-8` (48/32px, approved), `md:grid-cols-2`; page `<h1>` uses `font-display text-5xl uppercase tracking-wide text-ink`. Visual tokens otherwise come from children + `SectionBand`.

### E.5 Interactions / behavior

- `venue`/`kind` filter state via `useState`; `EventsFilterBar` reports changes; the card list re-renders filtered.
- No animation at the page level (card entrance, if any, is `EventCard`'s and `motion-safe:`).

### E.6 Responsive behavior

- Cards in a two-column grid on `md:`+ and a single stacked column on mobile; filter controls wrap. Event time content reflows within each `EventCard`.

### E.7 Accessibility

- Exactly one `<h1>`; section headings `<h2>`/`<h3>`.
- Filter controls labeled + keyboard-accessible (from `EventsFilterBar`).
- All event detail is real text (no core content as image only).

---

## F. Testing Strategy (required — Tier: light)

Create `src/pages/Events.test.tsx` (render inside `MemoryRouter` + `HelmetProvider`):

- Renders exactly one `<h1>` (assert level-1 heading count === 1).
- Renders an `EventCard` for the full season — assert representative titles appear with no filter: "SNOOK JACKPOT" (the Jackpot), a "Snook Summer Buckle Series" card, a "Magnolia Cowboy Church Playday".
- **Filtering narrows the list:** select venue "Magnolia Cowboy Church" → the Snook Jackpot card is no longer in the document, while a Magnolia playday remains (use `user-event` on the venue `<select>`); reset to "All venues" → the Jackpot reappears. This proves `EventsFilterBar` narrows the list.
- Selecting kind "Jackpot" leaves the Snook Jackpot visible and removes the Magnolia playdays.
- At least one `script[type="application/ld+json"]` of `@type` "Event" is present in `document.head` (whole-season schema rendered).

**Manual check (all tiers):**
1. `npm run dev`, visit `/events`: red "22 Champion Buckles" banner, "Upcoming Events" + A.M. note, filters, the full season as cards, then the buckle-series detail.
2. Filter by venue and by kind — the visible cards change; "All" restores the full season.
3. View source: an Event JSON-LD block per event (two for the AM/PM Snook dates); paste a couple into Rich Results Test.
4. Confirm exactly one `<h1>` and every CTA is `brand-red`.

---

## G. Definition of Done (required)

- [ ] Placeholder `Events.tsx` replaced; composes Seo + SeasonBuckleBanner + AmSectionNote + EventsFilterBar + filtered EventCards + BuckleSeriesDetail.
- [ ] Full 2026 season renders (not just four dates).
- [ ] `EventJsonLd` rendered for every event (correct venue; AM+PM for Snook cards).
- [ ] Filtering by venue and by kind narrows the list; "all/all" shows the full season.
- [ ] Exactly one `<h1>`; section headings `<h2>`/`<h3>`.
- [ ] Single `brand-red` CTA (per-event Register); no teal/pink buttons.
- [ ] Only design-system tokens + on-scale layout utilities (no hardcoded values).
- [ ] TypeScript zero new errors; lint passes; `npm run build` succeeds.
- [ ] Light smoke test (full season + filter-narrows + Event JSON-LD present) passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `Seo` (5), `EventJsonLd` (7), `EventCard` (12), `SeasonBuckleBanner` (18), `AmSectionNote` (19), `EventsFilterBar` (20), `BuckleSeriesDetail` (21), `SectionBand` (4), `events.ts` (`season`, story 1). Route wired in `App` (2).
- **Blockers:** None for the build. Day Shows lack confirmed start times and the full list is owner-pending (PRD §10 item 4); Waller street/geo are `TBC` (§10 items 5/7) — these flow through from `events.ts`/`venues.ts` as marked placeholders and do not block the page.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #20, §E #22)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.2, §7, §9)
- Related components: SeasonBuckleBanner (18), AmSectionNote (19), EventsFilterBar (20), BuckleSeriesDetail (21), EventCard (12), EventJsonLd (7), Seo (5), SectionBand (4).
