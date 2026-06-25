# Component Build Story — SponsorTierCard (one sponsorship tier on teal)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #23; §E Build Order #25)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `SponsorTierCard`
- Build-order position: `25`
- Test tier: `light`

---

## A. Story Summary (required)

As a prospective sponsor, I need each sponsorship tier shown as a clear card with its exact price and benefit list as real text on the teal program ground, so that I can compare Platinum, Gold, and Silver and decide how to support the series.

---

## B. Background / Context (required)

Build-order step 25. Per PRD §4.5 / §8 item 21 and plan §C #23, `SponsorTierCard` renders **one** sponsorship tier (Platinum $5,000 / Gold $1,500 / Silver $1,000) with its exact price and re-authored benefit bullets as real text. It reads a `SponsorTier` from `sponsorTiers.ts` (story 1: `{ name; price; benefits[] }`). The obscured lower Silver benefits are already stored as the marked string "Additional benefits — confirm with owner" in `sponsorTiers.ts` and must render as-is, **never invented**. The tier sits on the **teal** brand ground (the sponsor program color); per CONVENTIONS.md §A, **teal is a section/background color, never a CTA** — any CTA uses the brand-red `Button`. No prior story renders tiers.

The data shape (story 1 `sponsorTiers.ts`):
```ts
interface SponsorTier { name: string; price: string; benefits: string[]; }
```

---

## C. Acceptance Criteria (required)

1. Renders one `SponsorTier` (passed as a prop): tier `name`, exact `price`, and the `benefits[]` as a real `<ul>` of text — not a flyer image.
2. **Exact prices** preserved (Platinum $5,000 / Gold $1,500 / Silver $1,000) — from `sponsorTiers.ts`, not hardcoded.
3. **Obscured Silver benefits** render as the stored "Additional benefits — confirm with owner" string — never invented.
4. Sits on the **teal** program ground: card on `bg-teal-deep` (or `bg-white`) within a teal section; tier name `font-display uppercase tracking-wide`; benefits `font-sans`.
5. **No teal CTA:** if the card includes a CTA, it is the brand-red `Button`. Teal is used only as the ground (CONVENTIONS.md §A).
6. Tier name is an `<h3>` (the Sponsors page owns `<h1>`, the "Join in" lead-in is `<h2>`) — no skipped levels.
7. Text contrast meets WCAG AA on the teal/teal-deep ground (white text on teal-deep; verify — deepen to `teal-deep` or use `bg-white` card if AA fails on plain `teal`).
8. **Token-cleanliness:** only design-system tokens — `bg-teal`/`bg-teal-deep`/`bg-white`, `text-white`/`text-ink`, `font-display`/`font-sans`, type-scale sizes, spacing scale, `rounded-md`, `shadow-card`. **No hardcoded color/spacing/size; no teal button.**
9. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — `teal` is the sponsor-program ground, **never a CTA**; CTAs are `brand-red`; `pink` not used.
- **§C Component Structure** — functional component, inline `interface SponsorTierCardProps`, **named export** `export function SponsorTierCard`, no `any`; imports the `SponsorTier` type from `src/data/sponsorTiers`.
- **§D File Organization** — component in `src/components/`; tier data from `src/data/sponsorTiers.ts` (no prices/benefits hardcoded).
- **§E Token Consumption** — token classes only; `shadow-card` for card elevation.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/SponsorTierCard.tsx` | create | One sponsorship tier card on the teal ground |

> Composition: the Sponsors page (story 27) maps the three `sponsorTiers` to `<SponsorTierCard tier={t} />` inside a `SectionBand tone="teal"`. This story builds the single-tier card.

### E.2 Component example

`src/components/SponsorTierCard.tsx`:

```tsx
import type { SponsorTier } from '../data/sponsorTiers';

interface SponsorTierCardProps {
  tier: SponsorTier;
}

export function SponsorTierCard({ tier }: SponsorTierCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-md bg-teal-deep p-6 shadow-card">
      <h3 className="font-display text-3xl uppercase tracking-wide text-white">{tier.name}</h3>
      <p className="font-display text-4xl uppercase tracking-wide text-white">{tier.price}</p>
      <ul className="flex flex-col gap-2 font-sans text-base text-white">
        {tier.benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </article>
  );
}
```

> **TBC discipline:** the Silver tier's `benefits` array ends with the stored "Additional benefits — confirm with owner" string (from `sponsorTiers.ts`); it renders verbatim — the component does **not** fabricate the obscured benefits (PRD §10 item 3). All names/prices/benefits come from the `tier` prop (sourced from `sponsorTiers.ts`); nothing is hardcoded.
>
> **Teal-not-CTA:** the card ground is `bg-teal-deep` (within the page's `SectionBand tone="teal"`); there is **no** teal button. If a per-tier CTA is wanted, the builder adds a brand-red `Button` (`as="link" to="/contact"`) — but the page-level "Become a 2026 Sponsor" CTA (story 27) typically covers this, so the card needs no button.
>
> **Contrast:** white text on `teal-deep` should meet AA; the builder verifies and, if a tier card reads low-contrast, switches the card to `bg-white` with `text-ink` (still on the teal section ground) — flag the choice rather than introduce a new color.

### E.4 Design tokens used

- **Color:** `bg-teal-deep` (card), `text-white` (text); `bg-teal` section ground supplied by the page's `SectionBand`
- **Font family:** `font-display` (name + price, `uppercase tracking-wide`), `font-sans` (benefits)
- **Type size:** `text-4xl` (price), `text-3xl` (name), `text-base` (benefits)
- **Spacing:** `p-6` (24px), `gap-4` (16px), `gap-2` (8px) — approved scale
- **Radius:** `rounded-md` (8px); **Shadow:** `shadow-card`

### E.5 Interactions / behavior

None — presentational card. (Any optional CTA is the brand-red `Button`.)

### E.6 Responsive behavior

- Single card is full-width on mobile; the page lays three side by side on desktop (`md:grid-cols-3`) — the card itself is fluid. Benefit list reflows.

### E.7 Accessibility

- Tier name is `<h3>` (page owns `<h1>`; "Join in" is `<h2>`); no skipped levels.
- Benefits are a semantic `<ul>` of real text (PRD §8 — no tier content as image only).
- AA contrast on the teal ground verified.

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/SponsorTierCard.test.tsx`. Import a tier from `sponsorTiers` (e.g. find Platinum and Silver):

- Given the **Platinum** tier, renders `Platinum` and the exact price `$5,000` and at least one benefit (e.g. text containing "banners displayed at each event").
- Given the **Silver** tier, renders `$1,000` and the obscured-benefits text `Additional benefits — confirm with owner` (proving TBC is shown, not invented).
- The tier name renders as a heading (`getByRole('heading', { level: 3 })`).
- No element has a teal **button** (the card has no `<button>`/CTA with a teal background) — assert there is no `bg-teal` button.

**Manual check (all tiers):**
1. `npm run dev`, visit `/sponsors`: three tier cards on teal with exact prices and benefit lists as text.
2. Confirm Silver shows the "confirm with owner" line; no invented benefits; no teal buttons.

---

## G. Definition of Done (required)

- [ ] Renders one tier: name, exact price, benefits as real `<ul>` text — from `sponsorTiers.ts`.
- [ ] Obscured Silver benefits render as the stored "confirm with owner" text, never invented.
- [ ] Teal/teal-deep ground; tier name `<h3>`; AA contrast verified.
- [ ] No teal button (CTAs are brand-red only).
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `sponsorTiers.ts` (`SponsorTier`, story 1); optionally `Button` (3) for a per-tier CTA. Composed by Sponsors page (27).
- **Blockers:** None for the build. The full Silver benefit list is owner-pending (PRD §10 item 3); it stays the marked "confirm with owner" string in `sponsorTiers.ts` — a data fill-in, not a code change.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #23, §E #25)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.5, §8 item 21, §10 item 3)
- Related components: `sponsorTiers.ts` (1), `SectionBand` (4); composed by Sponsors (27) with SponsorWall (26).
