# Component Build Story — AddToCalendarButton (per-event .ics download, tertiary control)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #11; §E Build Order #11)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `AddToCalendarButton`
- Build-order position: `11`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need to add an event to my calendar in one click, so that I don't miss a race — downloading a correct `.ics` (right title, date/time, and venue) for the morning race, and the evening race too where the date has both.

---

## B. Background / Context (required)

This is build-order step 11. Per PRD §4.2 (add-to-calendar `.ics` per event — closing the analysis gap "no add-to-calendar") and plan §C #11, this component takes a `SeasonEvent` (from `events.ts`, story 1), resolves its venue location via `venues.ts` (story 1), generates an `.ics` with the `ics` package (installed per `DEPENDENCIES.md`), and triggers a download. For Snook series/jackpot dates that carry both an AM and a PM race, it offers the PM race as a **second VEVENT** in the same `.ics` (or a separate action) — mirroring the AM/PM modeling that `EventJsonLd` (story 7) already does from the same `events.ts` fields. **Crucially, it is a NON-primary tertiary control** — a text/icon button (lucide icon), **not** a `brand-red` `Button` — so the per-event "Register" CTA stays the single primary action and the single-CTA discipline (PRD §2/§9) is preserved. It is consumed by `EventCard` (story 12).

---

## C. Acceptance Criteria (required)

1. **Generates a valid `.ics`** for a given `SeasonEvent` using the `ics` package's `createEvents`, with: `title` = the event title (e.g. "Snook Summer Buckle Series" / "SNOOK JACKPOT"), `start` derived from `event.startDate` (the AM race time), a sensible `duration`, and `location` resolved from `venues[event.venueId]` (venue name + full street/city/state/zip) — **never** a hardcoded address.
2. **AM + PM where present:** when the event has both `amRace` and `pmRace`, the generated `.ics` contains **two VEVENTs** — the AM race (from `startDate`) and the PM race at 6:00pm — preserving the two distinct morning starts (11:00am vs 10:15am) and the 6:00pm PM race. Events without a PM race produce a single VEVENT.
3. **Triggers a download:** clicking the control produces a downloadable `.ics` (Blob + object URL + programmatic anchor click), with a sensible filename (e.g. `${event.id}.ics`). The object URL is revoked after use (no leak).
4. **Tertiary, non-primary styling:** rendered as a text/icon button (lucide `CalendarPlus`), **NOT** the `brand-red` `Button` primitive and **NOT** any solid CTA — neutral `text-ink` link/icon styling so it reads as secondary to the per-event Register CTA. No teal/pink/brand-red fill.
5. **Times sourced from data:** all times/dates come from `events.ts` fields (`startDate`, `pmRace`) — **no times hardcoded** in the component JSX/logic beyond the structural "PM race is 6:00pm" derivation (read from `pmRace` where possible; the 18:00 mapping mirrors `EventJsonLd`).
6. **Keyboard + a11y:** a real `<button>` with an accessible label (e.g. `aria-label="Add {title} to calendar"`), keyboard-operable, with a visible `focus-visible` ring (palette token).
7. **Token-cleanliness:** only design-system tokens — `text-ink` (and optional `text-brand-red` for the icon as an *accent*, never a fill), the approved type scale + spacing keys; **no hardcoded color/spacing/font-size**, no arbitrary px.
8. `npm run typecheck` + `npm run lint` pass; no `any` (the `ics` types are imported/used).

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — `brand-red` is reserved for the single primary CTA; this control is **tertiary** (neutral `text-ink`), explicitly NOT a CTA color, so the single-CTA rule holds.
- **§C Component Structure** — functional component, inline `interface AddToCalendarButtonProps`, **named export** `export function AddToCalendarButton`, no `any`; imports `SeasonEvent` from `src/data/events`, `venues` from `src/data/venues`.
- **§D File Organization** — component at `src/components/AddToCalendarButton.tsx`; venue/event values from `src/data/` (nothing hardcoded).
- **§E Token Consumption** — approved color/type/spacing classes only; this control deliberately does **not** use the `brand-red` fill.
- **§B Code Style** — single quotes, semicolons, import groups (external `react`/`lucide-react`/`ics` → internal `../data/events`, `../data/venues`).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/AddToCalendarButton.tsx` | create | Tertiary control that generates + downloads an `.ics` (AM + PM aware) for a `SeasonEvent` |

> No composition edit here — `AddToCalendarButton` is consumed by `EventCard` (story 12), which is wired into the Events and Home pages by their composition stories.

### E.2 Component example

`src/components/AddToCalendarButton.tsx` (named export, tertiary styling, tokens only; reads `events.ts` + `venues.ts`; uses the `ics` API — `createEvents(events): { error, value }`, `start: [Y, M, D, h, m]`):

```tsx
import { CalendarPlus } from 'lucide-react';
import { createEvents } from 'ics';
import type { EventAttributes } from 'ics';

import type { SeasonEvent } from '../data/events';
import { venues } from '../data/venues';

interface AddToCalendarButtonProps {
  event: SeasonEvent;
}

/** Build an ics `start` tuple [year, month, day, hour, minute] from an ISO string + an HH:MM override. */
function startTuple(isoStartDate: string, hour: number, minute: number): EventAttributes['start'] {
  const [datePart] = isoStartDate.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  return [y, m, d, hour, minute];
}

function locationString(event: SeasonEvent): string {
  const v = venues[event.venueId];
  return `${v.name}, ${v.streetAddress}, ${v.city}, ${v.state} ${v.zip}`;
}

export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  function download() {
    const location = locationString(event);
    const attrs: EventAttributes[] = [];

    if (event.amRace && event.pmRace) {
      // AM race — startDate already carries the morning time (11:00 or 10:15).
      const [, time] = event.startDate.split('T');
      const [amH, amM] = (time ?? '00:00').split(':').map(Number);
      attrs.push({
        title: `${event.title} (A.M. Section)`,
        start: startTuple(event.startDate, amH, amM),
        duration: { hours: 2 },
        location,
      });
      // PM race — 6:00pm (mirrors EventJsonLd's 18:00 PM mapping).
      attrs.push({
        title: `${event.title} (P.M. Section)`,
        start: startTuple(event.startDate, 18, 0),
        duration: { hours: 2 },
        location,
      });
    } else {
      const [, time] = event.startDate.split('T');
      const [h, m] = (time ?? '09:00').split(':').map(Number);
      attrs.push({
        title: event.title,
        start: startTuple(event.startDate, h || 9, m || 0),
        duration: { hours: 2 },
        location,
      });
    }

    const { error, value } = createEvents(attrs);
    if (error || !value) return;

    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      aria-label={`Add ${event.title} to calendar`}
      className="inline-flex min-h-[44px] items-center gap-2 font-sans text-sm text-ink underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2"
    >
      <CalendarPlus aria-hidden="true" className="h-4 w-4 text-brand-red" />
      Add to calendar
    </button>
  );
}
```

> **Tertiary, not a CTA:** this is a plain `<button>` with `text-ink` underline-on-hover — deliberately **not** the `brand-red` `Button` primitive — so it reads as secondary to the per-event Register CTA (single-CTA discipline, PRD §2/§9). The lucide icon may use `text-brand-red` as an *accent tint* only (no fill). **AM/PM:** both VEVENTs land in one `.ics`, so importing once adds both races. **Time source:** the AM time is read from `startDate`; the PM `18:00` mirrors `EventJsonLd` (story 7) exactly — keep the two components consistent. The `min-h-[44px]` is the documented a11y tap-target floor (see Header story), not a style value.

### E.4 Design tokens used

- **Color:** `text-ink` (label — tertiary, not a CTA), `text-brand-red` (icon accent tint only), `focus-visible:ring-brand-red-dark`
- **Font family:** `font-sans`; **Type size:** `text-sm`
- **Spacing:** `gap-2` (8px) — approved scale; `min-h-[44px]` as the a11y tap floor
- **Icon:** lucide `CalendarPlus` sized with `h-4 w-4`

### E.5 Interactions / behavior

- **Click → download:** generates the `.ics` text via `ics.createEvents`, wraps it in a `Blob`, creates an object URL, triggers a programmatic `<a download>` click, then revokes the URL.
- **No animation** (no motion concern).
- Guards: if `createEvents` returns an `error` (or no `value`), it no-ops rather than downloading a broken file.

### E.6 Responsive behavior

- Inline-flex text+icon control; intrinsic width; wraps naturally inside the `EventCard` action row at every breakpoint. Tap target ≥44px on mobile.

### E.7 Accessibility

- Real `<button>` with `aria-label="Add {title} to calendar"`; the icon is `aria-hidden` (decorative — the label carries the name).
- Keyboard-operable (Enter/Space) with a visible `focus-visible` ring.
- Introduces no heading; preserves the page's heading hierarchy.

---

## F. Testing Strategy (required — Tier: light)

Smoke test that a click generates an `.ics` and triggers a download, and that AM/PM events produce two VEVENTs. Create `src/components/AddToCalendarButton.test.tsx`; import representative events from `season` (`events.ts`). Use `@testing-library/user-event`. Concrete tests:

- **Click triggers download:** spy on `URL.createObjectURL` (and stub `HTMLAnchorElement.prototype.click`); clicking the button calls `createObjectURL` once (a download is initiated).
- **Renders a labelled control:** the button has accessible name `Add Snook Summer Buckle Series to calendar` (or the event's title) and renders the "Add to calendar" text.
- **AM + PM → two VEVENTs:** call `ics.createEvents` with the component's attribute logic (or assert via the generated Blob text) for the **Snook Jackpot** (`snook-jackpot-2026-06-20`) — the `.ics` text contains two `BEGIN:VEVENT` blocks; a single-race event (a Magnolia playday) contains one.
- **Location from venues:** the generated text contains the Snook venue address (`11538 FM 3058`) for a Snook event — proving the location came from `venues.ts`, not a hardcode.

> Tip: to assert the `.ics` body, the builder may read the Blob via `text()` or factor the attribute-building into a small exported helper that the test calls directly — either is acceptable.

**Manual check (all tiers):**
1. `npm run dev`; on an `EventCard`, click "Add to calendar" → a `.ics` downloads.
2. Import it into Google/Apple Calendar → the event shows the correct title, date, time, and venue location.
3. For a Snook series/jackpot date, confirm **both** the morning and 6:00pm races appear.
4. Confirm the control is clearly secondary to the red Register CTA (not red, not solid).

---

## G. Definition of Done (required)

- [ ] Generates a valid `.ics` (correct title, start time, duration, venue location) via the `ics` package.
- [ ] AM + PM dates produce two VEVENTs (11:00am/10:15am AM + 6:00pm PM); single-race events produce one.
- [ ] Click triggers a download with a sensible filename; object URL revoked.
- [ ] Rendered as a tertiary text/icon control — NOT a `brand-red`/solid CTA (single-CTA discipline preserved).
- [ ] All times/locations sourced from `events.ts` + `venues.ts` (nothing hardcoded).
- [ ] Accessible labelled `<button>`, keyboard-operable, visible focus; tap target ≥44px.
- [ ] Only design-system tokens (no hardcoded color/spacing/font-size).
- [ ] TypeScript zero new errors (no `any`); lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `events.ts` (`SeasonEvent`, `season`) + `venues.ts` (`venues`) from story 1; the `ics` and `lucide-react` packages (already installed per `DEPENDENCIES.md`). Reuses no `Button` (deliberately tertiary). Consumed by `EventCard` (story 12).
- **Blockers:** None identified. Waller's street address is `TBC` in `venues.ts` (PRD §10 item 5), so a Waller event's `.ics` location reads "TBC" until confirmed — structural, not a build blocker.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #11, §E #11)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §B, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.2 add-to-calendar; §2/§9 single-CTA discipline; §10 item 5)
- Related components this depends on: `events.ts` + `venues.ts` (1); mirrors AM/PM modeling in `EventJsonLd` (7); consumed by `EventCard` (12).
