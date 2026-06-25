# Component Build Story — ResultsTeaser (Home results teaser)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #15; §E Build Order #16)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `ResultsTeaser`
- Build-order position: `16`
- Test tier: `light`

---

## A. Story Summary (required)

As a returning visitor on the Home page, I need a short block teasing the Series Points / standings with a branded link to the Results page, so that I can quickly check how the series is going — without ever being shown an opaque shortened URL.

---

## B. Background / Context (required)

Build-order step 16. Per PRD §4.1 (results teaser) and plan §C #15, `ResultsTeaser` is a short Home block that points to `/results` (the internal Results page), using descriptive branded text — **never** the `tinyurl.com` source (discard item 6). It may read the branded `label` from `results.ts` (story 1: `results.label === 'Series Points — Rodeo Results App'`) but links **internally** to `/results` (the Results page, story 23, hosts the actual outbound link/embed). `pink` is permitted here as an **accent** for emphasis (PRD §4.1 / §2 — pink is accent only, never a button). It typically sits inside a `SectionBand tone="cream"`. No prior story teases results.

---

## C. Acceptance Criteria (required)

1. Renders a short teaser pointing to the internal `/results` page (not directly to the external/tinyurl destination — that lives on the Results page).
2. **Never** displays `tinyurl.com` (or any bare shortened URL) as visible text. The visible link text is descriptive (e.g. "See the Series Points" / "Series Points — Rodeo Results App"); may reuse `results.label`.
3. `pink` may be used as an **accent** (e.g. a `text-pink` highlight word or rule) but **never** as a button. The link affordance itself is a text link, not a solid CTA (keeps Home's single solid CTA = the Hero Register).
4. Section heading (e.g. "Series Points & Standings") is an `<h2>` — no skipped levels (Home `<h1>` is the Hero).
5. **Token-cleanliness:** only design-system tokens — `font-display`/`font-sans`, `text-ink`, `text-pink` (accent), `text-brand-red` (link), spacing scale. **No hardcoded color/spacing/size**; no teal/pink **button**.
6. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — `pink` is an **accent only, never a button**; `brand-red` only as a link here (the solid CTA stays the Hero's); `teal` not used.
- **§C Component Structure** — functional component, **named export** `export function ResultsTeaser`, inline props interface (likely none), no `any`; imports `results` from `src/data/results` for the label.
- **§D File Organization** — component in `src/components/`; the branded label comes from `src/data/results.ts`; the destination is the internal route `/results`.
- **§E Token Consumption** — token classes only.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/ResultsTeaser.tsx` | create | Home teaser → /results with branded text + pink accent |

> Composition: rendered by the Home page (story 17) inside a `SectionBand tone="cream"`. This story builds the component only.

### E.2 Component example

`src/components/ResultsTeaser.tsx`:

```tsx
import { Link } from 'react-router-dom';

import { results } from '../data/results';

export function ResultsTeaser() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
        Series Points &amp; Standings
      </h2>
      <p className="font-sans text-xl text-ink">
        Track the chase for the <span className="text-pink">22 Champion Buckles</span> all season
        long.
      </p>
      <Link to="/results" className="font-sans text-base text-brand-red underline">
        {results.label}
      </Link>
    </div>
  );
}
```

> **No tinyurl rule:** the visible link text is `results.label` (`'Series Points — Rodeo Results App'`) and the link target is the **internal** route `/results` — the actual outbound/tinyurl-resolved destination is handled only on the Results page (story 23), never surfaced as text here. The `text-pink` accent on "22 Champion Buckles" is an accent highlight, not a button (CONVENTIONS.md §A). Do **not** import or render `results.destinationUrl` in this component.

### E.4 Design tokens used

- **Color:** `text-ink` (heading + body), `text-pink` (accent highlight), `text-brand-red` (link)
- **Font family:** `font-display` (h2, `uppercase tracking-wide`), `font-sans` (body + link)
- **Type size:** `text-4xl` (h2), `text-xl` (body), `text-base` (link)
- **Spacing:** `gap-4` (16px) — approved scale

### E.5 Interactions / behavior

- The link navigates client-side to `/results`. No internal state.

### E.6 Responsive behavior

- Single-column block; reflows. Full-width on mobile, contained on desktop via the wrapping `SectionBand`.

### E.7 Accessibility

- Heading is `<h2>`; descriptive link text (not "click here", not a bare URL).
- `pink` used only decoratively/as emphasis — body text is `text-ink` on cream (AA), never pink-on-teal body text.

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/ResultsTeaser.test.tsx` (render inside `MemoryRouter`):

- Renders a link with `href="/results"`.
- **The rendered output does NOT contain the substring `tinyurl`** (assert against `container.textContent`) — the key results-page guarantee.
- The visible link text equals `results.label` (`'Series Points — Rodeo Results App'`).
- A heading `<h2>` is present.

**Manual check (all tiers):**
1. `npm run dev`, visit `/`: the teaser links to `/results`; no shortened URL visible.
2. Confirm the pink accent reads as emphasis, not as a clickable button.

---

## G. Definition of Done (required)

- [ ] Teaser links internally to `/results`; descriptive branded link text (may reuse `results.label`).
- [ ] No `tinyurl.com` (or bare short URL) shown as visible text.
- [ ] `pink` used as accent only, never a button; single solid CTA on Home stays the Hero's.
- [ ] Heading is `<h2>`.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test (no-tinyurl + /results link) present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `results.ts` (`results.label`, story 1), `react-router-dom`. Composed by Home (17); the Results page (23) owns the actual outbound link/embed.
- **Blockers:** None identified. (The resolved Results destination URL is owner-pending — PRD §10 item 10 — but this teaser only links internally to `/results`, so it is unaffected.)

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #15, §E #16)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.1, §4.3, §2, discard item 6)
- Related components: `results.ts` (1); composed by Home (17); Results page (23).
