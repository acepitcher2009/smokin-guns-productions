# Component Build Story — Contact page (composition)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #29; §E Build Order #31)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `Contact` page
- Build-order position: `31`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need the Contact page to bring together the contact details, the registration form, the venue map, and the business schema, so that I can reach the business, enter a race, and find the arena in one place.

---

## B. Background / Context (required)

Build-order step 31 — the conversion page composition. Per PRD §4.6 and plan §C #29, the `Contact` page composes `Seo` (5), `ContactInfo` (28), `RegistrationForm` (29), `VenueMap` (30), and reuses `BusinessJsonLd` (6). It replaces the placeholder `Contact.tsx` from story 2, renders `<Seo pageKey="contact" />`, and has exactly one `<h1>`. It is the destination for every Register CTA across the site (Hero, EventCard, Sponsors) — including `/contact?event=<id>`, which `RegistrationForm` reads to pre-select the event.

---

## C. Acceptance Criteria (required)

1. Replaces the placeholder `src/pages/Contact.tsx` — no leftover stub.
2. Renders `<Seo pageKey="contact" />` and `<BusinessJsonLd />` (reused from Home — the business schema on the conversion page too).
3. Composes `ContactInfo`, `RegistrationForm`, and `VenueMap`.
4. **One `<h1>`:** the page's lone `<h1>` (e.g. "Contact & Register"); `ContactInfo` renders "Contact Us" as `<h2>`; form/map labels are not headings or are `<h2>`/`<h3>` — verify exactly one `<h1>`.
5. The page works as the target of `/contact?event=<id>` (the `RegistrationForm` handles the query pre-select; the page just renders the form).
6. Single CTA color (`brand-red`) — the form's submit `Button`; no teal/pink buttons.
7. **Token-cleanliness:** the page adds no hardcoded color/spacing/size — only on-scale layout utilities; visual tokens come from children + `SectionBand`.
8. `npm run typecheck` + `npm run lint` pass; `npm run build` succeeds; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§D File Organization** — page in `src/pages/`; composes section components; data via the children (`businessInfo`, `events`, `venues`).
- **§C Component Structure** — functional component, **named export** `export function Contact`, no `any`.
- **§A / §E** — single `brand-red` CTA (form submit); cream ground via `SectionBand`; token classes only.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/pages/Contact.tsx` | modify (replace placeholder) | Compose Seo + BusinessJsonLd + ContactInfo + RegistrationForm + VenueMap |

> Composition edit: `Contact` is already routed via `<Route path="/contact" element={<Contact />} />` in `App.tsx` (story 2); this story replaces the placeholder body.

### E.2 Component example

`src/pages/Contact.tsx`:

```tsx
import { BusinessJsonLd } from '../components/BusinessJsonLd';
import { ContactInfo } from '../components/ContactInfo';
import { RegistrationForm } from '../components/RegistrationForm';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';
import { VenueMap } from '../components/VenueMap';

export function Contact() {
  return (
    <>
      <Seo pageKey="contact" />
      <BusinessJsonLd />

      <SectionBand tone="cream">
        <div className="flex flex-col gap-12">
          <h1 className="font-display text-5xl uppercase tracking-wide text-ink">
            Contact &amp; Register
          </h1>

          <div className="grid gap-12 md:grid-cols-2">
            <ContactInfo />
            <RegistrationForm />
          </div>

          <VenueMap />
        </div>
      </SectionBand>
    </>
  );
}
```

> **One `<h1>`:** the page's lone `<h1>` is "Contact & Register"; `ContactInfo` emits "Contact Us" as `<h2>`. The builder verifies a single `<h1>`. **BusinessJsonLd reuse:** the same component used on Home (story 6) is rendered here too — the conversion page carries the business schema (PRD §7). **Query pre-select:** the page does nothing special for `?event=<id>` — `RegistrationForm` (story 29) reads it via `useSearchParams`. The form's submit is the only solid CTA (brand-red).

### E.4 Design tokens used

- No new tokens. Layout utilities: `grid`, `gap-12` (48px, approved), `md:grid-cols-2`; page `<h1>` uses `font-display text-5xl uppercase tracking-wide text-ink`. Visual tokens otherwise from children + `SectionBand`.

### E.5 Interactions / behavior

- None at the page level beyond the children (form state, map consent gate, links).

### E.6 Responsive behavior

- `ContactInfo` + `RegistrationForm` side by side on `md:`+ and stacked on mobile; `VenueMap` full-width below. All children full-width on mobile.

### E.7 Accessibility

- One `<main>` (from the `App` shell); exactly one `<h1>`; section headings `<h2>`/`<h3>`.
- Children carry their own accessibility (labeled form, `<address>`, map title).

---

## F. Testing Strategy (required — Tier: light)

Create `src/pages/Contact.test.tsx` (render inside `MemoryRouter` + `HelmetProvider`; mock `@emailjs/browser`):

- Renders exactly one `<h1>` (text "Contact & Register").
- Renders the NAP street `11538 FM 3058` (from `ContactInfo`) and the registration form's event `<select>` (queryable by its label "Which race are you entering?").
- Rendering at `/contact?event=snook-jackpot-2026-06-20` pre-selects that event in the form's `<select>` (composition + form integration check).
- A `BusinessJsonLd` script is present in `document.head` (`script[type="application/ld+json"]`).

**Manual check (all tiers):**
1. `npm run dev`, visit `/contact`: contact details, registration form, and venue map all present.
2. From an event card's Register CTA, confirm the event is pre-selected here.
3. Inspect: one `<h1>`; the only solid CTA is the brand-red submit; business JSON-LD in head.

---

## G. Definition of Done (required)

- [ ] Placeholder `Contact.tsx` replaced; composes Seo + BusinessJsonLd + ContactInfo + RegistrationForm + VenueMap.
- [ ] Exactly one `<h1>`; section headings `<h2>`/`<h3>`.
- [ ] Works as the target of `/contact?event=<id>` (form pre-selects).
- [ ] Single `brand-red` CTA (form submit); no teal/pink buttons.
- [ ] Only design-system tokens + on-scale layout utilities (no hardcoded values).
- [ ] TypeScript zero new errors; lint passes; `npm run build` succeeds.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `Seo` (5), `BusinessJsonLd` (6), `ContactInfo` (28), `RegistrationForm` (29), `VenueMap` (30), `SectionBand` (4). Route wired in `App` (2).
- **Blockers:** None for the build. EmailJS keys (`.env`), venue geo, and registration-process specifics are owner-pending (PRD §10 items 7, 8) — they flow through the children as marked placeholders and do not block the page.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #29, §E #31)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.6, §7, §9)
- Related components: ContactInfo (28), RegistrationForm (29), VenueMap (30), Seo (5), BusinessJsonLd (6), SectionBand (4).
