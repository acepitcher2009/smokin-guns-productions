# Component Build Story — EventCard (per-event card: times, classes, register, .ics)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #10; §E Build Order #12)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `EventCard`
- Build-order position: `12`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need each event shown as one scannable card with its exact times, number ranges, venue, classes and pricing, plus a Register button and add-to-calendar, so that I can see exactly when and where the race is and enter it — with the schedule as real, selectable, screen-reader-accessible text instead of a flyer image.

---

## B. Background / Context (required)

This is build-order step 12 and the shared per-event card reused on both the Events page (full season) and Home (next-event highlight). Per PRD §4.2 / §4.1, plan §C #10, and CONVENTIONS.md §C (its canonical skeleton is literally an `EventCard` with a `tone?: 'cream' | 'white'` prop), it renders one `SeasonEvent` (from `events.ts`, story 1): title (including "SNOOK JACKPOT"), date, venue name (resolved via `venues.ts`, story 1), AM exhibitions + AM section race with its number range, PM exhibitions + PM section race, an event-kind badge, and — where present — classes/pricing and rules as real text. It includes a per-event "Register / Enter this event" `Button` (story 3) routing to `/contact?event=<id>` and the `AddToCalendarButton` (story 11). It is the single biggest content-fidelity surface — **every time and number range comes from `events.ts`, never hardcoded in JSX** (the central accessibility/SEO fix, PRD discard item 11).

This card reuses the established primitives: the shared `Button` (the only CTA), the `AddToCalendarButton` (the tertiary calendar control), and the `events.ts`/`venues.ts` data shapes. It follows CONVENTIONS.md §C's `EventCard` skeleton (`rounded-md`, `shadow-card`, `font-display` heading, `font-sans` body) and the `tone: 'cream' | 'white'` typed prop.

---

## C. Acceptance Criteria (required)

1. **One `SeasonEvent`, all fields from data:** the card renders title, a formatted date, the venue **name** (from `venues[event.venueId].name`), and — when present — `amExhibitions`, `amRace` + `amRange`, `pmExhibitions`, `pmRace` + `pmRange`, an `event-kind` badge, and `classes`/`seriesDetail`/`playdayDetail` content. **No times, ranges, prices, class names, or venue strings are hardcoded in JSX** — all come from `event` / `venues`.
2. **Exact preserved times (via data):** for the four Snook cards the rendered times match `events.ts` exactly — cards 1–2 "9:30–10:45am" AM exhibitions / "11:00am" AM race "#1–200"; cards 3–4 "9:00–10:00am" / "10:15am" "#1–200"; all PM "3:30–5:45pm" exhibitions / "6:00pm" race "#201–end". (The card renders whatever `events.ts` carries — the AC is that it surfaces those exact fields, not that it invents them.)
3. **SNOOK JACKPOT title:** the `snook-jackpot-2026-06-20` event renders its title "SNOOK JACKPOT" verbatim.
4. **Event-kind badge:** a typed badge labels the kind — `series` → "Series", `jackpot` → "Jackpot", `dayShow` → "Day Show", `shootout` → "Shootout", `playday` → "Playday". Jackpot may use a `pink` accent (accent only, never a button/CTA); others use a neutral cream/ink badge. The badge mapping is exhaustive over `EventKind` (no `string`).
5. **Classes / pricing / rules as real text:** where the event has `seriesDetail` (buckle series) or `playdayDetail` or `classes`, the class names + prices, schedule, pre-entry rules, nominations, and rules ("Negative Coggins Required · Cash Only") render as **selectable HTML text** (e.g. a list/definition list) — not an image. `TBC` values render verbatim (flagged, not hidden).
6. **Per-event Register CTA:** a `brand-red` `Button` ("Register" / "Enter this event") via `as="link"` to `/contact?event=${event.id}` — the single primary CTA on the card.
7. **Add-to-calendar:** renders `<AddToCalendarButton event={event} />` (tertiary control) alongside the Register CTA.
8. **Tone prop:** `tone?: 'cream' | 'white'` (default `'cream'`) sets the card ground — `cream` → `bg-cream-deep`, `white` → `bg-white` — a typed prop, not a free-form class.
9. **Card chrome:** `rounded-md`, `shadow-card`, `font-display` heading (`uppercase tracking-wide`), `font-sans` body — matching the CONVENTIONS.md §C skeleton.
10. **Responsive:** content reflows to a stacked single-column layout on mobile (≤640px); the AM/PM time blocks and the action row stack legibly; tap targets ≥44px.
11. **Motion gated:** any scroll fade/slide entrance is behind `motion-safe:` (`motion-reduce:` no-op) per CONVENTIONS.md §E / PRD §5.
12. **Token-cleanliness:** only design-system tokens — `bg-cream-deep`/`bg-white`, `text-ink`, `text-pink` (badge accent only), `font-display`/`font-sans`, the approved type scale, spacing keys, `rounded-md`, `shadow-card`; **no hardcoded color/spacing/font-size**, no arbitrary px (except the documented ≥44px tap floor).
13. `npm run typecheck` + `npm run lint` pass.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§C Component Structure (canonical skeleton)** — this is the exact component the skeleton illustrates: inline `interface EventCardProps { event: SeasonEvent; tone?: 'cream' | 'white' }`, **named export** `export function EventCard`, `<article>` root, `rounded-md bg-cream-deep p-6 shadow-card`, `font-display ... text-ink` heading, `font-sans` body. Mirror it.
- **§A Color role discipline** — `brand-red` is the single CTA (the Register button); `pink` is an **accent only** (the Jackpot badge may tint, never a button); `cream`/`white` grounds via the typed `tone` prop.
- **§D File Organization** — component at `src/components/EventCard.tsx`; all event/venue values from `src/data/` (no hardcoded times/prices/class names/venue strings — the content/markup separation rule).
- **§E Token Consumption** — approved color/type/spacing/radius/shadow classes only; motion behind `motion-safe:`.
- **§B Code Style** — single quotes, semicolons, import groups (external `react`/`react-router-dom` → internal `./Button`, `./AddToCalendarButton`, `../data/events`, `../data/venues`).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/EventCard.tsx` | create | Per-event card: title/date/venue, AM+PM times & ranges, kind badge, classes/pricing/rules text, Register CTA, add-to-calendar |

> No composition edit here — `EventCard` is wired onto the Events page (the season list) and Home (via `NextEventCard`, story 14) by their respective composition stories. This story delivers the reusable card.

### E.2 Component example

`src/components/EventCard.tsx` (mirrors the CONVENTIONS.md §C `EventCard` skeleton; reuses `Button` + `AddToCalendarButton`; all values from data; tokens only):

```tsx
import { Link } from 'react-router-dom';

import { AddToCalendarButton } from './AddToCalendarButton';
import { Button } from './Button';
import type { EventClass, EventKind, SeasonEvent } from '../data/events';
import { venues } from '../data/venues';

interface EventCardProps {
  event: SeasonEvent;
  tone?: 'cream' | 'white';
}

const toneClasses: Record<NonNullable<EventCardProps['tone']>, string> = {
  cream: 'bg-cream-deep',
  white: 'bg-white',
};

const kindLabel: Record<EventKind, string> = {
  series: 'Series',
  jackpot: 'Jackpot',
  dayShow: 'Day Show',
  shootout: 'Shootout',
  playday: 'Playday',
};

// Jackpot uses the pink accent (accent only — never a button); others a neutral badge.
const badgeClasses: Record<EventKind, string> = {
  series: 'bg-cream text-ink',
  jackpot: 'bg-cream text-pink',
  dayShow: 'bg-cream text-ink',
  shootout: 'bg-cream text-ink',
  playday: 'bg-cream text-ink',
};

function ClassList({ classes }: { classes: EventClass[] }) {
  return (
    <dl className="mt-2 grid grid-cols-2 gap-2 font-sans text-base text-ink">
      {classes.map((c) => (
        <div key={c.name} className="flex justify-between gap-4">
          <dt>{c.name}</dt>
          <dd>{c.price}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EventCard({ event, tone = 'cream' }: EventCardProps) {
  const venue = venues[event.venueId];
  const dateLabel = new Date(event.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago',
  });

  return (
    <article
      className={`rounded-md p-6 shadow-card motion-safe:transition-transform ${toneClasses[tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-3xl uppercase tracking-wide text-ink">{event.title}</h3>
        <span
          className={`shrink-0 rounded-sm px-3 py-1 font-sans text-sm uppercase tracking-wide ${badgeClasses[event.kind]}`}
        >
          {kindLabel[event.kind]}
        </span>
      </div>

      <p className="mt-2 font-sans text-base text-ink">
        {dateLabel} · {venue.name}
      </p>

      {/* AM / PM time blocks — only rendered when present, all values from events.ts */}
      {(event.amRace || event.pmRace) && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {event.amRace && (
            <div className="font-sans text-base text-ink">
              <h4 className="font-display text-xl uppercase tracking-wide text-ink">A.M. Section</h4>
              {event.amExhibitions && <p>Exhibitions {event.amExhibitions}</p>}
              <p>
                Race {event.amRace} {event.amRange}
              </p>
            </div>
          )}
          {event.pmRace && (
            <div className="font-sans text-base text-ink">
              <h4 className="font-display text-xl uppercase tracking-wide text-ink">P.M. Section</h4>
              {event.pmExhibitions && <p>Exhibitions {event.pmExhibitions}</p>}
              <p>
                Race {event.pmRace} {event.pmRange}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Buckle-series detail as real selectable text */}
      {event.seriesDetail && (
        <div className="mt-4">
          <h4 className="font-display text-xl uppercase tracking-wide text-ink">Classes</h4>
          <ClassList classes={event.seriesDetail.classes} />
          <p className="mt-2 font-sans text-base text-ink">{event.seriesDetail.nominations}</p>
          <ul className="mt-2 font-sans text-base text-ink">
            {event.seriesDetail.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Standalone classes (e.g. playday) */}
      {event.classes && !event.seriesDetail && <ClassList classes={event.classes} />}

      {event.notes && <p className="mt-4 font-sans text-sm text-ink">{event.notes}</p>}

      {/* Actions: single brand-red Register CTA + tertiary add-to-calendar */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button as="link" to={`/contact?event=${event.id}`}>
          Register
        </Button>
        <AddToCalendarButton event={event} />
      </div>
    </article>
  );
}
```

> **Everything from data:** times (`amExhibitions`/`amRace`/`amRange`/`pmExhibitions`/`pmRace`/`pmRange`), the venue (`venues[event.venueId].name`), classes/prices/rules (`event.seriesDetail` / `event.classes`), and the title all come from `events.ts`/`venues.ts` — **nothing transcribed into JSX**. `TBC` prices render verbatim (the data layer flags them). The badge map is exhaustive over `EventKind` so adding a kind is a type error until handled. The Register CTA is the only `brand-red` element; the calendar control is tertiary; the badge's `text-pink` is an accent tint, not a button. The `playdayDetail` block (age groups, order of events, awards, payout) may be rendered similarly to `seriesDetail` — the builder may show it inline or behind an optional expand/collapse (plan §C #10 allows optional expand/collapse for long lists); keep it as selectable text either way.

### E.4 Design tokens used

- **Color:** `bg-cream-deep` / `bg-white` (tone grounds), `bg-cream` (badge), `text-ink` (body/heading), `text-pink` (Jackpot badge accent only), plus `brand-red` inherited from the `Button` CTA
- **Font family:** `font-display` (title + sub-headings, `uppercase tracking-wide`), `font-sans` (body, times, classes)
- **Type size:** `text-3xl` (title), `text-xl` (AM/PM sub-headings), `text-base` (body), `text-sm` (notes/badge)
- **Spacing:** `p-6` (24px), `mt-2`/`mt-4`/`mt-6` (8/16/24px), `gap-2`/`gap-4` (8/16px), `px-3 py-1` (badge) — approved scale
- **Radius/shadow:** `rounded-md` (card), `rounded-sm` (badge), `shadow-card`
- **Motion:** `motion-safe:transition-transform` (+ `motion-reduce:` no-op)

### E.5 Interactions / behavior

- **Register:** the `Button` link carries the event id as a query param (`/contact?event=${event.id}`); the Contact `RegistrationForm` (story 29) reads `?event=` to pre-select the race.
- **Add to calendar:** delegated to `AddToCalendarButton` (story 11).
- **Optional expand/collapse** for long class/playday lists (plan §C #10) — if added, the toggle is a keyboard-operable `<button>` and any height transition is `motion-safe:`.
- **Scroll entrance** (optional): fade/slide gated behind `motion-safe:`; respects `prefers-reduced-motion`.

### E.6 Responsive behavior

- **Mobile (≤640px):** single column — title/badge row, date·venue, AM block, then PM block (the AM/PM grid collapses to one column), classes, then the action row wraps (`flex-wrap`). Times stay legible stacked (PRD §5 "event time tables reflow to stacked, readable cards").
- **Tablet/desktop (`md` and up):** AM and PM sit side-by-side (`md:grid-cols-2`); classes in a two-column `dl`.
- Tap targets ≥44px (Register `Button` and add-to-calendar) at every breakpoint.

### E.7 Accessibility

- Root is a semantic `<article>` (one self-contained event).
- Heading level: the card title is an `<h3>` and AM/PM sub-headings are `<h4>` — assuming the page renders an `<h1>` and the section an `<h2>` (the Events/Home composition stories own those). The card **never** emits an `<h1>`, preserving one-h1-per-page and no skipped levels.
- Classes/pricing as a real `<dl>` (or list) — selectable, screen-reader-accessible text (the PRD §4.2 / §8 accessibility fix), not an image.
- The Register `Button` and `AddToCalendarButton` carry their own focus states and ≥44px targets (from their stories).
- The kind badge is plain text inside a `<span>` (the color is not the sole signal — the label text conveys the kind).

---

## F. Testing Strategy (required — Tier: light)

Smoke test that the card renders the exact data-driven times, the correct venue, the badge, and the Register link href. Create `src/components/EventCard.test.tsx`; import representative events from `season` (`events.ts`) and render inside a `MemoryRouter` (the Register `Button` uses `Link`). Concrete tests:

- **Exact times rendered:** for the May 30 series event (`snook-series-2026-05-30`), the card shows "11:00am", "#1–200", "6:00pm", and "#201–end" (the exact `events.ts` strings); for a card-3/4 event (`snook-series-2026-06-13`), it shows "10:15am".
- **SNOOK JACKPOT title + badge:** for `snook-jackpot-2026-06-20`, the title text is "SNOOK JACKPOT" and a "Jackpot" badge renders.
- **Venue from data:** the card shows "Snook Rodeo Arena" for a Snook event and "Magnolia Cowboy Church" for a Magnolia playday (proving venue came from `venues.ts`).
- **Register link href:** the "Register" link has `href` `/contact?event=snook-series-2026-05-30` (the event id in the query).
- **Classes as text:** for the series event, "5D Open" and "$50" and "Negative Coggins Required" render as text (selectable, not an image).
- **Add-to-calendar present:** an "Add to calendar" control renders.

**Manual check (all tiers):**
1. `npm run dev`; render a few cards (a series date, the Jackpot, a Magnolia playday) — confirm exact times/ranges, correct venue, the kind badge, and the classes/rules as selectable text.
2. Click "Register" → lands on `/contact?event=<id>`.
3. Click "Add to calendar" → `.ics` downloads.
4. Resize to mobile → card stacks single-column, times stay legible, actions wrap; tap targets ≥44px.
5. Select the class/price text with the mouse → it's real selectable text (not an image).

---

## G. Definition of Done (required)

- [ ] Renders one `SeasonEvent`: title, date, venue name (from `venues.ts`), AM exhibitions + AM race & range, PM exhibitions + PM race & range, kind badge.
- [ ] All times/ranges/prices/class names/venue strings sourced from `events.ts`/`venues.ts` — none hardcoded in JSX.
- [ ] SNOOK JACKPOT renders its title; the kind badge is exhaustive over `EventKind`; Jackpot uses `pink` as accent only (no pink button).
- [ ] Classes/pricing/rules (and playday detail where present) render as real selectable text; `TBC` shown verbatim.
- [ ] Per-event Register `Button` → `/contact?event=<id>` (single CTA); `AddToCalendarButton` present (tertiary).
- [ ] `tone?: 'cream' | 'white'` typed prop sets `bg-cream-deep`/`bg-white`; `rounded-md` + `shadow-card` + `font-display` heading + `font-sans` body.
- [ ] Reflows to stacked single-column on mobile; tap targets ≥44px; scroll motion behind `motion-safe:`.
- [ ] Only design-system tokens (no hardcoded color/spacing/font-size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `events.ts` (`SeasonEvent`, `EventKind`, `EventClass`) + `venues.ts` (`venues`) from story 1; the shared `Button` (story 3); the `AddToCalendarButton` (story 11). The query-param pre-select is consumed by `RegistrationForm` (story 29) — out of scope here.
- **Blockers:** None identified. Obscured values (Leadline/office-fee prices, full Silver list, playday details, the May 23 AM window, Day Show times) are `TBC` in `events.ts` (PRD §10 item 3) and render verbatim as flagged — structural, not a build blocker.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #10, §E #12)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §B, §C canonical skeleton, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.2 A/B/C/D, §4.1 reuse; §8 discard item 11; §5 responsive/motion; §10 item 3)
- Related components this depends on: `Button` (3), `AddToCalendarButton` (11), `events.ts` + `venues.ts` (1); reused by `NextEventCard` (14) and the Events page composition.
