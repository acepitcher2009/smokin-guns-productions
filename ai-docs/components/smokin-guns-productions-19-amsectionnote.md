# Component Build Story — AmSectionNote (Upcoming Events heading + A.M. Section note)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #17; §E Build Order #19)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `AmSectionNote`
- Build-order position: `19`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor on the Events page, I need the "Upcoming Events" overview heading and the note that an A.M. Section has been added with its own dates and times, so that I understand each Snook date runs both a morning and an evening race.

---

## B. Background / Context (required)

Build-order step 19. Per PRD §4.2 / §8 items 11, 28 and plan §C #17, `AmSectionNote` renders the "Upcoming Events" overview heading and the exact note "A.M. Section Added, Please See Dates And Times Listed Under Flyer." as real text. Both strings come from `seriesInfo` in `events.ts` (story 1: `upcomingHeading`, `amSectionNote`) — not hardcoded. It sits on a **cream** ground. No prior story renders this overview note.

---

## C. Acceptance Criteria (required)

1. Renders `seriesInfo.upcomingHeading` (`'Upcoming Events'`) as the section heading and `seriesInfo.amSectionNote` (`'A.M. Section Added, Please See Dates And Times Listed Under Flyer.'`) as the note — both from `events.ts`, exact, as real text (not an image).
2. The "Upcoming Events" heading is rendered at the appropriate level — this is the **Events page's main `<h1>`** if the page delegates its title here, OR an `<h2>` if the page owns its own `<h1>`. **Decision:** the Events page (story 22) owns the page `<h1>` ("2026 Season" / events title); `AmSectionNote` renders "Upcoming Events" as an `<h2>` to avoid two `<h1>`s. (The builder of story 22 must ensure exactly one `<h1>` overall — see that story.)
3. Cream ground; heading `font-display`, note `font-sans`.
4. **Token-cleanliness:** only design-system tokens — `font-display`/`font-sans`, `text-ink`, type-scale sizes, spacing scale. **No hardcoded color/spacing/size.**
5. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — cream ground (the connective content band); `text-ink` body.
- **§C Component Structure** — functional component, **named export** `export function AmSectionNote`, inline props (likely none), no `any`; imports `seriesInfo` from `src/data/events`.
- **§D File Organization** — component in `src/components/`; copy from `src/data/events.ts` (`seriesInfo`).
- **§E Token Consumption** — token classes only.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/AmSectionNote.tsx` | create | "Upcoming Events" heading + A.M. Section note as text |

> Composition: rendered by the Events page (story 22). This story builds the component only. The component does **not** wrap itself in a `SectionBand` (the page controls banding) unless the page passes children into a band — keep it a plain block so story 22 can place it on its cream layout. (Builder may wrap in `SectionBand tone="cream"` if rendered standalone; coordinate with story 22 to avoid double-banding.)

### E.2 Component example

`src/components/AmSectionNote.tsx`:

```tsx
import { seriesInfo } from '../data/events';

export function AmSectionNote() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
        {seriesInfo.upcomingHeading}
      </h2>
      <p className="font-sans text-xl text-ink">{seriesInfo.amSectionNote}</p>
    </div>
  );
}
```

> Both strings come from `seriesInfo` (`events.ts`). The note is rendered as a real `<p>` (selectable, indexable) — preserving the exact preserved text from PRD §8 item 11. Heading level is `<h2>` so the Events page (story 22) keeps exactly one `<h1>`.

### E.4 Design tokens used

- **Color:** `text-ink`
- **Font family:** `font-display` (heading, `uppercase tracking-wide`), `font-sans` (note)
- **Type size:** `text-4xl` (heading), `text-xl` (note)
- **Spacing:** `gap-4` (16px) — approved scale

### E.5 Interactions / behavior

None.

### E.6 Responsive behavior

- Single-column block; reflows. Full-width on mobile, contained by the page layout on desktop.

### E.7 Accessibility

- "Upcoming Events" is an `<h2>` (no skipped levels; one `<h1>` lives on the page).
- The A.M. Section note is real, screen-reader-accessible text (PRD §4.2 — no core content as image only).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/AmSectionNote.test.tsx`:

- Renders the heading text `Upcoming Events` (from `seriesInfo.upcomingHeading`).
- Renders the exact note `A.M. Section Added, Please See Dates And Times Listed Under Flyer.` (from `seriesInfo.amSectionNote`).
- The heading renders at level 2 (`getByRole('heading', { level: 2 })`).

**Manual check (all tiers):**
1. `npm run dev`, visit `/events`: "Upcoming Events" heading + the A.M. Section note appear as text near the top of the calendar.

---

## G. Definition of Done (required)

- [ ] "Upcoming Events" heading + exact A.M. Section note rendered from `seriesInfo` (not hardcoded, not an image).
- [ ] Heading is `<h2>` (Events page keeps one `<h1>`).
- [ ] Cream-appropriate styling; `font-display`/`font-sans`.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `events.ts` (`seriesInfo`, story 1). Composed by Events page (22).
- **Blockers:** None identified.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #17, §E #19)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.2, §8 items 11, 28)
- Related components: `events.ts` (1); composed by Events (22) alongside SeasonBuckleBanner (18).
