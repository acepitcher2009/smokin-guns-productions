# Component Build Story — Header (sticky nav, logo, persistent Register CTA, mobile drawer)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #7; §E Build Order #8)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `Header`
- Build-order position: `8`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need a persistent top header with the logo, real multi-page navigation, an obvious page indicator, and an always-present "Register" button — collapsing to a hamburger drawer on mobile — so that I can reach any page and the registration path from anywhere, replacing the old single-page stack with its dead "More" menu.

---

## B. Background / Context (required)

This is build-order step 8 and the first **real** implementation of the shell `Header` placeholder stood up in story 2 (`App`). Per PRD §3 / §5 / §9 and plan §C #7, the header is sticky, renders the logo (links Home), a horizontal nav driven by `nav.ts` (story 1) with active-page state, and a persistent `brand-red` "Register" CTA routing to `/contact` using the shared `Button` primitive (story 3). On mobile it collapses to a hamburger that toggles a drawer containing the same nav + CTA; the drawer closes when the user navigates. It reuses the established `Button` (the only CTA primitive) and `nav.ts` (the single nav source) — it does not invent a second button style or a second nav list. There is **no dead "More" menu** (PRD discard item 2).

**Logo asset note:** the PRD (item 18, §10 item 1) calls for a re-sourced, higher-fidelity crossed-pistols "SMOKIN' GUNS PRODUCTIONS" emblem that must read cleanly on **both** `brand-red` and `teal` grounds. The high-fidelity asset is owner-pending, so this story ships a **marked placeholder**: an `import` of `src/assets/logo.svg` if present, falling back to a text lockup. The header background here is `bg-cream` (light ground), so the immediate contrast concern is logo-on-cream; the red/teal-ground requirement is documented so the supplied asset is chosen to satisfy it.

---

## C. Acceptance Criteria (required)

1. **Sticky:** the header stays pinned to the top on scroll (`sticky top-0 z-50`) with the `bg-cream` ground and a subtle bottom divider using a palette token (`border-cream-deep`).
2. **Logo links Home:** a logo (placeholder asset or text lockup "SMOKIN' GUNS PRODUCTIONS") wrapped in a router `<Link to="/">`; clicking it routes to `/`.
3. **Nav from `nav.ts`:** the six nav items render in order from `nav.ts` (Home, Events, Results & Standings, About, Sponsors, Contact / Location) as router `NavLink`s — no hardcoded link list.
4. **Active-page state:** the `NavLink` for the current route shows a distinct active style (e.g. `text-brand-red` + underline/weight) driven by `NavLink`'s `isActive`; non-active links are `text-ink`. Exactly one link is active per page.
5. **Persistent Register CTA:** a `brand-red` `Button` labelled "Register" routes to `/contact` (via `as="link"` `to="/contact"`), present on **every** page in both the desktop bar and the mobile drawer. It is the only `brand-red` CTA in the header (single-CTA discipline).
6. **Mobile hamburger + drawer:** below the `md` breakpoint the horizontal nav is hidden and a hamburger button (lucide `Menu` icon) is shown; activating it opens a drawer containing the same six nav links + the Register CTA. A close control (lucide `X`) and/or backdrop closes it.
7. **Closes on navigation:** selecting any nav link (or the Register CTA) in the drawer closes the drawer (drawer state resets on `pathname` change).
8. **Tap targets ≥ 44px:** the hamburger button, every nav link, and the CTA have a ≥44px touch target (on-scale padding such as `p-3`/`px-4 py-3`; verify rendered height).
9. **Keyboard-navigable:** all links and the hamburger are reachable and operable by keyboard with a visible `focus-visible` ring (palette token); the drawer is dismissible with the keyboard (e.g. `Escape` closes it) and focus is not lost.
10. **Motion gated:** any drawer open/close transition is behind `motion-safe:` (`motion-reduce:transition-none`) per CONVENTIONS.md §E / PRD §5.
11. **Token-cleanliness:** only design-system tokens — `bg-cream`, `border-cream-deep`, `text-ink`, `text-brand-red`, `font-display`/`font-sans`, the approved type scale and spacing keys; **no hardcoded color/spacing/font-size values**, no arbitrary px.
12. `npm run typecheck` + `npm run lint` pass; the placeholder shell `Header` from story 2 is fully replaced.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — `brand-red` is the single CTA color (the Register button); nav text is `text-ink` / active `text-brand-red`; no teal/pink buttons; the header ground is `cream`.
- **§C Component Structure** — functional component, inline `interface HeaderProps` (here props-less; still typed), **named export** `export function Header`, no `any`, `nav.ts` types imported, drawer variant expressed via typed state not free-form classes.
- **§D File Organization** — component at `src/components/Header.tsx`; nav data imported from `src/data/nav.ts`; logo asset from `src/assets/`; no hardcoded nav list in JSX.
- **§E Token Consumption** — approved color/type/spacing/family classes only; single CTA color; motion behind `motion-safe:`/`motion-reduce:`.
- **§B Code Style** — single quotes, semicolons, import groups (external `react`/`react-router-dom`/`lucide-react` → internal `./Button`, `../data/nav` → assets `../assets/logo`).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/Header.tsx` | modify (replace story-2 placeholder) | Sticky header: logo, `nav.ts` NavLinks with active state, persistent Register `Button`, mobile hamburger + drawer |
| `src/assets/logo.svg` | create (marked placeholder) | Crossed-pistols emblem placeholder; swap with the owner's high-fidelity asset (PRD §10 item 1) |

> Composition: `Header` is already rendered by the shell in `src/App.tsx` (story 2) — **no `App.tsx` edit is needed**; replacing the placeholder file wires the real header into every page automatically.

### E.2 Component example

`src/components/Header.tsx` (mirrors the CONVENTIONS.md §C skeleton — named export, typed state, tokens only; reuses the shared `Button` and `nav.ts`):

```tsx
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { Button } from './Button';
import { nav } from '../data/nav';
import logoUrl from '../assets/logo.svg';

const linkBase =
  'inline-flex min-h-[44px] items-center px-4 py-3 font-display text-base uppercase ' +
  'tracking-wide focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-brand-red-dark focus-visible:ring-offset-2';

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return `${linkBase} ${isActive ? 'text-brand-red underline' : 'text-ink'}`;
}

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer whenever the route changes (closes on navigation).
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Escape closes the drawer (keyboard-dismissible).
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-deep bg-cream">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2"
        >
          <img src={logoUrl} alt="Smokin' Guns Productions" className="h-12 w-auto" />
          <span className="font-display text-base uppercase tracking-wide text-ink">
            Smokin' Guns Productions
          </span>
        </Link>

        {/* Desktop nav — hidden below md */}
        <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
          {nav.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
          <Button as="link" to="/contact">
            Register
          </Button>
        </nav>

        {/* Mobile hamburger — shown below md */}
        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2 md:hidden"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu aria-hidden="true" />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button
            type="button"
            className="fixed inset-0 z-40 bg-ink/50 motion-safe:transition-opacity motion-reduce:transition-none"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <nav
            aria-label="Primary"
            className="fixed inset-y-0 right-0 z-50 flex w-64 flex-col gap-2 bg-cream p-6 shadow-card"
          >
            <button
              type="button"
              className="mb-2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center self-end p-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            >
              <X aria-hidden="true" />
            </button>
            {nav.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
            <Button as="link" to="/contact">
              Register
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
```

> **`min-h-[44px]` note:** the `≥44px` tap target is the one place an arbitrary value is justified — it encodes the PRD §5 accessibility minimum, not a visual style. Prefer on-scale padding (`p-3`, `px-4 py-3`) to reach 44px; if a control still measures short, `min-h-[44px]`/`min-w-[44px]` is acceptable as an accessibility floor (it's a size guarantee, not a color/spacing/type design value). If the team prefers zero arbitrary values, add a `--spacing-11` (44px) token to `src/index.css` per CONVENTIONS.md §E rather than inline elsewhere. Do **not** use arbitrary values for color, font-size, or decorative spacing.

`src/assets/logo.svg` (marked placeholder — swap with owner's high-fidelity emblem, PRD §10 item 1):

```svg
<!-- PLACEHOLDER logo. TODO(owner-confirm): replace with the high-fidelity crossed-pistols
     "SMOKIN' GUNS PRODUCTIONS" emblem (PRD item 18 / §10 item 1). The supplied asset MUST
     read cleanly on brand-red AND teal grounds (PRD §2). -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Smokin' Guns Productions">
  <rect width="48" height="48" rx="8" fill="#121212" />
  <text x="24" y="30" font-family="serif" font-size="20" fill="#ffffff" text-anchor="middle">SG</text>
</svg>
```

### E.4 Design tokens used

- **Color:** `bg-cream` (header ground), `border-cream-deep` (divider), `text-ink` (nav default), `text-brand-red` (active link), `bg-ink/50` (drawer backdrop — `ink` palette token with opacity), and `brand-red`/`brand-red-dark` inherited from the `Button` primitive
- **Font family:** `font-display` (nav + lockup, `uppercase tracking-wide`)
- **Type size:** `text-base`
- **Spacing:** `px-4` (16px), `py-3` (12px), `gap-2`/`gap-3` (8/12px), `p-6` (24px) — approved scale; `min-h-[44px]`/`min-w-[44px]` as the documented a11y tap-target floor
- **Radius/shadow:** `shadow-card` on the drawer; (`rounded-md` inherited from `Button`)
- **Motion:** `motion-safe:transition-opacity` + `motion-reduce:transition-none`

### E.5 Interactions / behavior

- **Drawer state:** a single `drawerOpen` boolean (`useState`). Hamburger sets it true; close button / backdrop / `Escape` set it false; a `useEffect` on `pathname` resets it false on navigation (closes on navigation, AC #7).
- **Active link:** `NavLink` computes `isActive`; the `end` prop on the Home link (`/`) prevents it staying active on every route.
- **No autoplay/heavy motion;** only a reduced-motion-safe opacity transition on the backdrop.

### E.6 Responsive behavior

- **Mobile (≤640px) / tablet below `md`:** horizontal nav hidden; hamburger shown; drawer slides/fades in from the right as a `w-64` panel with the same links + CTA, full-height.
- **Desktop (`md` and up, >1024px inclusive):** horizontal nav + inline Register CTA shown; hamburger hidden.
- The header bar stays sticky and full-bleed at every breakpoint; inner content capped at `max-w-6xl`.

### E.7 Accessibility

- Semantic `<header>` landmark; `<nav aria-label="Primary">` for both desktop and drawer nav.
- The header introduces **no `<h1>`** — pages own their single `<h1>` (PRD §7 heading rule preserved).
- Hamburger is a real `<button>` with `aria-label`, `aria-expanded`, and `aria-controls` pointing at the drawer.
- Drawer is `role="dialog"` `aria-modal="true"` with an accessible label; `Escape` closes it; close affordance present.
- Visible `focus-visible` ring (palette token) on every link, the hamburger, and the close button; tap targets ≥44px.
- Logo `<img>` has descriptive `alt="Smokin' Guns Productions"`; the redundant text lockup may use `aria-hidden` if the team prefers a single accessible name (builder's call — keep one accessible name for the link).

---

## F. Testing Strategy (required — Tier: light)

Smoke test that the header renders, the nav comes from data, and the drawer opens/closes. Create `src/components/Header.test.tsx`; render inside a `MemoryRouter` (the header uses `NavLink`/`useLocation`). Use `@testing-library/user-event`. Concrete tests:

- Renders a `<header>` with a link to `/` (the logo) and a "Register" link whose `href` is `/contact`.
- All six `nav.ts` labels render (e.g. "Home", "Events", "Results & Standings", "Sponsors").
- **Drawer opens/closes:** below `md` the "Open menu" button is present; clicking it reveals the dialog (`role="dialog"`) containing the nav + a Register link; clicking "Close menu" hides the dialog. (Assert the dialog appears then is removed.)
- **Active state:** rendering at path `/events` (set the `MemoryRouter` `initialEntries`) gives the Events `NavLink` `aria-current="page"` (NavLink sets this) while Home does not.

**Manual check (all tiers):**
1. `npm run dev`; confirm the header is sticky on scroll on a long page.
2. Resize below 640px → hamburger appears; open the drawer, tab through the links (visible focus ring), press `Escape` → drawer closes.
3. Click a drawer link → drawer closes and the route changes; the active link shows the active style.
4. Confirm the Register CTA is solid `brand-red` and routes to `/contact` on every page.
5. Measure the hamburger and links in dev tools → ≥44px tap targets.

---

## G. Definition of Done (required)

- [ ] Sticky header on `bg-cream`; logo links Home; nav rendered from `nav.ts` (no hardcoded list).
- [ ] Active-page state on the current `NavLink`; exactly one active per page.
- [ ] Persistent `brand-red` Register `Button` → `/contact` in both desktop bar and mobile drawer (single CTA color).
- [ ] Mobile hamburger toggles a drawer with the same nav + CTA; closes on navigation and on `Escape`; no dead "More" menu.
- [ ] Tap targets ≥44px; keyboard-navigable with visible focus; drawer is `role="dialog"`/`aria-modal`.
- [ ] Motion behind `motion-safe:`/`motion-reduce:`.
- [ ] Only design-system tokens (no hardcoded color/spacing/font-size; `min-h-[44px]` allowed only as the documented a11y tap floor).
- [ ] Story-2 placeholder `Header` fully replaced; reuses shared `Button` + `nav.ts`.
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `Button` (story 3), `nav.ts` (story 1), the `HelmetProvider`/router shell (story 2). Packages `react-router-dom` and `lucide-react` already installed.
- **Blockers:** None identified. The high-fidelity crossed-pistols logo is owner-pending (PRD §10 item 1) — shipped as a marked placeholder `src/assets/logo.svg` (with a text lockup fallback) and swapped in without code changes; the asset must read on brand-red and teal grounds per PRD §2.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #7, §E #8)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §B, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§3, §5, §9; discard item 2; preserve item 18; §10 item 1)
- Related components this depends on: `Button` (3), `nav.ts` (1), App shell (2); consumed on every page.
