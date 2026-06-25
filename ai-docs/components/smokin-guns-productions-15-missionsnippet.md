# Component Build Story — MissionSnippet (Home mission excerpt)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #14; §E Build Order #15)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `MissionSnippet`
- Build-order position: `15`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor on the Home page, I need a short taste of the business's mission with a "Read more" link, so that I get a quick sense of the brand's promise and can go deeper on the About page.

---

## B. Background / Context (required)

Build-order step 15. Per PRD §4.1 (mission excerpt + Read more) and plan §C #14, `MissionSnippet` renders a short excerpt of the mission and a "Read more" link to `/about`. It reads from the **same single source** as About — `businessInfo.missionVerbatim` in `businessInfo.ts` (story 1) — so the two never diverge. About (story 24) renders the full mission verbatim; this component shows a truncated lead-in. It typically sits inside a `SectionBand tone="cream"`. No prior story renders the mission — About (24) is the full-text counterpart and must match this source.

---

## C. Acceptance Criteria (required)

1. Reads the mission text from `businessInfo.missionVerbatim` (the same source About uses) — no separate copy hardcoded.
2. Renders a short **excerpt** (the first sentence, or a clamped lead-in), not the full mission.
3. Includes a "Read more" link routing to `/about`.
4. Section heading (e.g. "Our Mission") is an `<h2>` (Home's `<h1>` is the Hero) — no skipped levels.
5. The excerpt preserves the source text verbatim (does not silently fix "a upbeat" — though a first-sentence excerpt may end before that word; if the excerpt includes it, it stays verbatim per PRD §4.4 / §8 item 4).
6. "Read more" is a descriptive text link (not a solid `brand-red` button) so Home keeps a single solid CTA (the Hero's Register) — `text-brand-red` link styling is acceptable (brand color as a link, not a button).
7. **Token-cleanliness:** only design-system tokens — `font-sans` body, `font-display` heading, `text-ink`/`text-brand-red`, spacing scale. **No hardcoded color/spacing/size.**
8. `npm run typecheck` + `npm run lint` pass; renders correctly at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — no teal/pink; `brand-red` only as the link accent (not a solid button competing with the Hero CTA).
- **§C Component Structure** — functional component, **named export** `export function MissionSnippet`, inline props interface (likely none), no `any`; imports `businessInfo` from `src/data/businessInfo`.
- **§D File Organization** — component in `src/components/`; mission text comes from `src/data/businessInfo.ts` (single source shared with About).
- **§E Token Consumption** — token classes only.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/MissionSnippet.tsx` | create | Mission excerpt + Read more → /about |

> Composition: rendered by the Home page (story 17) inside a `SectionBand tone="cream"`. This story builds the component only.

### E.2 Component example

`src/components/MissionSnippet.tsx`:

```tsx
import { Link } from 'react-router-dom';

import { businessInfo } from '../data/businessInfo';

/** First sentence of the mission as the Home excerpt; About renders it in full. */
function missionExcerpt(mission: string): string {
  const firstSentenceEnd = mission.indexOf('. ');
  return firstSentenceEnd === -1 ? mission : `${mission.slice(0, firstSentenceEnd + 1)}`;
}

export function MissionSnippet() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Our Mission</h2>
      <p className="font-sans text-xl text-ink">{missionExcerpt(businessInfo.missionVerbatim)}</p>
      <Link to="/about" className="font-sans text-base text-brand-red underline">
        Read more
      </Link>
    </div>
  );
}
```

> **Single-source rule:** the excerpt is derived from `businessInfo.missionVerbatim` — the exact field About (story 24) renders in full — so they cannot diverge. The first-sentence excerpt yields *"At Smokin' Guns Productions, we are dedicated to promoting barrel racing and pole bending events with good ground, great payout and a upbeat professional attitude."* (note: that sentence does contain "a upbeat" — it stays verbatim; do not correct it here). Alternatively the builder may render the full text with a CSS `line-clamp` and the same "Read more" — either approach keeps a single source; do not paste a hand-written excerpt string.

### E.4 Design tokens used

- **Color:** `text-ink` (heading + body), `text-brand-red` (Read more link)
- **Font family:** `font-display` (h2, `uppercase tracking-wide`), `font-sans` (body + link)
- **Type size:** `text-4xl` (h2), `text-xl` (lead body), `text-base` (link)
- **Spacing:** `gap-4` (16px) — approved scale

### E.5 Interactions / behavior

- "Read more" navigates client-side to `/about`. No internal state.

### E.6 Responsive behavior

- Single-column block; text reflows. Comfortable measure at the `SectionBand` container width on desktop; full-width on mobile.

### E.7 Accessibility

- Section heading is `<h2>` (no `<h1>` here).
- Descriptive "Read more" link text pointing to About.
- Verbatim source preserved (translatable, screen-reader-accessible real text — not an image).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/MissionSnippet.test.tsx` (render inside `MemoryRouter`):

- Renders text that is a prefix of `businessInfo.missionVerbatim` (assert the rendered excerpt is contained in the verbatim mission — proving it derives from the single source, not a separate string).
- The excerpt starts with "At Smokin' Guns Productions".
- A "Read more" link with `href="/about"` is present.
- The rendered text contains a literal apostrophe and not `&#39;`/`&amp;`.

**Manual check (all tiers):**
1. `npm run dev`, visit `/`: a short mission lead-in appears; "Read more" → `/about`.
2. On `/about`, confirm the full mission begins with the same words (no divergence).

---

## G. Definition of Done (required)

- [ ] Mission text sourced from `businessInfo.missionVerbatim` (same source as About).
- [ ] Renders an excerpt (not the full mission) + "Read more" → `/about`.
- [ ] Heading is `<h2>`; "Read more" is a link, not a solid red button.
- [ ] Verbatim source preserved (no silent "a upbeat" fix).
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `businessInfo.ts` (`businessInfo`, story 1), `react-router-dom`. Composed by Home (17); shares its mission source with About (24).
- **Blockers:** None identified.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #14, §E #15)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.1, §4.4, §8 item 4)
- Related components: `businessInfo.ts` (1); composed by Home (17); full-text counterpart MissionStatement/About (24).
