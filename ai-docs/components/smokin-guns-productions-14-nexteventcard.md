# Component Build Story — NextEventCard (data-driven soonest event)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #13; §E Build Order #14)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `NextEventCard`
- Build-order position: `14`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor on the Home page, I need to see the single soonest upcoming race — computed from the live event data, not hardcoded — with a way to view all events and to register, so that I always know what's next and can act on it without hunting through the calendar.

---

## B. Background / Context (required)

Build-order step 14. Per PRD §4.1 (data-driven next-event highlight) and plan §C #13, `NextEventCard` reads `season` from `events.ts` (story 1), selects the soonest event whose date is `>= today`, and renders it through the shared `EventCard` (story 12, built in parallel — assume it accepts `{ event: SeasonEvent; tone?: 'cream' | 'white' }` and renders one event's full detail with its own per-event Register + add-to-calendar affordances). Alongside the card it offers a "View all events" link (→ `/events`) and a Register CTA (→ `/contact`). It must gracefully handle an empty future set (season ended). It typically sits inside a `SectionBand tone="cream"`. No prior story computes the next event — this is canonical.

---

## C. Acceptance Criteria (required)

1. Computes the soonest future event **at render** from `season` (`events.ts`): the event with the smallest `startDate` such that `startDate >= now`. Not hardcoded.
2. Renders that event via the shared `EventCard` (reusing the established component — does **not** re-implement event rendering).
3. Includes a "View all events" link to `/events` and a Register CTA. Per single-CTA discipline, **only one** `brand-red` `Button` here (Register → `/contact`); "View all events" is a secondary text/link affordance (not a second red button), to preserve CTA discipline against the per-event Register inside `EventCard`.
4. **Season-ended fallback:** when no event has `startDate >= now`, renders a graceful message (e.g. "The 2026 season has wrapped — check back soon for next year's schedule.") with a "View all events" link, and no `EventCard`.
5. Date comparison uses the event `startDate` (ISO 8601 from `events.ts`) parsed to a `Date`; multi-day/no-time events (Day Shows, shootouts) compare by their date.
6. A section heading (e.g. "Next Event") is an `<h2>` (page `<h1>` belongs to the Hero) — no skipped heading levels.
7. **Token-cleanliness:** only design-system tokens — heading `font-display ... text-ink`, body `font-sans`, spacing scale; one `brand-red` `Button`. **No hardcoded color/spacing/size.**
8. `npm run typecheck` + `npm run lint` pass; renders correctly at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — single `brand-red` CTA; cream/white card grounds via `EventCard`/`SectionBand`; no teal/pink buttons.
- **§C Component Structure** — functional component, inline `interface NextEventCardProps` (likely none), **named export** `export function NextEventCard`, no `any`, precise types; imports `season`/`SeasonEvent` from `src/data/events`.
- **§D File Organization** — component in `src/components/`; reads from `src/data/events.ts`; no event values hardcoded in JSX (all from the selected `SeasonEvent`).
- **§E Token Consumption** — token classes only; motion (card entrance, if any) via `motion-safe:`.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/NextEventCard.tsx` | create | Selects + renders the soonest future event via `EventCard` |

> Composition: rendered by the Home page (story 17) inside a `SectionBand tone="cream"`. This story builds the component only.

### E.2 Component example

`src/components/NextEventCard.tsx`:

```tsx
import { Button } from './Button';
import { EventCard } from './EventCard';

import { season } from '../data/events';
import type { SeasonEvent } from '../data/events';

/** Soonest event whose start date is today or later; null if the season has ended. */
function getNextEvent(now: Date): SeasonEvent | null {
  const upcoming = season
    .filter((event) => new Date(event.startDate).getTime() >= startOfDay(now))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return upcoming[0] ?? null;
}

function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function NextEventCard() {
  const next = getNextEvent(new Date());

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Next Event</h2>

      {next ? (
        <>
          <EventCard event={next} tone="white" />
          <div className="flex flex-wrap items-center gap-6">
            <Button as="link" to="/contact">
              Register
            </Button>
            <Link to="/events" className="font-sans text-base text-brand-red underline">
              View all events
            </Link>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-sans text-base text-ink">
            The 2026 season has wrapped — check back soon for next year&rsquo;s schedule.
          </p>
          <Link to="/events" className="font-sans text-base text-brand-red underline">
            View all events
          </Link>
        </div>
      )}
    </div>
  );
}
```

> Add `import { Link } from 'react-router-dom';` to the external import group. `text-brand-red` on the "View all events" link is the brand color used as a **link** (not a solid button) — this keeps the single-solid-CTA rule (only the `Button` is the solid red CTA). If the design prefers, "View all events" can route via `Button` too, but then it must be the page's lone red button and Register would move into `EventCard` only — the builder picks one and keeps a single solid red CTA in this block.
>
> **Why select at render:** the soonest event is time-relative; computing it from `new Date()` on each render keeps Home correct as dates pass, satisfying "shows the soonest future date" without code edits. `EventCard` already renders the event's full times/venue/Register/add-to-calendar from `events.ts`.

### E.4 Design tokens used

- **Color:** `text-ink` (heading), `text-brand-red` (secondary link), `brand-red` CTA via `Button`; card ground via `EventCard` (`bg-white`)
- **Font family:** `font-display` (h2, `uppercase tracking-wide`), `font-sans` (body/link)
- **Type size:** `text-4xl` (h2), `text-base` (link/body)
- **Spacing:** `gap-6` (24px), `gap-4` (16px) — approved scale

### E.5 Interactions / behavior

- Computes next event at render from `new Date()`. No internal state.
- CTA + link navigate client-side.
- Card entrance animation, if any, gated behind `motion-safe:`.

### E.6 Responsive behavior

- Single-column stack on mobile; the inner `EventCard` reflows to its stacked layout (story 12). CTA row wraps (`flex-wrap`) so Register and "View all events" stack on narrow screens.
- Tap targets ≥44px (the `Button` enforces this).

### E.7 Accessibility

- Section heading is an `<h2>` (the Hero owns `<h1>`); no skipped levels.
- "View all events" is a descriptive link (not "click here").
- The season-ended message is real text, screen-reader-accessible.

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/NextEventCard.test.tsx` (render inside `MemoryRouter`). Because selection is time-relative, control "now" by mocking the system date with `vi.useFakeTimers()` / `vi.setSystemTime(...)`:

- With system time set to a date **before** May 23, 2026 (e.g. `2026-05-01`), the rendered card shows the soonest event — the May 23 Snook Summer Buckle Series (assert the title text and/or its date appears). This proves it **picks the soonest event** from the data, not a hardcoded one.
- With system time set **between** two events (e.g. `2026-06-07`), the next event shown is the June 13 series date (the May/June 6 dates are in the past) — proving the date filter works.
- With system time set **after** the last event (e.g. `2027-01-01`), the season-ended message renders and no `EventCard` is present.
- A "View all events" link with `href="/events"` is present in every state.

(If mocking the real `EventCard` is simpler, the builder may stub it to assert the selected event's `id`/`title` is passed as the `event` prop.)

**Manual check (all tiers):**
1. `npm run dev`, visit `/`: the next upcoming race appears as a full `EventCard`; Register → `/contact`, "View all events" → `/events`.
2. Temporarily set the system clock past the season; confirm the season-ended message.

---

## G. Definition of Done (required)

- [ ] Soonest future event computed from `events.ts` at render (not hardcoded).
- [ ] Rendered via the shared `EventCard` (no re-implementation).
- [ ] Register CTA (`brand-red`) → `/contact`; "View all events" → `/events`; single solid red CTA in the block.
- [ ] Graceful season-ended fallback with no card.
- [ ] Section heading is `<h2>` (no `<h1>` here).
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test (soonest-event selection + fallback) present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `EventCard` (story 12, built in parallel — `{ event, tone }` shape per plan §C #10), `Button` (3), `events.ts` (`season`, `SeasonEvent`, story 1), `react-router-dom`. Composed by Home (17).
- **Blockers:** None identified. (Relies on `EventCard`'s final prop shape; the assumed `{ event, tone }` matches plan §C #10.)

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #13, §E #14)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.1)
- Related components: `EventCard` (12), `Button` (3), `events.ts` (1); composed by Home (17).
