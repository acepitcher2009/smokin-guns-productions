# Component Build Story — ContactInfo (exact NAP, hours, intro copy)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #26; §E Build Order #28)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `ContactInfo`
- Build-order position: `28`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need the exact address, phone, email, and hours of the business in a clearly marked contact block, so that I can reach Smokin' Guns Productions and find the arena without ambiguity.

---

## B. Background / Context (required)

Build-order step 28. Per PRD §4.6 / §8 items 14–17, 27 and plan §C #26, `ContactInfo` renders the exact NAP in a semantic `<address>`, the phone as a `tel:` link, the email as a `mailto:` link, the hours, and the contact intro copy ("Better yet, see us in person!... Ask about our 2026 Sponsorship Opportunity."). All values come from `businessInfo.ts` (story 1: `venueName`, `streetAddress`, `city`, `state`, `zip`, `phone`, `phoneHref`, `email`, `hours`, `contactIntro`) — consistent with the schema emitted by `BusinessJsonLd` (story 6). The phone is `text-brand-red` (the brand color used for the phone, per PRD §2). It sits on a cream ground. No prior story renders the NAP block (the Footer, story 9, also shows NAP — both read the same `businessInfo.ts`, so they stay consistent).

---

## C. Acceptance Criteria (required)

1. Renders the exact NAP from `businessInfo.ts` inside a semantic `<address>`: `Snook Rodeo Arena, 11538 FM 3058, Somerville, TX 77874`.
2. Phone `832-857-2826` rendered as a `tel:` link using `businessInfo.phoneHref` (`tel:8328572826`), styled `text-brand-red`.
3. Email `smokingunsproductions@gmail.com` rendered as a `mailto:` link.
4. Hours rendered exactly: Mon–Fri 9:00am–5:00pm; Sat–Sun closed; closed major holidays unless events scheduled (from `businessInfo.hours`).
5. Renders the contact intro copy verbatim from `businessInfo.contactIntro`.
6. NAP/phone/email/hours match `BusinessJsonLd` (story 6) character-for-character (same `businessInfo.ts` source — verify no divergence).
7. A section heading (e.g. "Contact Us") is the appropriate level — the Contact page (story 31) owns the page `<h1>`; `ContactInfo` uses an `<h2>` — no skipped levels.
8. **Token-cleanliness:** only design-system tokens — `font-display`/`font-sans`, `text-ink`, `text-brand-red` (phone), cream ground via `SectionBand`, type-scale sizes, spacing scale. **No hardcoded color/spacing/size.**
9. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — `text-brand-red` for the phone (brand color as text/link, per PRD §2); cream content ground; no teal/pink.
- **§C Component Structure** — functional component, **named export** `export function ContactInfo`, inline props (likely none), no `any`; imports `businessInfo` from `src/data/businessInfo`.
- **§D File Organization** — component in `src/components/`; NAP/hours/intro from `src/data/businessInfo.ts` (nothing hardcoded).
- **§E Token Consumption** — token classes only.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/ContactInfo.tsx` | create | Exact NAP (`<address>`), phone/email links, hours, intro copy |

> Composition: rendered by the Contact page (story 31). This story builds the component only.

### E.2 Component example

`src/components/ContactInfo.tsx`:

```tsx
import { businessInfo } from '../data/businessInfo';

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Contact Us</h2>

      <p className="font-sans text-xl text-ink">{businessInfo.contactIntro}</p>

      <address className="flex flex-col gap-2 font-sans text-base not-italic text-ink">
        <span className="font-display text-3xl uppercase tracking-wide text-ink">
          {businessInfo.legalName}
        </span>
        <span>{businessInfo.venueName}</span>
        <span>{businessInfo.streetAddress}</span>
        <span>
          {businessInfo.city}, {businessInfo.state} {businessInfo.zip}
        </span>
        <a href={businessInfo.phoneHref} className="text-brand-red">
          {businessInfo.phone}
        </a>
        <a href={`mailto:${businessInfo.email}`} className="text-brand-red">
          {businessInfo.email}
        </a>
      </address>

      <div className="flex flex-col gap-1 font-sans text-base text-ink">
        <span>{businessInfo.hours.weekdays}</span>
        <span>{businessInfo.hours.weekend}</span>
        <span>{businessInfo.hours.holidays}</span>
      </div>
    </div>
  );
}
```

> **NAP consistency:** every value comes from `businessInfo.ts` — the same source `BusinessJsonLd` (story 6) and the Footer (story 9) read — so the rendered NAP, phone, email, and hours match the schema character-for-character. The `<address>` is the semantic landmark (`not-italic` keeps the display upright). `text-brand-red` on the phone/email is the brand color as a link (not a solid button). The intro copy renders verbatim from `contactIntro`. Heading is `<h2>` (page owns `<h1>`).

### E.4 Design tokens used

- **Color:** `text-ink` (body), `text-brand-red` (phone + email links); cream ground via the page's `SectionBand`
- **Font family:** `font-display` (heading + name lockup, `uppercase tracking-wide`), `font-sans` (address/hours/intro)
- **Type size:** `text-4xl` (h2), `text-3xl` (name lockup), `text-xl` (intro), `text-base` (address/hours)
- **Spacing:** `gap-6` (24px), `gap-2` (8px), `gap-1` (4px) — approved scale

### E.5 Interactions / behavior

- `tel:` and `mailto:` links. No internal state.

### E.6 Responsive behavior

- Single-column block; full-width on mobile, contained on desktop. Tap targets (links) ≥44px.

### E.7 Accessibility

- NAP wrapped in a semantic `<address>` (PRD §7).
- Heading `<h2>` (page owns `<h1>`); no skipped levels.
- `tel:`/`mailto:` links are descriptive (show the real number/email). `text-brand-red` on cream meets AA (verify).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/ContactInfo.test.tsx`:

- Renders an `<address>` element (`container.querySelector('address')` is present).
- Renders the exact street `11538 FM 3058`, city/state/zip `Somerville, TX 77874`.
- Renders a phone link with `href="tel:8328572826"` and visible text `832-857-2826`.
- Renders a `mailto:` link to `smokingunsproductions@gmail.com`.
- Renders the hours `Mon–Fri 9:00am–5:00pm` and the intro copy containing `Ask about our 2026 Sponsorship Opportunity.`.

**Manual check (all tiers):**
1. `npm run dev`, visit `/contact`: NAP in an address block; phone dials; email opens mail client; hours + intro present.
2. Compare the rendered NAP to the footer and the JSON-LD — identical.

---

## G. Definition of Done (required)

- [ ] Exact NAP in a semantic `<address>`; values from `businessInfo.ts`.
- [ ] `tel:`/`mailto:` links; phone styled `text-brand-red`.
- [ ] Hours + verbatim contact intro present.
- [ ] NAP/phone/email/hours match `BusinessJsonLd` + Footer (same source).
- [ ] Heading `<h2>`.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `businessInfo.ts` (`businessInfo`, story 1). Composed by Contact page (31); shares NAP source with Footer (9) and BusinessJsonLd (6).
- **Blockers:** None identified. (Snook-vs-Somerville canonical city is a pre-launch gate per PRD §7, but the interim authoritative locality "Somerville" is already in `businessInfo.ts`.)

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #26, §E #28)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.6, §7, §8 items 14–17/27)
- Related components: `businessInfo.ts` (1); composed by Contact (31); consistent with Footer (9) + BusinessJsonLd (6).
