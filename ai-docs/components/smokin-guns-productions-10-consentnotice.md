# Component Build Story — ConsentNotice (owned, dismissible, localStorage-persisted)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #9; §E Build Order #10)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `ConsentNotice`
- Build-order position: `10`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need a small, dismissible notice with the business's own privacy statement and an accept/dismiss action that stays gone once I dismiss it, so that I'm informed without a persistent banner permanently covering the page — replacing the old GoDaddy cookie banner and its boilerplate Google links.

---

## B. Background / Context (required)

This is build-order step 10 and the first **real** implementation of the shell `ConsentNotice` placeholder from story 2. Per PRD §5 (replace the persistent red GoDaddy cookie banner + boilerplate Google policy links with an owned, minimal, dismissible consent notice) and plan §C #9, it renders a minimal bottom notice with the business's **own** privacy statement and an accept/dismiss button, persisting dismissal in `localStorage` so it does not reappear. It reuses the shared `Button` primitive (story 3) for the dismiss action and is already mounted by the shell in `src/App.tsx` (story 2). It optionally **exposes consent state** so the Contact-page `VenueMap` (story/plan §C #28) can gate a cookie-setting map embed behind consent. It carries **no GoDaddy/Google boilerplate** (discard item 3).

---

## C. Acceptance Criteria (required)

1. **Owned copy:** renders the business's **own** privacy/consent statement as real text — no Google/GoDaddy boilerplate, no third-party policy links. The exact statement is owner-pending (PRD §10 item 14), so ship a clear default with a `TODO(owner-confirm)` (e.g. "We use minimal cookies to keep this site working and to embed a venue map. We don't sell your data.").
2. **Accept/dismiss action:** a `brand-red` `Button` ("Got it" / "Accept") dismisses the notice; an optional secondary text control may also dismiss. The notice unmounts (or hides) on dismiss.
3. **Persisted dismissal:** dismissal is written to `localStorage` under a stable key (e.g. `sgp-consent`); on subsequent loads the notice **does not reappear** (mounts only if the key is absent/unset).
4. **Mounts only if not dismissed:** on mount it reads `localStorage`; if already dismissed it renders `null` (no flash). Reads are guarded for SSR/`localStorage` unavailability (try/catch; treat errors as "not dismissed").
5. **Does not permanently obscure content:** positioned as a slim `fixed` bottom strip that does not block the whole viewport and is fully dismissible — it must not behave like the old never-dismissing GoDaddy banner.
6. **Keyboard-dismissible:** the dismiss `Button` is keyboard-reachable and operable (Enter/Space) with a visible `focus-visible` ring; the notice is reachable in tab order.
7. **Reduced-motion-safe:** any entrance/exit transition is gated behind `motion-safe:` (`motion-reduce:transition-none`) per CONVENTIONS.md §E / PRD §5.
8. **Exposes consent state (optional hook):** the dismissal state is readable by other components (the `VenueMap` gate). Provide a tiny exported helper (e.g. `export function hasConsent(): boolean` reading the same `localStorage` key) so story 28 can conditionally render a cookie-setting embed. This keeps the consent contract in one module.
9. **Token-cleanliness:** only design-system tokens — `bg-ink`/`bg-cream-deep`, `text-white`/`text-ink`, the approved type scale + spacing keys, `shadow-card`, `rounded-md`; **no hardcoded color/spacing/font-size**. Contrast meets AA on the chosen ground.
10. `npm run typecheck` + `npm run lint` pass; the story-2 placeholder `ConsentNotice` is fully replaced.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — the dismiss button is the single CTA color `brand-red` (via the `Button` primitive); the notice ground is `ink` or `cream-deep` (no teal/pink button).
- **§C Component Structure** — functional component, **named export** `export function ConsentNotice`, no `any`, typed `useState`; a small co-located helper (`hasConsent`) is allowed in the same file as a named export.
- **§D File Organization** — component at `src/components/ConsentNotice.tsx`; reuses the shared `Button` from `src/components/Button.tsx`.
- **§E Token Consumption** — approved color/type/spacing classes only; motion behind `motion-safe:`/`motion-reduce:`.
- **§B Code Style** — single quotes, semicolons, import groups (external `react` → internal `./Button`).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/ConsentNotice.tsx` | modify (replace story-2 placeholder) | Owned dismissible bottom consent notice + `localStorage` persistence + `hasConsent` helper |

> Composition: `ConsentNotice` is already rendered by the shell in `src/App.tsx` (story 2) — **no `App.tsx` edit needed**; replacing the placeholder activates the real notice site-wide. The exported `hasConsent` helper is consumed later by `VenueMap` (story 28), not wired here.

### E.2 Component example

`src/components/ConsentNotice.tsx` (named export, reuses `Button`, tokens only):

```tsx
import { useEffect, useState } from 'react';

import { Button } from './Button';

const CONSENT_KEY = 'sgp-consent';

/** True once the visitor has accepted/dismissed the notice. Safe if localStorage is unavailable. */
export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'dismissed';
  } catch {
    return false;
  }
}

export function ConsentNotice() {
  // Start hidden; reveal after the mount-time read so a prior dismissal never flashes.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsent()) setVisible(true);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(CONSENT_KEY, 'dismissed');
    } catch {
      // Ignore storage failures; just hide for this session.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className="fixed inset-x-0 bottom-0 z-40 bg-ink text-white shadow-card motion-safe:transition-transform motion-reduce:transition-none"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
        {/* TODO(owner-confirm): replace with the business's own privacy statement (PRD §10 item 14). */}
        <p className="font-sans text-sm text-white">
          We use minimal cookies to keep this site working and to embed a venue map. We don&apos;t
          sell your data.
        </p>
        <Button onClick={dismiss}>Got it</Button>
      </div>
    </div>
  );
}
```

> **No-flash pattern:** `visible` starts `false` and is set `true` only after the mount-time `localStorage` read, so a returning (dismissed) visitor never sees a flash. **SSR/storage safety:** all `localStorage` access is in `try/catch`. **Single source of consent:** `hasConsent` and the write share `CONSENT_KEY`, so `VenueMap` (story 28) reads the same truth. The dismiss `Button` is the default `<button>` form of the shared primitive (single `brand-red` CTA color).

### E.4 Design tokens used

- **Color:** `bg-ink`, `text-white` (notice ground — AA), and `brand-red`/`brand-red-dark` inherited from the `Button` dismiss control
- **Font family:** `font-sans` (notice body)
- **Type size:** `text-sm` (fine-print notice copy)
- **Spacing:** `px-4` (16px), `py-6` (24px), `gap-4` (16px) — approved scale
- **Radius/shadow:** `shadow-card` (subtle elevation on the strip)
- **Motion:** `motion-safe:transition-transform` + `motion-reduce:transition-none`

### E.5 Interactions / behavior

- **Mount-time read:** `useEffect` reads `localStorage` once; shows the notice only if not previously dismissed.
- **Dismiss:** writes `'dismissed'` to `localStorage` under `CONSENT_KEY` and hides the notice; it will not reappear on reload.
- **Consent state:** `hasConsent()` returns the same truth for other components (the map gate).
- No autoplay; the only motion is a reduced-motion-safe transform transition.

### E.6 Responsive behavior

- **Mobile (≤640px):** the copy stacks above the dismiss button (`flex-col`), a slim bottom strip that does not cover the page.
- **Tablet/desktop (`md` and up):** copy and the dismiss button sit on one row (`md:flex-row md:justify-between`).
- Full-bleed bottom strip at every breakpoint; inner content capped at `max-w-6xl`.

### E.7 Accessibility

- Container is `role="region"` with `aria-label="Privacy notice"` so screen readers can find and skip it; it is **not** an `aria-modal` dialog (it must not trap focus or block the page — AC #5).
- Introduces **no heading** — preserves the page's single `<h1>` and no skipped levels.
- Dismiss is a real `<button>` (the shared `Button`), keyboard-operable with a visible `focus-visible` ring; the notice is in normal tab order.
- Slim, non-blocking placement so content stays reachable while the notice is shown.

---

## F. Testing Strategy (required — Tier: light)

Smoke test that the notice shows when no consent is stored, that dismissing persists, and that it stays hidden afterward. Create `src/components/ConsentNotice.test.tsx`; clear `localStorage` in `beforeEach`. Use `@testing-library/user-event`. Concrete tests:

- With empty `localStorage`, the notice renders (the privacy copy and a "Got it" button are present).
- **Dismiss persists:** clicking "Got it" hides the notice **and** writes `localStorage.getItem('sgp-consent') === 'dismissed'`.
- With `localStorage` pre-set to `'dismissed'`, the component renders `null` (notice absent on mount).
- `hasConsent()` returns `false` with empty storage and `true` after dismissal.

**Manual check (all tiers):**
1. Clear site data; `npm run dev` → the bottom notice appears with the business's own copy (no Google/GoDaddy text).
2. Tab to "Got it" (visible focus ring), press Enter → notice disappears.
3. Reload → notice does **not** reappear.
4. Confirm the strip never covers the whole viewport and content above it stays clickable.

---

## G. Definition of Done (required)

- [ ] Owned privacy statement as real text; no Google/GoDaddy boilerplate or third-party policy links.
- [ ] `brand-red` `Button` dismiss; dismissal persisted in `localStorage` and does not reappear on reload.
- [ ] Mounts only if not dismissed (no flash); `localStorage` access guarded.
- [ ] Slim bottom strip that does not permanently obscure content; keyboard-dismissible with visible focus.
- [ ] Reduced-motion-safe transitions.
- [ ] `hasConsent()` helper exported for the `VenueMap` consent gate (story 28).
- [ ] Only design-system tokens (no hardcoded color/spacing/font-size); AA contrast.
- [ ] Story-2 placeholder `ConsentNotice` fully replaced; reuses shared `Button`.
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `Button` (story 3) and the shell mount (story 2). No data file (consent copy is small, inlined with a `TODO(owner-confirm)`; the plan permits inlining or a small `consent.ts`).
- **Blockers:** None identified. The exact privacy statement / consent preference is owner-pending (PRD §10 item 14) — shipped as a clear default with a `TODO(owner-confirm)`, swappable without structural change.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #9, §E #10)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §B, §C, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§5; discard item 3; §10 item 14)
- Related components this depends on: `Button` (3), App shell (2); consumed by `VenueMap` (28) via `hasConsent()`.
