# Component Build Story — App (router shell)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #1; §E Build Order #2)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `App` (router shell)
- Build-order position: `2`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need every page to live at its own clean URL with a persistent header, footer, and consent notice around it, so that I can navigate a real multi-page site (replacing the single-page GoDaddy stack and dead "More" menu) and so each page can set its own meta for SEO.

---

## B. Background / Context (required)

This is build-order step 2 — the application shell that replaces the scaffold's default `src/App.tsx`. Per PRD §3 (multi-page IA, clean URLs) and plan §C #1, `App` owns the route table mapping the six clean URLs to page components, wraps the tree in `HelmetProvider` (so `Seo` in story 5 can set per-page head), and renders the persistent `Header` / `Footer` / `ConsentNotice` shell. It consumes `nav.ts` paths from story 1 (data files). `Header`, `Footer`, `ConsentNotice`, and the page components are built in **later** stories — this story stands up the shell with lightweight placeholders so routing and the provider are correct and testable now.

---

## C. Acceptance Criteria (required)

1. All six routes resolve at their clean URLs: `/` (Home), `/events` (Events), `/results` (Results), `/about` (About), `/sponsors` (Sponsors), `/contact` (Contact) — paths match `nav.ts` exactly.
2. An unknown route (e.g. `/nope`) renders a minimal 404 that routes the user back to Home (redirect to `/`, or a 404 element with a link to `/`).
3. The tree is wrapped in `HelmetProvider` so descendant pages can manage `<head>` (story 5).
4. `BrowserRouter` provides client-side routing; the persistent shell (Header / `<main>` outlet / Footer / ConsentNotice) stays mounted across navigation — only the routed content swaps.
5. On every route change the window scrolls to top (scroll-to-top behavior).
6. The shell sets the base `bg-cream text-ink font-sans` on the app root (CONVENTIONS.md / plan §C #1) and `<main>` is the single landmark wrapping the routed page.
7. The scaffold demo `App` is fully replaced — no `useState` counter, no React/Vite logos, no `reactLogo`/`viteLogo`/`heroImg` demo imports remain.
8. **Token-cleanliness:** the only classes used are `bg-cream`, `text-ink`, `font-sans` (and layout utilities `min-h-screen`, `flex`, `flex-col`, `flex-1`) — no hardcoded color/spacing/font-size values.
9. `npm run typecheck` passes; `npm run build` emits the app; `npm run lint` passes.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§D File Organization** — `App.tsx` owns the route table (path → page component) and the persistent Header/Footer shell; page components live one-per-route in `src/pages/`; reusable shell components in `src/components/`.
- **§C Component Structure** — functional components, typed props, **named exports** for components (`export function ScrollToTop()`), one component per file. Note: `src/main.tsx`'s existing **default** `App` import is the one pre-scaffolded exception and may stay — so `App` keeps its `export default`.
- **§E Token Consumption** — base shell uses only `bg-cream text-ink font-sans`; no hardcoded values.
- **§B Code Style** — single quotes, semicolons, relative imports, import groups (external `react-router-dom`/`react-helmet-async` → internal `./components`, `./pages`, `./data/nav`).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/App.tsx` | modify (replace scaffold) | Route table + HelmetProvider + persistent shell + scroll-to-top |
| `src/components/Header.tsx` | create (placeholder) | Minimal nav placeholder; replaced fully in story 8 |
| `src/components/Footer.tsx` | create (placeholder) | Minimal footer placeholder; replaced fully in story 9 |
| `src/components/ConsentNotice.tsx` | create (placeholder) | Minimal placeholder; replaced fully in story 10 |
| `src/components/ScrollToTop.tsx` | create | Scrolls to top on `pathname` change |
| `src/pages/Home.tsx` | create (placeholder) | Stub page; composed fully in a later story |
| `src/pages/Events.tsx` | create (placeholder) | Stub page |
| `src/pages/Results.tsx` | create (placeholder) | Stub page |
| `src/pages/About.tsx` | create (placeholder) | Stub page |
| `src/pages/Sponsors.tsx` | create (placeholder) | Stub page |
| `src/pages/Contact.tsx` | create (placeholder) | Stub page |

> Placeholders keep this story self-contained and testable. Each placeholder page is a single semantic `<h1>` so routing is verifiable; later stories replace the bodies. Build the placeholder `Header`/`Footer`/`ConsentNotice` minimal (a `<header>`/`<footer>` with nav links from `nav.ts`) — stories 8–10 own their real implementation.

### E.2 Component example

`src/components/ScrollToTop.tsx`:

```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
```

`src/App.tsx` (the deliverable — replaces the scaffold):

```tsx
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ConsentNotice } from './components/ConsentNotice';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ScrollToTop } from './components/ScrollToTop';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { Results } from './pages/Results';
import { Sponsors } from './pages/Sponsors';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col bg-cream font-sans text-ink">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/results" element={<Results />} />
              <Route path="/about" element={<About />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ConsentNotice />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
```

Placeholder page (each of the six, body swapped later), e.g. `src/pages/Home.tsx`:

```tsx
export function Home() {
  return <h1 className="font-display text-5xl uppercase tracking-wide text-ink">Home</h1>;
}
```

Placeholder `src/components/Header.tsx` (real version in story 8) — links from `nav.ts`:

```tsx
import { NavLink } from 'react-router-dom';

import { nav } from '../data/nav';

export function Header() {
  return (
    <header className="bg-cream">
      <nav className="flex gap-4 p-4">
        {nav.map((item) => (
          <NavLink key={item.path} to={item.path} className="font-display text-ink">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
```

(`Footer` and `ConsentNotice` placeholders are analogous minimal `<footer>` / dismissible `<div>` stubs; their full specs are stories 9 and 10.)

### E.4 Design tokens used

- **Color:** `bg-cream`, `text-ink`
- **Font family:** `font-sans` (base), `font-display` (placeholder headings)
- **Type size:** `text-5xl` (placeholder `<h1>`)
- Layout utilities only beyond tokens: `min-h-screen`, `flex`, `flex-col`, `flex-1`, `gap-4`, `p-4` (spacing keys on the approved scale)

### E.5 Interactions / behavior

- Client-side routing via `BrowserRouter` + `Routes`.
- `ScrollToTop` listens to `useLocation().pathname` and scrolls to `(0,0)` on change. No animation, so no `prefers-reduced-motion` concern.
- Unknown routes `Navigate` to `/` with `replace` (no history entry).

### E.6 Responsive behavior

The shell is layout-only (`flex flex-col min-h-screen`) so the footer sits at the bottom on short pages at every breakpoint. Responsive nav (hamburger drawer) is the Header's responsibility (story 8), not this shell.

### E.7 Accessibility

- Exactly one `<main>` landmark wraps the routed outlet; `<header>` and `<footer>` are landmarks provided by the placeholder shell components.
- Each placeholder page renders exactly one `<h1>` so the one-h1-per-page rule holds from the start (PRD §7).
- No focus traps; routing preserves keyboard navigation.

---

## F. Testing Strategy (required — Tier: light)

Smoke test that routes resolve and the shell persists. Create `src/App.test.tsx` using Testing Library; render `App` inside the app's own `BrowserRouter` is already present, so use `window.history.pushState` to set the path before render, or extract a `RoutedApp` if needed. Concrete tests:

- Rendering at `/` shows the Home placeholder `<h1>` (text "Home").
- Navigating to `/events` (push path, render) shows the Events `<h1>`.
- An unknown path (`/does-not-exist`) lands on Home (`<h1>` "Home") — 404 redirect works.
- The `<main>` landmark and the placeholder `<header>` nav are present on every route (shell persists).

(If wrapping in a second Router conflicts, the builder may export the inner tree without `BrowserRouter` for testability and keep `BrowserRouter` in the default `App` — a common, acceptable pattern.)

**Manual check (all tiers):**
1. `npm run dev`; visit `/`, `/events`, `/results`, `/about`, `/sponsors`, `/contact` — each renders its page; header/footer persist.
2. Click between pages — the page scrolls to top on each change.
3. Visit `/garbage` — lands on Home.
4. Confirm no React/Vite logos or counter remain.

---

## G. Definition of Done (required)

- [ ] All six clean routes resolve; unknown route → Home.
- [ ] `HelmetProvider` wraps the tree (head-management available to pages).
- [ ] Persistent Header / `<main>` outlet / Footer / ConsentNotice shell; only routed content swaps.
- [ ] Scroll-to-top on route change.
- [ ] Base `bg-cream text-ink font-sans` on the shell; only design-system tokens + layout utilities (no hardcoded values).
- [ ] Scaffold demo fully removed.
- [ ] TypeScript zero new errors; lint passes; `npm run build` succeeds.
- [ ] Light smoke test present and passing.

---

## H. Dependencies & Blockers (required)

- **Depends on:** story 1 `nav.ts` (route paths must match nav). Feature packages `react-router-dom` and `react-helmet-async` are already installed.
- **Blockers:** None identified. `Header`, `Footer`, `ConsentNotice`, and the six pages are stood up as minimal placeholders here and fully implemented in stories 8, 9, 10, and the page-composition stories.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #1, §E #2)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§3, §6)
- Related components this depends on: `nav.ts` (story 1); provides the shell for Header (8), Footer (9), ConsentNotice (10), Seo (5), and all pages.
