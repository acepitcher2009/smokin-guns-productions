# Component Build Story — ResultsPanel + Results page

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #21; §E Build Order #23)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `ResultsPanel` + `Results` page
- Build-order position: `23`
- Test tier: `light`

---

## A. Story Summary (required)

As a returning visitor, I need a branded Series Points & Standings page that either embeds the Rodeo Results standings or links to them with clear, descriptive text — never an opaque shortened URL — so that I can check the chase for the buckles with trust in where the link goes.

---

## B. Background / Context (required)

Build-order step 23. Per PRD §4.3 / §8 item 12 / discard item 6 and plan §C #21, this story builds the `ResultsPanel` component and the `Results` page that composes it. `ResultsPanel` reads `results` from `results.ts` (story 1: `{ label, destinationUrl, embedUrl?, mode }`). When `mode === 'embed'` (and an `embedUrl` exists) it renders a privacy-respecting embedded standings view; otherwise (`mode === 'link'`, the current config) it renders a branded outbound `Button` (story 3, `as="a"`) with the descriptive text "Series Points — Rodeo Results App". It **never** shows `tinyurl.com` (or any bare short URL) as visible text. `pink` is permitted as an **accent** for award emphasis (never a CTA). The page replaces the placeholder `Results.tsx` from story 2, renders `<Seo pageKey="results" />`, and has exactly one `<h1>`. It is reachable from the primary nav (already wired in `nav.ts`/`Header`).

---

## C. Acceptance Criteria (required)

1. `ResultsPanel` reads `results` from `results.ts`. If `results.mode === 'embed'` and `results.embedUrl` is set, render a lazy-loaded `<iframe>` (title set, no third-party cookies if avoidable; consent-gate if it sets cookies). Otherwise render a branded outbound `Button` (`as="a"`, `href={results.destinationUrl}`, `target="_blank"`, `rel="noopener noreferrer"`).
2. **No `tinyurl.com` (or any bare short URL) is shown as visible link text** — the visible text is `results.label` (`'Series Points — Rodeo Results App'`). The `href` may be whatever `destinationUrl` resolves to (currently `'TBC'`), but it is never surfaced as the link's visible text.
3. The outbound `Button` is the page's CTA — solid `brand-red` (the only solid CTA discipline holds).
4. `pink` may be used as an **accent** (e.g. emphasizing "Series Points" or a standings highlight) — never as a button.
5. The `Results` page replaces the placeholder, renders `<Seo pageKey="results" />`, and has exactly one `<h1>` (e.g. "Series Points & Standings").
6. Reachable from the primary nav (verified — `nav.ts`/`Header` already include `/results`).
7. **Token-cleanliness:** only design-system tokens — `font-display`/`font-sans`, `text-ink`, `text-pink` (accent), `brand-red` CTA via `Button`, cream/white grounds via `SectionBand`, spacing scale, `rounded-md` (embed). **No hardcoded color/spacing/size; no teal/pink button.**
8. `npm run typecheck` + `npm run lint` pass; `npm run build` succeeds; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — single `brand-red` CTA (via `Button`); `pink` accent only, never a button; standings on `cream`/`white`.
- **§C Component Structure** — functional components, **named exports** `export function ResultsPanel` / `export function Results`, inline props, no `any`; `ResultsPanel` imports `results` from `src/data/results`.
- **§D File Organization** — `ResultsPanel` in `src/components/`; `Results` page in `src/pages/`; destination/label/mode from `src/data/results.ts`.
- **§E Token Consumption** — token classes only.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/ResultsPanel.tsx` | create | Branded standings embed-or-link from `results.ts` |
| `src/pages/Results.tsx` | modify (replace placeholder) | Compose Seo + heading + ResultsPanel |

> Composition edit: `Results` is already routed via `<Route path="/results" element={<Results />} />` in `App.tsx` (story 2); this story replaces the placeholder body and adds the panel.

### E.2 Component example

`src/components/ResultsPanel.tsx`:

```tsx
import { Button } from './Button';

import { results } from '../data/results';

export function ResultsPanel() {
  const isEmbed = results.mode === 'embed' && Boolean(results.embedUrl);

  return (
    <div className="flex flex-col gap-6">
      <p className="font-sans text-xl text-ink">
        Follow the <span className="text-pink">Series Points</span> standings for the Snook Summer
        Buckle Series.
      </p>

      {isEmbed ? (
        <iframe
          src={results.embedUrl}
          title={results.label}
          loading="lazy"
          className="h-[600px] w-full rounded-md border-0"
        />
      ) : (
        <Button as="a" href={results.destinationUrl}>
          {results.label}
        </Button>
      )}
    </div>
  );
}
```

`src/pages/Results.tsx`:

```tsx
import { ResultsPanel } from '../components/ResultsPanel';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

export function Results() {
  return (
    <>
      <Seo pageKey="results" />
      <SectionBand tone="cream">
        <div className="flex flex-col gap-8">
          <h1 className="font-display text-5xl uppercase tracking-wide text-ink">
            Series Points &amp; Standings
          </h1>
          <ResultsPanel />
        </div>
      </SectionBand>
    </>
  );
}
```

> **No-tinyurl guarantee:** the `Button`'s visible text is `results.label` (`'Series Points — Rodeo Results App'`); the destination is `results.destinationUrl` (resolved Rodeo Results App URL — currently `'TBC'`, never the tinyurl). The component must **never** render `destinationUrl` as visible text. When the owner confirms the real URL, only `results.ts` changes — no code edit (PRD §10 item 10). `text-pink` on "Series Points" is an accent, not a button. The outbound link uses `target="_blank"` + `rel="noopener noreferrer"`.
>
> **Embed height note:** `h-[600px]` is an arbitrary value and is **disallowed** by the token rules. Use an on-scale height utility or an aspect-ratio approach: e.g. wrap the iframe in `aspect-[4/3]` (a layout ratio, not a color/spacing token) with the iframe `h-full w-full`, or add a tokenized height to `src/index.css` if a fixed height is required (CONVENTIONS.md §E: add a token rather than inline a one-off). The builder must not ship `h-[600px]` — replace with `className="aspect-[4/3] w-full rounded-md border-0"` on a wrapper, or a CSS-tokenized height. (Embed is the non-default path; the default `link` mode has no iframe.)

### E.4 Design tokens used

- **Color:** `text-ink` (body/heading), `text-pink` (accent), `brand-red` CTA via `Button`; cream ground via `SectionBand`
- **Font family:** `font-display` (h1, `uppercase tracking-wide`), `font-sans` (body)
- **Type size:** `text-5xl` (h1), `text-xl` (body)
- **Spacing:** `gap-8` (32px), `gap-6` (24px) — approved scale
- **Radius:** `rounded-md` (embed wrapper)

### E.5 Interactions / behavior

- Conditional embed vs link by `results.mode`. Outbound link opens in a new tab (`noopener noreferrer`). Embed lazy-loads.

### E.6 Responsive behavior

- Full-width panel; the embed (if used) is full-width and holds an aspect ratio (no CLS, scrolls internally if needed). The link `Button` is intrinsic width, full-width optional on mobile.

### E.7 Accessibility

- One `<h1>` per page; descriptive link text (no bare URL).
- Embedded iframe has a `title`.
- `pink` used decoratively only — body text stays `text-ink` on cream (AA).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/ResultsPanel.test.tsx`:

- In the default `link` mode, renders a link/button whose visible text equals `results.label` (`'Series Points — Rodeo Results App'`).
- **The rendered output does NOT contain `tinyurl`** (assert `container.textContent` excludes `tinyurl`) — the key guarantee.
- The outbound anchor has `target="_blank"` and `rel` containing `noopener`.

Create `src/pages/Results.test.tsx` (render inside `MemoryRouter` + `HelmetProvider`):

- Renders exactly one `<h1>` with text "Series Points & Standings".
- The page text does not contain `tinyurl`.

**Manual check (all tiers):**
1. `npm run dev`, visit `/results` (and reach it from the nav): branded panel with the descriptive Series Points button; no shortened URL visible.
2. Confirm one `<h1>`; pink reads as accent, the CTA is `brand-red`.

---

## G. Definition of Done (required)

- [ ] `ResultsPanel` renders embed (if `mode === 'embed'` + `embedUrl`) else a branded outbound `Button` with `results.label` text.
- [ ] No `tinyurl.com`/bare short URL shown as visible text.
- [ ] CTA is `brand-red`; `pink` used as accent only, never a button.
- [ ] `Results` page replaces placeholder; Seo + one `<h1>`; reachable from nav.
- [ ] No arbitrary `h-[...]`/hex/off-scale values; only design-system tokens (embed uses aspect-ratio or a tokenized height).
- [ ] TypeScript zero new errors; lint passes; `npm run build` succeeds.
- [ ] Light smoke test (no-tinyurl + label) present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `Button` (3), `SectionBand` (4), `Seo` (5), `results.ts` (story 1). Route wired in `App` (2); nav link in `nav.ts` (1)/`Header` (8).
- **Blockers:** None for the build. The resolved Rodeo Results App URL behind the tinyurl and whether an embed is available are owner-pending (PRD §10 item 10); `results.destinationUrl` stays `'TBC'` and `mode === 'link'` until confirmed — a marked placeholder, not a code blocker. The visible no-tinyurl guarantee holds regardless.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #21, §E #23)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.3, §8 item 12, discard item 6, §10 item 10)
- Related components: `Button` (3), `SectionBand` (4), `Seo` (5), `results.ts` (1); teased by ResultsTeaser (16).
