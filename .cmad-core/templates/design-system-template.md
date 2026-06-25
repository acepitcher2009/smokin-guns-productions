# Design System & Conventions — Template

> Template for the `designer` subagent's output. The designer produces TWO things from this template:
> 1. **`CONVENTIONS.md`** in `ai-docs/conventions/` — the code conventions every component follows (sections A–F below).
> 2. **The design system as Tailwind v4 `@theme` tokens** written into `src/index.css` (section G below describes what must be present there).
>
> This template is a guide. Adapt to the PRD, but the sections marked **required** are non-negotiable. The design system is the single source of truth for the whole build — every component conforms to it, so precision here determines whether the site looks professional and consistent on every build.

---

## Document Metadata
- PRD path: `<path>`
- Date: `<YYYY-MM-DD>`
- Business / site name: `<name>`
- Business-type profile (if from prd-builder): `<local-service | contractor | general-local | n/a>`

---

## A. Design Token Source (required)

A table mapping every design decision to its origin in the PRD. Every token in section G must trace to a row here.

| Token group | PRD source | Value(s) chosen |
|---|---|---|
| Primary color | PRD Brand § <ref> | `#......` |
| ... | ... | ... |

If the PRD specifies a value, use it exactly. If the PRD is silent on something the build needs, choose a sensible value and record it in section F (Designer-chosen defaults) — never invent silently.

---

## B. Code Style (required)

Document the conventions every component file will follow. These are *established*, not discovered (this is greenfield — there is no existing code to read). Be specific enough that two different component builds would look like the same author wrote them.

- **Formatting**: semicolons, quote style, line width (align with the Prettier config the scaffold installed: single quotes, semicolons, 100-char width — state it explicitly)
- **Indentation**: spaces, width
- **Import style**: relative vs alias, ordering (external → internal → styles)

---

## C. Component Structure (required)

The exact shape every component file takes, so components are uniform. Specify:

- One component per file; file naming (e.g. PascalCase `Hero.tsx`)
- Functional components with typed props; default export vs named export — pick one and state it
- Where the component's types live (inline `interface Props` above the component, or a shared types file)
- Props typing rule: **no `any`**; every prop typed
- How children/variants are handled if applicable
- A canonical skeleton example a builder can copy:

```tsx
// Example skeleton — the shape every component follows
interface HeroProps {
  // typed props, no any
}

export function Hero({ ... }: HeroProps) {
  return (
    // markup using ONLY design-system tokens via Tailwind classes
  );
}
```

---

## D. File Organization (required)

How `src/` is laid out for this build. Specify:

- Where components live (e.g. `src/components/`)
- Where section components vs shared/UI components live, if distinguished
- Where editable **data files** live (e.g. `src/data/`) — content that varies (events, services, sponsors, hours, nav items) is separated from markup so the owner can edit it without touching layout
- Where the page is composed (e.g. `src/App.tsx` imports and orders the sections)
- Naming for data files and their exported types

---

## E. Token Consumption Rules (required — this is the anti-drift core)

How components consume the design system. This section is what prevents visual drift across components.

- Components use **only** Tailwind classes that map to `@theme` tokens for color, spacing, typography, radius, and shadow.
- **No hardcoded values**: no raw hex colors (`text-[#e31914]`), no arbitrary pixel sizes (`text-[42px]`), no off-scale spacing (`mt-[37px]`). If a needed value isn't in the system, the system is extended (a new token added) — a one-off is never hardcoded.
- State the approved class families (e.g. text colors come from the palette tokens; spacing from the spacing scale; type sizes from the type scale).
- Give a ✅/❌ example so the rule is unambiguous:

```
✅  <p className="text-primary text-lg mt-6">   (tokens)
❌  <p className="text-[#E31914] text-[19px] mt-[26px]">   (hardcoded — drift)
```

---

## F. Designer-Chosen Defaults (required — may be empty)

Every value the build needs that the PRD did **not** specify, listed explicitly so nothing is invented silently. If the PRD fully specified the system, write "None — all values traced to the PRD." Otherwise:

- `<token>`: chosen `<value>` because `<reason>` (PRD was silent on this)

---

## G. The Design System in `@theme` (required — written to `src/index.css`)

This section documents what the designer writes into `src/index.css` under `@theme`. The CSS retains `@import "tailwindcss";` at the top, then a populated `@theme` block. Every token below that the PRD calls for must be present.

Document (and implement in the CSS):

- **Colors** — every palette color as a named token (`--color-primary`, `--color-ink`, `--color-bg`, accents, etc.). Include hover/dark variants if the PRD specifies them.
- **Typography** — font families (`--font-display`, `--font-sans`, etc.) and a full type scale (`--text-xs` … `--text-6xl` or the PRD's scale) with line-heights.
- **Spacing** — the spacing scale if the PRD defines one beyond Tailwind defaults.
- **Radii** — border-radius tokens.
- **Shadows** — shadow tokens.

Include the literal CSS block the designer wrote, e.g.:

```css
@import "tailwindcss";

@theme {
  --color-primary: #E31914;
  --color-primary-dark: #A8120F;
  --color-ink: #1A1A1A;
  --color-bg: #F7F4EF;
  --font-display: "Oswald", sans-serif;
  --font-sans: "Inter", sans-serif;
  /* ...full system... */
}
```

---

## H. Verification (required)

Confirm before the designer declares done:

- [ ] `src/index.css` retains `@import "tailwindcss";` and contains a populated `@theme` block
- [ ] Every PRD palette color, plus type scale, fonts, spacing, radii, and shadows the PRD specifies, are present as tokens
- [ ] No token contradicts a PRD-specified value
- [ ] Every token traces to a row in section A, or is listed in section F as a designer-chosen default
- [ ] `npm run typecheck` passes and the CSS compiles (a build or dev start succeeds)
- [ ] Token consumption rules (section E) are stated with a ✅/❌ example
