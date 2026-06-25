# Component Build Story — EventJsonLd (schema.org/Event per event, AM + PM)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #4; §E Build Order #7)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `EventJsonLd`
- Build-order position: `7`
- Test tier: `light`

---

## A. Story Summary (required)

As the site owner, I need every dated event in the 2026 season emitted as valid `schema.org/Event` JSON-LD pointing to its correct venue — with both the morning and evening races expressed for the Snook series/jackpot dates — so that Google can surface each event (the headline SEO win, since the business is literally events).

---

## B. Background / Context (required)

Build-order step 7 and the headline SEO component. Per PRD §7 ("`schema.org/Event` JSON-LD for EACH dated event across the WHOLE 2026 season") and plan §C #4, `EventJsonLd` takes a `SeasonEvent` (from `events.ts`, story 1), resolves its `venueId` to a venue address + optional geo via `venues.ts` (story 1), and emits valid `Event` JSON-LD. For Snook series/jackpot dates that run both an A.M. and a P.M. race, it must express **both** times — preserving the two distinct morning schedules (11:00am for May 30 / Jun 6; 10:15am for Jun 13 / Snook Jackpot Jun 20) and the 6:00pm P.M. race — by modeling AM and PM as **separate `Event`s** (or `subEvent`s of one parent). It injects via `react-helmet-async` (provider from story 2), like `Seo` (story 5) and `BusinessJsonLd` (story 6). It is rendered for every event on the Events page (and the next event on Home).

---

## C. Acceptance Criteria (required)

1. Given a `SeasonEvent`, emits one or more JSON-LD `<script type="application/ld+json">` blocks of `@type: 'Event'`, each with:
   - `name` (e.g. "Snook Summer Buckle Series — June 13, 2026"; "SNOOK JACKPOT — June 20, 2026"; "Magnolia Cowboy Church Playday — June 27, 2026"),
   - `startDate` (ISO 8601 with the start time, from the event's `startDate` / AM or PM race),
   - `location` = a `Place` with `name` + `PostalAddress` resolved from the **correct venue** (`venues[event.venueId]`), and `geo` **only when present** (PRD §10 item 7),
   - `eventStatus: 'https://schema.org/EventScheduled'`,
   - `organizer` = `Organization` "Smokin' Guns Productions LLC" with the business `url`,
   - `eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode'`.
2. **AM + PM for Snook series/jackpot:** when the event has both `amRace` and `pmRace`, emit **two** `Event` blocks (or one parent with two `subEvent`s) — an AM event at the morning time and a PM event at 6:00pm — preserving the two distinct morning start times (11:00am vs 10:15am) and the 6:00pm PM race. The AM/PM distinction and times must be expressed, not collapsed.
3. Events without AM/PM splits (Day Shows, shootouts, playdays, Pick Your Poison) emit a single `Event` from `startDate`.
4. Every event across the season resolves to its **correct venue** (Snook / Magnolia / Waller) — venue address comes from `venues.ts`, never hardcoded.
5. Geo is included in `location` only when `venues[venueId].geo` is non-null (PRD §10 item 7).
6. Validates in Rich Results Test (manual gate) for representative events (a Snook series date, the Jackpot, a Magnolia playday, a Waller shootout).
7. **Token-cleanliness:** script/head-only component — no JSX styling, no color/spacing/font-size classes.
8. `npm run typecheck` + `npm run lint` pass.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§C Component Structure** — functional component, inline `interface EventJsonLdProps`, **named export** `export function EventJsonLd`, no `any`; imports `SeasonEvent` from `src/data/events`, `venues` from `src/data/venues`, `businessInfo` for organizer.
- **§D File Organization** — component in `src/components/`; all event/venue/business values sourced from `src/data/` (nothing hardcoded).
- **§B Code Style** — single quotes, semicolons, import groups.
- No §E token rules apply (script-only).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/EventJsonLd.tsx` | create | `schema.org/Event` JSON-LD for one `SeasonEvent` (AM + PM aware) |

Composition: the Events page maps over `season` and renders `<EventJsonLd event={e} />` per event (and Home renders it for the next event) — those edits belong to the page-composition stories, not this one.

### E.2 Component example

`src/components/EventJsonLd.tsx`:

```tsx
import { Helmet } from 'react-helmet-async';

import { businessInfo } from '../data/businessInfo';
import type { SeasonEvent } from '../data/events';
import { venues } from '../data/venues';

interface EventJsonLdProps {
  event: SeasonEvent;
}

/** Replace the time portion of an ISO startDate, e.g. set the PM race to 18:00. */
function withTime(isoStartDate: string, hhmm: string): string {
  const [datePart, timePart] = isoStartDate.split('T');
  const offset = timePart && timePart.length > 5 ? timePart.slice(8) : '-05:00';
  return `${datePart}T${hhmm}:00${offset}`;
}

function buildEvent(event: SeasonEvent, name: string, startDate: string): Record<string, unknown> {
  const venue = venues[event.venueId];

  const location: Record<string, unknown> = {
    '@type': 'Place',
    name: venue.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.streetAddress,
      addressLocality: venue.city,
      addressRegion: venue.state,
      postalCode: venue.zip,
      addressCountry: 'US',
    },
  };
  if (venue.geo) {
    location.geo = {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.lat,
      longitude: venue.geo.lng,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: businessInfo.legalName,
      url: businessInfo.url,
    },
    location,
  };
}

export function EventJsonLd({ event }: EventJsonLdProps) {
  const dateLabel = new Date(event.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago',
  });

  const blocks: Record<string, unknown>[] = [];

  if (event.amRace && event.pmRace) {
    // Snook series / jackpot — two distinct races; preserve both times.
    // AM start time is already encoded in event.startDate (11:00am or 10:15am).
    blocks.push(buildEvent(event, `${event.title} (A.M. Section) — ${dateLabel}`, event.startDate));
    // PM race at 6:00pm.
    blocks.push(
      buildEvent(event, `${event.title} (P.M. Section) — ${dateLabel}`, withTime(event.startDate, '18:00'))
    );
  } else {
    blocks.push(buildEvent(event, `${event.title} — ${dateLabel}`, event.startDate));
  }

  return (
    <Helmet>
      {blocks.map((block, i) => (
        <script key={`${event.id}-${i}`} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
```

> **AM/PM correctness:** `event.startDate` already carries the AM race time (`...T11:00:00-05:00` for May 30 / Jun 6, `...T10:15:00-05:00` for Jun 13 / the Jun 20 Jackpot — see `events.ts` in story 1). The AM block uses it directly; the PM block rewrites the time to `18:00` (6:00pm). This preserves the two morning schedules and the single 6:00pm PM race exactly. Modeling them as two sibling `Event`s is acceptable per PRD §7 ("model the P.M. race as a second `Event` or a `subEvent`"); the builder may instead nest both as `subEvent`s of a parent `Event` if preferred — either satisfies the criterion as long as both times are expressed.

### E.4 Design tokens used

None — script/head-only component.

### E.5 Interactions / behavior

None. Injected via Helmet; provider from story 2 required. Pure function of its `event` prop.

### E.6 Responsive behavior

N/A.

### E.7 Accessibility

N/A for visible output. Improves machine readability / event-rich-result eligibility per PRD §7.

---

## F. Testing Strategy (required — Tier: light)

JSON-LD lands in `document.head` via Helmet. Create `src/components/EventJsonLd.test.tsx`; import representative events from `season` (`events.ts`). Concrete tests:

- For the **Snook Jackpot** (`snook-jackpot-2026-06-20`): two `Event` scripts appear; parse both — one `startDate` contains `T10:15` (A.M.), the other contains `T18:00` (P.M., 6:00pm); both have `location.address.addressLocality === 'Somerville'` and `name` includes "SNOOK JACKPOT".
- For a **May 30 series** event: the A.M. block `startDate` contains `T11:00`.
- For a **Magnolia playday**: a single `Event` script; `location.name === 'Magnolia Cowboy Church'`, `addressLocality === 'Magnolia'`.
- Every emitted block has `eventStatus` ending `EventScheduled`, `eventAttendanceMode` ending `OfflineEventAttendanceMode`, and `organizer.name === "Smokin' Guns Productions LLC"`.
- With `venues[*].geo === null`, no `geo` appears in `location`.

**Manual check (all tiers):**
1. Render `EventJsonLd` for a Snook series date and the Jackpot; view source and paste into Google's Rich Results Test — expect a valid Event (two for the AM/PM dates) and no errors.
2. Confirm each event's venue address matches the correct venue (Snook / Magnolia / Waller).

---

## G. Definition of Done (required)

- [ ] Emits valid `Event` JSON-LD with name, startDate, location (correct venue), `EventScheduled`, organizer, `OfflineEventAttendanceMode`.
- [ ] Snook series/jackpot dates emit BOTH an A.M. and a P.M. Event preserving 11:00am vs 10:15am AM and 6:00pm PM.
- [ ] Non-split events emit a single Event from `startDate`.
- [ ] Venue address/geo resolved from `venues.ts`; geo only when present.
- [ ] All values sourced from `src/data/` (nothing hardcoded in the component).
- [ ] No styling/token usage (script-only).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing; representative events validate in Rich Results Test (manual).

---

## H. Dependencies & Blockers (required)

- **Depends on:** story 1 `events.ts` (`SeasonEvent`, `season`) + `venues.ts` (`venues`) + `businessInfo.ts` (organizer); story 2 `HelmetProvider`. `react-helmet-async` already installed.
- **Blockers:** None identified for the build. `geo` is omitted from `location` until the owner supplies coordinates (PRD §10 item 7); Waller's street address is `TBC` in `venues.ts` so the Waller events' `location.streetAddress` will read "TBC" until confirmed (PRD §10 item 5) — structural, not a build blocker.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #4, §E #7)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§B, §C, §D)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§7 `schema.org/Event` block; §4.2 A; §10 items 5, 7)
- Related components this depends on: `events.ts` + `venues.ts` + `businessInfo.ts` (story 1), `HelmetProvider` (story 2); rendered by the Events page and Home (next event).
