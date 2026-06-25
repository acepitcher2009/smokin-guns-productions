# Feature Dependencies — Smokin' Guns Productions LLC

Feature packages this PRD requires, each justified against a specific PRD requirement.
Infrastructure already installed by the scaffold is **not** listed here.

> **Already scaffolded (do NOT reinstall):** Vite, React, React-DOM, TypeScript, Tailwind,
> `@tailwindcss/vite`, oxlint, prettier.
>
> **Self-hosted fonts are an asset task, not an npm dependency.** Per CONVENTIONS.md §G,
> drop `roboto-slab-700.woff2`, `roboto-slab-800.woff2`, `inter-400.woff2`, `inter-600.woff2`,
> `inter-700.woff2` into `src/assets/fonts/`. The `@font-face` rules in `src/index.css` already
> reference these filenames; no font npm package ships at runtime.

---

## Runtime (feature) dependencies

| Package | PRD requirement |
|---|---|
| `react-router-dom` | §3 / §6 — multi-page site with **clean per-page URLs** (`/events`, `/results`, `/about`, `/sponsors`, `/contact`, `/`). Maps each path to a page component. |
| `react-helmet-async` | §7 — **per-page unique meta titles/descriptions, canonical URLs, Open Graph + Twitter cards, and JSON-LD injection** managed per route in an SPA. (See note on the React 19 native option below.) |
| `@emailjs/browser` | §6 / §4.6 — the Contact / **registration form** posts via **EmailJS** (a static-friendly handler); keys read from `VITE_*` env vars. |
| `lucide-react` | §5 / §4 — icon set for nav, CTAs, the mobile hamburger, and the **add-to-calendar** affordance, matching the rodeo/Western brand voice. Tree-shakeable (CWV §6). |
| `ics` | §4.2 — generates the per-event **`.ics` add-to-calendar** file (the analysis gap "no add-to-calendar"). |

**Note — head manager choice:** React 19 natively hoists `<title>`/`<meta>`/`<link>` tags rendered in
components, which could cover basic per-page meta without a dependency. `react-helmet-async` is chosen
for reliable per-route **canonical** management, OG/Twitter tags, and **JSON-LD** scripts across
client-side navigation. The `Seo`, `BusinessJsonLd`, and `EventJsonLd` components encapsulate this so a
later swap to native React 19 head tags would be a local change.

## Dev dependencies — LIGHT test tier

| Package | Purpose |
|---|---|
| `vitest` | Test runner (Vite-native). |
| `@testing-library/react` | Render + query React components in tests. |
| `@testing-library/jest-dom` | DOM matchers (`toBeInTheDocument`, etc.). |
| `@testing-library/user-event` | User-interaction simulation (form, drawer, filter). |
| `jsdom` | DOM environment for vitest. |

---

## Install command

```
npm install react-router-dom react-helmet-async @emailjs/browser lucide-react ics
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
