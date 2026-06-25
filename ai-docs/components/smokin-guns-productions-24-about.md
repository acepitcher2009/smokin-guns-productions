# Component Build Story — MissionStatement + About page

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #22; §E Build Order #24)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `MissionStatement` + `About` page
- Build-order position: `24`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need an About page that states the business's mission exactly as written, with the business-name lockup and the "Experience Thrilling Speed Events" framing, so that I can trust the brand's promise without encountering invented history.

---

## B. Background / Context (required)

Build-order step 24. Per PRD §4.4 / §8 items 1, 4, 5 and plan §C #22, this story builds `MissionStatement` and the `About` page. `MissionStatement` renders the mission **verbatim** from `businessInfo.ts` (story 1: `missionVerbatim` — which contains the exact "a upbeat" wording). The grammar fix "a upbeat → an upbeat" is applied **only** when `businessInfo.missionApproved === true` (currently `false`), so by default the verbatim text — including "a upbeat" — renders. No fabricated history or claims. It shares its mission source with `MissionSnippet` (story 15, the Home excerpt). The page replaces the placeholder `About.tsx`, renders `<Seo pageKey="about" />`, and has exactly one `<h1>`.

---

## C. Acceptance Criteria (required)

1. `MissionStatement` renders the mission text from `businessInfo.missionVerbatim` — **verbatim**, including "a upbeat", when `businessInfo.missionApproved === false`.
2. When `businessInfo.missionApproved === true`, it renders the corrected text ("an upbeat") instead — the only allowed change, gated on the flag (PRD §4.4 / §8 item 4). No silent rewrite.
3. Renders the business-name lockup **"Smokin' Guns Productions LLC"** (from `businessInfo.legalName`).
4. Includes the **"Experience Thrilling Speed Events"** framing.
5. **No fabricated history, tenure, or claims** beyond the source content — only the mission, name lockup, and the framing line.
6. The `About` page replaces the placeholder, renders `<Seo pageKey="about" />`, and has exactly one `<h1>`.
7. Shares the mission source with `MissionSnippet` (no divergence — both read `businessInfo.missionVerbatim`).
8. **Token-cleanliness:** only design-system tokens — `font-display`/`font-sans`, `text-ink`, cream ground via `SectionBand`, type-scale sizes, spacing scale. **No hardcoded color/spacing/size.**
9. `npm run typecheck` + `npm run lint` pass; `npm run build` succeeds; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — cream content ground; `text-ink` body; no teal/pink.
- **§C Component Structure** — functional components, **named exports** `export function MissionStatement` / `export function About`, inline props, no `any`; `MissionStatement` imports `businessInfo` from `src/data/businessInfo`.
- **§D File Organization** — `MissionStatement` in `src/components/`; `About` page in `src/pages/`; mission/name from `src/data/businessInfo.ts` (single source shared with Home's `MissionSnippet`).
- **§E Token Consumption** — token classes only.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/MissionStatement.tsx` | create | Verbatim mission + name lockup + framing |
| `src/pages/About.tsx` | modify (replace placeholder) | Compose Seo + MissionStatement |

> Composition edit: `About` is already routed via `<Route path="/about" element={<About />} />` in `App.tsx` (story 2); this story replaces the placeholder body.

### E.2 Component example

`src/components/MissionStatement.tsx`:

```tsx
import { businessInfo } from '../data/businessInfo';

/** Verbatim unless the owner has approved the "a upbeat" → "an upbeat" correction (PRD §4.4). */
function missionText(): string {
  if (businessInfo.missionApproved) {
    return businessInfo.missionVerbatim.replace('a upbeat', 'an upbeat');
  }
  return businessInfo.missionVerbatim;
}

export function MissionStatement() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-5xl uppercase tracking-wide text-ink">
        {businessInfo.legalName}
      </h1>
      <p className="font-display text-3xl uppercase tracking-wide text-ink">
        Experience Thrilling Speed Events
      </p>
      <p className="font-sans text-xl text-ink">{missionText()}</p>
    </div>
  );
}
```

`src/pages/About.tsx`:

```tsx
import { MissionStatement } from '../components/MissionStatement';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

export function About() {
  return (
    <>
      <Seo pageKey="about" />
      <SectionBand tone="cream">
        <MissionStatement />
      </SectionBand>
    </>
  );
}
```

> **Verbatim discipline:** by default (`missionApproved === false`) the rendered mission is `businessInfo.missionVerbatim` exactly — including "...good ground, great payout and **a upbeat** professional attitude...". The correction only applies via the flag; the `.replace('a upbeat', 'an upbeat')` runs **only** when approved. Do not hand-type a corrected string. The page's only `<h1>` is the name lockup; the framing line and mission are non-heading text. No history/tenure beyond the source is added.
>
> **Single source:** `MissionStatement` and `MissionSnippet` (story 15) both read `businessInfo.missionVerbatim` — they cannot diverge.

### E.4 Design tokens used

- **Color:** `text-ink`; cream ground via `SectionBand tone="cream"`
- **Font family:** `font-display` (h1 + framing, `uppercase tracking-wide`), `font-sans` (mission body)
- **Type size:** `text-5xl` (h1), `text-3xl` (framing), `text-xl` (mission)
- **Spacing:** `gap-6` (24px) — approved scale

### E.5 Interactions / behavior

None — static content gated by the `missionApproved` flag.

### E.6 Responsive behavior

- Single-column; comfortable measure on desktop, full-width on mobile. Mission text reflows.

### E.7 Accessibility

- Exactly one `<h1>` (the name lockup); framing/mission are `<p>` text.
- Mission is real, selectable, translatable text (PRD §8 — verbatim preserved).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/MissionStatement.test.tsx`:

- **Renders the mission verbatim:** with `businessInfo.missionApproved === false` (the shipped default), the rendered text contains the exact substring `a upbeat professional attitude` (proving verbatim, not silently corrected). This is the key About guarantee.
- Renders the name lockup `Smokin' Guns Productions LLC`.
- Renders the framing `Experience Thrilling Speed Events`.
- The rendered text contains a literal apostrophe and not `&#39;`/`&amp;`.

Create `src/pages/About.test.tsx` (render inside `MemoryRouter` + `HelmetProvider`):

- Renders exactly one `<h1>` (the name lockup).

> (Optional) If the builder wants to prove the flag path without mutating shared data, extract `missionText` to accept the flag as a parameter and unit-test both branches; not required for light tier.

**Manual check (all tiers):**
1. `npm run dev`, visit `/about`: name lockup, "Experience Thrilling Speed Events", and the full mission — reading "a upbeat" verbatim.
2. Confirm no invented history; the Home mission snippet starts with the same words (no divergence).

---

## G. Definition of Done (required)

- [ ] Mission rendered verbatim ("a upbeat") when `missionApproved === false`; corrected only when `true`.
- [ ] Name lockup + "Experience Thrilling Speed Events" framing present; no fabricated history.
- [ ] Shares `businessInfo.missionVerbatim` with `MissionSnippet` (no divergence).
- [ ] `About` page replaces placeholder; Seo + one `<h1>`.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes; `npm run build` succeeds.
- [ ] Light smoke test (verbatim mission) present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `businessInfo.ts` (`businessInfo`, story 1), `SectionBand` (4), `Seo` (5). Route wired in `App` (2).
- **Blockers:** None for the build. The "a upbeat → an upbeat" correction is owner-approval-pending (PRD §10 item 12); `missionApproved` stays `false` (verbatim) until approved — a data-flag flip, not a code change.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #22, §E #24)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.4, §8 items 1/4/5, §10 item 12)
- Related components: `businessInfo.ts` (1), `SectionBand` (4), `Seo` (5); shares mission source with `MissionSnippet` (15).
