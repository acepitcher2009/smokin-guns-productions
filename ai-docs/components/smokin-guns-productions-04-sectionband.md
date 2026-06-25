# Component Build Story — SectionBand (red / teal / cream banding primitive)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #6; §E Build Order #4)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `SectionBand`
- Build-order position: `4`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need page content organized into coherent full-bleed color bands (red, teal, cream) with consistent margins and rhythm, so that the site reads as one deliberate brand system instead of the old per-flyer palette drift.

---

## B. Background / Context (required)

Build-order step 4. Per PRD §2 (section banding: red / teal / cream, no per-section drift) and CONVENTIONS.md §A/§E, the brand uses exactly three section grounds. `SectionBand` is the shared wrapper that enforces them through a **typed `tone` prop** (never a free-form class), sets the correct on-tone text color, and constrains inner content to a max-width container with consistent vertical rhythm from the spacing scale. Every later section (Hero, NextEventCard band, SeasonBuckleBanner, SponsorTierCard ground, etc.) wraps its content in `SectionBand` so banding can't drift. No prior story defines banding — this is canonical.

---

## C. Acceptance Criteria (required)

1. `tone` is a typed prop `'red' | 'teal' | 'cream'` — not a free-form class string (CONVENTIONS.md §C "variants as typed props").
2. Each tone sets background + correct on-tone text color:
   - `red` → `bg-brand-red text-white`
   - `teal` → `bg-teal text-white`
   - `cream` → `bg-cream text-ink`
3. The band is full-bleed (spans viewport width); inner content is constrained to a centered max-width container with horizontal padding.
4. Consistent vertical rhythm: vertical padding from the spacing scale (e.g. `py-12` desktop, `py-8` mobile) — same on every band so rhythm doesn't drift.
5. Only the three brand grounds are selectable; passing any other value is a TypeScript error.
6. Text contrast meets WCAG AA on each ground (white on red and on teal; ink on cream) — verified; if AA fails on `teal`, the builder flags it (do not silently switch to `teal-deep` for text background without noting it).
7. Renders an appropriate semantic element — `<section>` by default, with an optional `as` to allow `<header>`/`<footer>` callers; accepts an optional `aria-labelledby` passthrough.
8. **Token-cleanliness:** only `bg-brand-red`/`bg-teal`/`bg-cream`, `text-white`/`text-ink`, and spacing-scale padding/`max-w` + `mx-auto` — no hardcoded color/spacing/size.
9. `npm run typecheck` + `npm run lint` pass.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — only `brand-red`, `teal`, `cream` are section grounds; `pink` is accent only, never a band background; teal is a section color, never a CTA.
- **§C Component Structure** — functional component, inline `interface SectionBandProps`, **named export**, variants as a typed `tone` prop, mirrors the canonical skeleton.
- **§E Token Consumption** — approved color + spacing classes only; no arbitrary values.
- **§B Code Style** — single quotes, semicolons.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/SectionBand.tsx` | create | Typed-tone full-bleed band wrapper with max-width container |

No composition edit here — `SectionBand` is consumed by later section/page components.

### E.2 Component example

`src/components/SectionBand.tsx` (mirrors the CONVENTIONS.md §C skeleton — typed `tone` prop, named export, tokens only):

```tsx
import type { ReactNode } from 'react';

type SectionTone = 'red' | 'teal' | 'cream';

const toneClasses: Record<SectionTone, string> = {
  red: 'bg-brand-red text-white',
  teal: 'bg-teal text-white',
  cream: 'bg-cream text-ink',
};

interface SectionBandProps {
  tone: SectionTone;
  children: ReactNode;
  /** Semantic element; defaults to section. */
  as?: 'section' | 'header' | 'footer';
  /** id of a heading inside, for aria-labelledby. */
  labelledBy?: string;
}

export function SectionBand({ tone, children, as: Tag = 'section', labelledBy }: SectionBandProps) {
  return (
    <Tag className={`w-full ${toneClasses[tone]}`} aria-labelledby={labelledBy}>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">{children}</div>
    </Tag>
  );
}
```

> `py-12` (48px) / `md:py-16` (64px) and `px-4` (16px) are all on the approved spacing scale. `max-w-6xl` constrains the inner container (a Tailwind default max-width key, not a spacing token, and not an arbitrary value). If the design wants the container width tokenized, the builder may add a token to `src/index.css` rather than inline a one-off (CONVENTIONS.md §E).

### E.4 Design tokens used

- **Color:** `bg-brand-red`, `bg-teal`, `bg-cream`, `text-white`, `text-ink`
- **Spacing:** `px-4` (16px), `py-12` (48px), `md:py-16` (64px) — approved scale
- Layout: `w-full`, `mx-auto`, `max-w-6xl`

### E.5 Interactions / behavior

None — presentational wrapper.

### E.6 Responsive behavior

- Full-bleed background at every breakpoint; inner container capped at `max-w-6xl` and centered.
- Vertical padding steps up at `md:` (tablet/desktop) for more generous rhythm; mobile uses the tighter `py-12`. Horizontal `px-4` keeps content off the edges on mobile.

### E.7 Accessibility

- Default semantic `<section>`; supports `labelledBy` so a section heading (`<h2 id="...">`) names the region.
- Does not introduce headings itself (callers supply the correct heading level), preserving the one-h1/no-skipped-levels rule.
- Color contrast AA verified per tone.

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/SectionBand.test.tsx`:

- `tone="red"` renders a `<section>` whose className contains `bg-brand-red` and `text-white`.
- `tone="cream"` renders className containing `bg-cream` and `text-ink`.
- `tone="teal"` renders className containing `bg-teal`.
- Children render inside the band (assert provided child text is present).
- `as="footer"` renders a `<footer>` element.

**Manual check (all tiers):**
1. Render three stacked `SectionBand`s (red, teal, cream) with sample content; confirm full-bleed bands, centered content, consistent vertical spacing.
2. Inspect text color on each ground; confirm legible (white on red/teal, ink on cream).

---

## G. Definition of Done (required)

- [ ] `tone` is a typed `'red' | 'teal' | 'cream'` prop; invalid values are type errors.
- [ ] Correct on-tone text color per ground; AA contrast verified.
- [ ] Full-bleed band + centered max-width container + consistent vertical rhythm from the spacing scale.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** nothing beyond the design tokens in `src/index.css`. No data files, no other components.
- **Blockers:** None identified.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #6, §E #4)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§2)
- Related components that depend on this: Hero, NextEventCard band, MissionSnippet, ResultsTeaser, SeasonBuckleBanner, BuckleSeriesDetail, SponsorTierCard, ResultsPanel, MissionStatement, ContactInfo.
