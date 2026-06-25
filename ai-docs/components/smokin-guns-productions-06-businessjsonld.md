# Component Build Story — BusinessJsonLd (SportsActivityLocation / LocalBusiness)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #3; §E Build Order #6)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `BusinessJsonLd`
- Build-order position: `6`
- Test tier: `light`

---

## A. Story Summary (required)

As the site owner, I need a machine-readable JSON-LD block describing the business and its primary venue with exact NAP, hours, phone, email, and URL, so that Google can surface the business in local results — a foundation the old single-page GoDaddy build never had.

---

## B. Background / Context (required)

Build-order step 6. Per PRD §7 local-SEO block and plan §C #3, `BusinessJsonLd` emits one `<script type="application/ld+json">` of type `SportsActivityLocation` (with `LocalBusiness` as the safe fallback) for the business + primary venue (Snook Rodeo Arena). It reads NAP/phone/email/hours/url from `businessInfo.ts` and the primary venue geo from `venues.ts` (both story 1). It is rendered on Home (and reused on Contact). It injects the script through `react-helmet-async` (provider from story 2), consistent with how `Seo` (story 5) manages the head. No prior story emits business schema — this is canonical.

---

## C. Acceptance Criteria (required)

1. Emits exactly one JSON-LD script with `@context: 'https://schema.org'` and `@type: 'SportsActivityLocation'`. A `fallbackToLocalBusiness` prop (default `false`) switches `@type` to `'LocalBusiness'` for the safe fallback (PRD §7).
2. Carries the **exact** NAP from `businessInfo.ts`: `name` = "Smokin' Guns Productions LLC"; `address` (`PostalAddress`) = streetAddress "11538 FM 3058", addressLocality "Somerville" (authoritative locality — not "Snook", PRD §7 gate), addressRegion "TX", postalCode "77874", addressCountry "US".
3. `telephone` = "832-857-2826" (or `+1-832-857-2826`), `email` from `businessInfo.email`, `url` from `businessInfo.url`.
4. `openingHoursSpecification` derived from `businessInfo.hours`: Mon–Fri opens 09:00 closes 17:00; Saturday/Sunday closed (either omitted or expressed as closed). Built from the structured hours, not a free-text string.
5. **`geo` is emitted only when present** — read `venues.snook.geo`; if `null`, omit the `geo` property entirely (PRD §10 item 7). When present, emit `GeoCoordinates` with `latitude`/`longitude`.
6. **No `priceRange`** — omitted by default (PRD §7 / §10 item 8: entry-fee process unconfirmed).
7. Validates in the Rich Results Test (manual gate) with no errors.
8. **Token-cleanliness:** head/script-only component — no JSX styling, no color/spacing/font-size classes.
9. `npm run typecheck` + `npm run lint` pass.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§C Component Structure** — functional component, inline `interface BusinessJsonLdProps`, **named export** `export function BusinessJsonLd`, no `any`; imports `businessInfo` and `venues` (with types) from `src/data/`.
- **§D File Organization** — component in `src/components/`; all NAP/hours/geo values come from `src/data/` (none hardcoded in the component).
- **§B Code Style** — single quotes, semicolons, import groups.
- No §E token rules apply (script-only).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/BusinessJsonLd.tsx` | create | Business + primary-venue JSON-LD script |

Composition: rendered inside the Home page composition (and reused on Contact) — those edits belong to the page-composition stories. Not wired into a page in this story.

### E.2 Component example

`src/components/BusinessJsonLd.tsx`:

```tsx
import { Helmet } from 'react-helmet-async';

import { businessInfo } from '../data/businessInfo';
import { venues } from '../data/venues';

interface BusinessJsonLdProps {
  /** Use the safe LocalBusiness type instead of SportsActivityLocation. */
  fallbackToLocalBusiness?: boolean;
}

export function BusinessJsonLd({ fallbackToLocalBusiness = false }: BusinessJsonLdProps) {
  const snook = venues.snook;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': fallbackToLocalBusiness ? 'LocalBusiness' : 'SportsActivityLocation',
    name: businessInfo.legalName,
    url: businessInfo.url,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.streetAddress,
      addressLocality: businessInfo.city, // 'Somerville' — authoritative locality
      addressRegion: businessInfo.state,
      postalCode: businessInfo.zip,
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    // No priceRange — entry-fee process unconfirmed (PRD §7 / §10 item 8).
  };

  // Emit geo only when coordinates are known (PRD §10 item 7).
  if (snook.geo) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: snook.geo.lat,
      longitude: snook.geo.lng,
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
```

> Optionally include a `location`/`containedInPlace` for the Snook venue address; the business address already equals the primary venue, so the single `address` block is sufficient and keeps the schema clean.

### E.4 Design tokens used

None — script/head-only component.

### E.5 Interactions / behavior

None. Injected via Helmet on mount; provider from story 2 required.

### E.6 Responsive behavior

N/A.

### E.7 Accessibility

N/A for screen output (JSON-LD is not rendered visibly). It improves machine readability / local SEO per PRD §7.

---

## F. Testing Strategy (required — Tier: light)

JSON-LD goes into `document.head` via Helmet. Create `src/components/BusinessJsonLd.test.tsx`:

- Render inside `HelmetProvider`; `waitFor` a `script[type="application/ld+json"]` to appear in `document.head`.
- Parse its text; assert `@type === 'SportsActivityLocation'` by default, and `'LocalBusiness'` when `fallbackToLocalBusiness` is set.
- Assert `address.streetAddress === '11538 FM 3058'`, `address.addressLocality === 'Somerville'`, `telephone === '832-857-2826'`.
- Assert `openingHoursSpecification` exists with `opens: '09:00'` / `closes: '17:00'`.
- Assert `priceRange` is **absent** and (with `venues.snook.geo === null`) `geo` is **absent**.

**Manual check (all tiers):**
1. Render the component on a page; view source, copy the JSON-LD into Google's Rich Results Test — expect no errors.
2. Confirm NAP matches the footer/Contact NAP character-for-character.

---

## G. Definition of Done (required)

- [ ] One JSON-LD script, `SportsActivityLocation` (LocalBusiness fallback via prop).
- [ ] Exact NAP (Somerville locality), telephone, email, url, `openingHoursSpecification` from data.
- [ ] `geo` emitted only when `venues.snook.geo` is present; otherwise omitted.
- [ ] No `priceRange`.
- [ ] All values sourced from `src/data/` (nothing hardcoded in the component).
- [ ] No styling/token usage (script-only).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing; validates in Rich Results Test (manual).

---

## H. Dependencies & Blockers (required)

- **Depends on:** story 1 `businessInfo.ts` + `venues.ts`; story 2 `HelmetProvider`. `react-helmet-async` already installed.
- **Blockers:** None identified for the build. `geo` stays omitted until owner supplies coordinates (PRD §10 item 7); the Snook-vs-Somerville canonical-city decision is a pre-launch gate (PRD §7) but the interim authoritative locality ("Somerville") is already encoded in `businessInfo.ts`.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #3, §E #6)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§B, §C, §D)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§7 local-SEO block; §10 items 6, 7, 8)
- Related components this depends on: `businessInfo.ts` + `venues.ts` (story 1), `HelmetProvider` (story 2); reused by Home and Contact compositions.
