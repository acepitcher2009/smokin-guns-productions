# Component Build Story — VenueMap (privacy-respecting, lazy, consent-gated)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #28; §E Build Order #30)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `VenueMap`
- Build-order position: `30`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor planning to attend, I need a map of Snook Rodeo Arena that loads without tracking me until I allow it, so that I can find the venue while the page stays fast and privacy-respecting.

---

## B. Background / Context (required)

Build-order step 30. Per PRD §4.6 / §7 (embedded map) / §5–§6 (privacy, consent, CWV) and plan §C #28, `VenueMap` embeds a privacy-respecting, **lazy-loaded** map of the primary venue (Snook Rodeo Arena) from `venues.ts` (story 1: `venues.snook` — name/address; `geo` is `null` until owner-confirmed). It must be **LCP/CLS safe** (lazy `<iframe>` with explicit aspect ratio) and, **if it sets third-party cookies, gated behind `ConsentNotice` consent** (story 10). The recommended approach is a privacy embed or a static-map link-out (avoid render-blocking third-party scripts — plan §G map gap). `rounded-md`; full-width on mobile. No prior story embeds a map.

---

## C. Acceptance Criteria (required)

1. Shows the primary venue (Snook Rodeo Arena) from `venues.ts` — its name/address rendered as text alongside the map (so the location is readable even if the map is gated/unloaded).
2. **Lazy-loaded** map (no render-blocking): the embed `<iframe loading="lazy">` (or a click-to-load), so it does not block LCP; reserves space with an explicit aspect ratio so CLS ≈ 0.
3. **Consent gating:** if the chosen embed sets third-party cookies (e.g. a Google Maps iframe), it renders **only after consent** — read the same consent signal `ConsentNotice` (story 10) persists (e.g. `localStorage`), and until consent is given show a privacy placeholder with a "Show map" action and/or a static-map link-out to directions. A privacy-respecting embed that sets no cookies may render directly.
4. `rounded-md` corners; full-width on mobile.
5. The map `<iframe>` has a descriptive `title`; the directions link-out has descriptive text (not a bare URL).
6. **Token-cleanliness:** only design-system tokens — `rounded-md`, `bg-cream-deep` (placeholder), `text-ink`/`text-brand-red` (link), `font-sans`, spacing scale, and a layout aspect-ratio utility (not a color/spacing token). **No hardcoded color/spacing/size**; **no `h-[...px]` arbitrary value** — reserve height via `aspect-[...]` or a tokenized height.
7. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — neutral cream-deep placeholder; `text-brand-red` link (not a button); no teal/pink.
- **§C Component Structure** — functional component, inline `interface VenueMapProps` (likely none, or an optional `venueId`), **named export** `export function VenueMap`, no `any`; imports `venues` from `src/data/venues`.
- **§D File Organization** — component in `src/components/`; venue address/geo from `src/data/venues.ts`.
- **§E Token Consumption** — token classes only; no arbitrary `h-[...]` — use `aspect-[ratio]` (a layout ratio) or a tokenized height; lazy-load per §E/PRD §6.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/VenueMap.tsx` | create | Lazy, privacy-respecting, consent-gated venue map + directions link |

> Composition: rendered by the Contact page (story 31). This story builds the component only. The consent signal is shared with `ConsentNotice` (story 10); coordinate on the `localStorage` key (e.g. `sgp-consent`). If story 10 has not finalized the key, default to gating (show placeholder) until consent is detected — fail safe (private).

### E.2 Component example

`src/components/VenueMap.tsx`:

```tsx
import { useEffect, useState } from 'react';

import { venues } from '../data/venues';

const CONSENT_KEY = 'sgp-consent'; // shared with ConsentNotice (story 10)

/** Privacy embed src for the Snook venue. Prefer a cookie-light embed or static map. */
function mapSrcFor(address: string): string {
  const query = encodeURIComponent(address);
  // Cookieless OSM embed avoids consent-gating; swap to a Google embed only behind consent.
  return `https://www.openstreetmap.org/export/embed.html?bbox=&query=${query}`;
}

function directionsLinkFor(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function VenueMap() {
  const snook = venues.snook;
  const address = `${snook.name}, ${snook.streetAddress}, ${snook.city}, ${snook.state} ${snook.zip}`;
  const [consented, setConsented] = useState(false);

  // Detect consent persisted by ConsentNotice; cookie-setting embeds load only after consent.
  useEffect(() => {
    setConsented(window.localStorage.getItem(CONSENT_KEY) === 'accepted');
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-base text-ink">{address}</p>

      {consented ? (
        <iframe
          src={mapSrcFor(address)}
          title={`Map to ${snook.name}`}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-md border-0"
        />
      ) : (
        <div className="flex flex-col items-start gap-2 rounded-md bg-cream-deep p-6">
          <p className="font-sans text-base text-ink">
            The map loads after you accept our privacy notice.
          </p>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(CONSENT_KEY, 'accepted');
              setConsented(true);
            }}
            className="font-sans text-base text-brand-red underline"
          >
            Show map
          </button>
        </div>
      )}

      <a
        href={directionsLinkFor(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans text-base text-brand-red underline"
      >
        Get directions to {snook.name}
      </a>
    </div>
  );
}
```

> **Privacy/consent:** the example uses a cookieless OpenStreetMap embed (recommended — no consent needed), but still gates rendering behind a consent signal as the safe default and always offers a static directions link-out (no render-blocking script, LCP-safe). If the builder must use a Google Maps iframe (which sets cookies), it renders **only** when `localStorage[CONSENT_KEY] === 'accepted'` (shared with `ConsentNotice`, story 10) — the placeholder + "Show map" affordance covers the pre-consent state. **CLS:** the iframe reserves space via `aspect-[4/3]` (a layout ratio, not an arbitrary `h-[...px]`), so the map area never shifts. The venue address renders as text regardless, so the location is always available. `geo` is `null` in `venues.ts` for now (PRD §10 item 7); the embed/link use the address string, which works without coordinates.
>
> **Token note:** `aspect-[4/3]` is a layout aspect-ratio utility (acceptable — not a color/spacing/size token violation). Do **not** use `h-[480px]` or any arbitrary pixel height. If a fixed height is needed, add a token to `src/index.css` (CONVENTIONS.md §E).

### E.4 Design tokens used

- **Color:** `bg-cream-deep` (placeholder), `text-ink` (address/copy), `text-brand-red` (links/Show-map)
- **Font family:** `font-sans`
- **Type size:** `text-base`
- **Spacing:** `gap-4` (16px), `gap-2` (8px), `p-6` (24px) — approved scale
- **Radius:** `rounded-md` (8px); layout `aspect-[4/3]`, `w-full`

### E.5 Interactions / behavior

- Reads the consent signal on mount; before consent shows a placeholder + "Show map" (writes consent, reveals the embed); after consent the lazy iframe loads. Directions link opens in a new tab. All gating is `localStorage`-backed (shared with story 10).

### E.6 Responsive behavior

- Full-width on mobile; the `aspect-[4/3]` box scales with width and holds the ratio (no CLS). Directions link tap target ≥44px.

### E.7 Accessibility

- The iframe has a descriptive `title`; the directions link has descriptive text (not a bare URL).
- The address is real text (readable without the map).
- "Show map" is a real `<button>` (keyboard-accessible).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/VenueMap.test.tsx` (control `localStorage` before render):

- With no consent in `localStorage`, renders the placeholder copy ("loads after you accept") and a "Show map" button — and **no `<iframe>`** is present (consent-gated by default).
- Clicking "Show map" sets consent and reveals an `<iframe>` with a `title` (use `user-event` + assert the iframe appears).
- With `localStorage['sgp-consent'] === 'accepted'` set before render, the `<iframe>` renders immediately.
- The venue address text (`11538 FM 3058`) and a "Get directions" link are present in every state.

**Manual check (all tiers):**
1. `npm run dev`, visit `/contact`: address shown; map gated until consent; "Get directions" always works.
2. Confirm no layout shift when the map appears (CLS ≈ 0) and no render-blocking map script.

---

## G. Definition of Done (required)

- [ ] Snook venue address rendered as text; map lazy-loaded (LCP-safe) with reserved aspect ratio (CLS ≈ 0).
- [ ] Cookie-setting embeds gated behind consent (shared signal with `ConsentNotice`); cookieless embed/static link-out preferred.
- [ ] `rounded-md`; full-width on mobile; descriptive iframe `title` + directions link text.
- [ ] No arbitrary `h-[...]`/hex/off-scale values; only design-system tokens + layout aspect-ratio.
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test (gated by default + reveal on consent) present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `venues.ts` (`venues.snook`, story 1); consent signal shared with `ConsentNotice` (story 10). Composed by Contact page (31).
- **Blockers:** None for the build. Venue geo coordinates are owner-pending (PRD §10 item 7) — the address-based embed/link work without them; the final map-provider choice (privacy embed vs Google-behind-consent) is a non-blocking decision (plan §G) and the component supports both via the consent gate. Coordinate the `localStorage` consent key with story 10.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #28, §E #30, §G map gap)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.6, §5, §6, §7, §10 item 7)
- Related components: `venues.ts` (1), `ConsentNotice` (10); composed by Contact (31).
