# Component Build Story — Sponsors page (composition)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #25; §E Build Order #27)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `Sponsors` page
- Build-order position: `27`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor or prospective sponsor, I need the Sponsors page to lead with "Join in," present the three sponsorship tiers, show the full sponsor wall, and offer a clear way to become a 2026 sponsor, so that I can both recognize current supporters and act on sponsoring.

---

## B. Background / Context (required)

Build-order step 27. Per PRD §4.5 and plan §C #25, the `Sponsors` page composes the "Join in" lead-in, the three `SponsorTierCard`s (story 25) on a `SectionBand tone="teal"`, the `SponsorWall` (story 26), and a "Become a 2026 Sponsor" brand-red `Button` (story 3) routing to `/contact`. It reads `sponsorTiers` from `sponsorTiers.ts` (story 1), renders `<Seo pageKey="sponsors" />`, replaces the placeholder `Sponsors.tsx` from story 2, and has exactly one `<h1>`. Teal is the program ground; the only solid CTA is brand-red (CONVENTIONS.md §A).

---

## C. Acceptance Criteria (required)

1. Replaces the placeholder `src/pages/Sponsors.tsx` — no leftover stub.
2. Renders `<Seo pageKey="sponsors" />`.
3. Renders the **"Join in"** lead-in heading.
4. Renders the **three** `SponsorTierCard`s by mapping `sponsorTiers` (Platinum/Gold/Silver) on a `SectionBand tone="teal"`.
5. Renders the `SponsorWall` (the ≥8 sponsor grid).
6. Renders a **"Become a 2026 Sponsor"** brand-red `Button` routing to `/contact`.
7. **One `<h1>`:** the page's lone `<h1>` (e.g. "2026 Sponsors"); "Join in" and other section labels are `<h2>`; tier names `<h3>`; sponsor names `<h3>`.
8. **Single CTA color:** the only solid CTA is the brand-red "Become a 2026 Sponsor" button; teal is the program ground only; no teal/pink buttons.
9. **Token-cleanliness:** the page adds no hardcoded color/spacing/size — only on-scale layout utilities; visual tokens come from children + `SectionBand`.
10. `npm run typecheck` + `npm run lint` pass; `npm run build` succeeds; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — `teal` is the sponsor-program ground; single `brand-red` CTA; no teal/pink buttons.
- **§C Component Structure** — functional component, **named export** `export function Sponsors`, no `any`; imports `sponsorTiers` from `src/data/sponsorTiers`.
- **§D File Organization** — page in `src/pages/`; composes section components; tier data from `src/data/`.
- **§E Token Consumption** — token classes only.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/pages/Sponsors.tsx` | modify (replace placeholder) | Compose Join in + tiers + wall + Become-a-Sponsor CTA |

> Composition edit: `Sponsors` is already routed via `<Route path="/sponsors" element={<Sponsors />} />` in `App.tsx` (story 2); this story replaces the placeholder body.

### E.2 Component example

`src/pages/Sponsors.tsx`:

```tsx
import { Button } from '../components/Button';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';
import { SponsorTierCard } from '../components/SponsorTierCard';
import { SponsorWall } from '../components/SponsorWall';

import { sponsorTiers } from '../data/sponsorTiers';

export function Sponsors() {
  return (
    <>
      <Seo pageKey="sponsors" />

      <SectionBand tone="cream">
        <h1 className="font-display text-5xl uppercase tracking-wide text-ink">2026 Sponsors</h1>
      </SectionBand>

      <SectionBand tone="teal">
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-4xl uppercase tracking-wide text-white">Join In</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {sponsorTiers.map((tier) => (
              <SponsorTierCard key={tier.name} tier={tier} />
            ))}
          </div>
          <Button as="link" to="/contact">
            Become a 2026 Sponsor
          </Button>
        </div>
      </SectionBand>

      <SectionBand tone="cream">
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Our 2026 Sponsors</h2>
          <SponsorWall />
        </div>
      </SectionBand>
    </>
  );
}
```

> **Heading discipline:** one `<h1>` ("2026 Sponsors"); "Join In" and "Our 2026 Sponsors" are `<h2>`; tier names + sponsor names are `<h3>`. The builder verifies a single `<h1>`.
>
> **CTA discipline:** the only solid CTA is the brand-red "Become a 2026 Sponsor" `Button` → `/contact`. It sits inside the teal band but is itself `brand-red` (teal is ground only). The "Join in" copy ties to the preserved contact line "Ask about our 2026 Sponsorship Opportunity" (rendered on Contact, story 28). Tiers come from `sponsorTiers` (mapped, not hand-listed).

### E.4 Design tokens used

- No new tokens. Layout utilities: `grid`, `gap-8`/`gap-6` (32/24px, approved), `md:grid-cols-3`; page `<h1>`/`<h2>` use `font-display text-5xl/text-4xl uppercase tracking-wide` with `text-ink`/`text-white`. Visual tokens otherwise from children + `SectionBand`; CTA from `Button` (`brand-red`).

### E.5 Interactions / behavior

- CTA navigates to `/contact`. No page-level state.

### E.6 Responsive behavior

- Tiers in a three-column grid on `md:`+, stacked on mobile; sponsor wall reflows (1/2/4 columns) per `SponsorWall`.

### E.7 Accessibility

- One `<h1>`; section headings `<h2>`; tier/sponsor names `<h3>` — no skipped levels.
- AA contrast on the teal band (white text); CTA has a visible focus ring (from `Button`).

---

## F. Testing Strategy (required — Tier: light)

Create `src/pages/Sponsors.test.tsx` (render inside `MemoryRouter` + `HelmetProvider`):

- Renders exactly one `<h1>` ("2026 Sponsors").
- Renders the "Join In" heading and three tier names (`Platinum`, `Gold`, `Silver`) with prices `$5,000` / `$1,500` / `$1,000`.
- Renders ≥8 sponsor cards (assert `getAllByRole('heading', { level: 3 }).length >= 8 + 3` — i.e. sponsor names plus the three tier names; or query sponsor names directly).
- Renders a "Become a 2026 Sponsor" link with `href="/contact"`.

**Manual check (all tiers):**
1. `npm run dev`, visit `/sponsors`: "Join in" → three tiers on teal → sponsor wall → "Become a 2026 Sponsor" CTA → `/contact`.
2. Confirm one `<h1>`, the only solid CTA is brand-red, teal is ground only.

---

## G. Definition of Done (required)

- [ ] Placeholder `Sponsors.tsx` replaced; composes Seo + Join-in + three tiers (teal) + SponsorWall + brand-red CTA.
- [ ] Three tiers mapped from `sponsorTiers`; sponsor wall ≥8.
- [ ] "Become a 2026 Sponsor" CTA → `/contact` (brand-red, the only solid CTA).
- [ ] Exactly one `<h1>`; section `<h2>`; tier/sponsor names `<h3>`.
- [ ] Teal as ground only; no teal/pink buttons.
- [ ] Only design-system tokens + on-scale layout utilities (no hardcoded values).
- [ ] TypeScript zero new errors; lint passes; `npm run build` succeeds.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `Seo` (5), `SectionBand` (4), `Button` (3), `SponsorTierCard` (25), `SponsorWall`/`SponsorCard` (26), `sponsorTiers.ts` (1). Route wired in `App` (2).
- **Blockers:** None identified.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #25, §E #27)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.5, §7, §9)
- Related components: SponsorTierCard (25), SponsorWall (26), Button (3), SectionBand (4), Seo (5).
