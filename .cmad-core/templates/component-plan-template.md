# Component Plan — Template

> Template for the `decomposer` subagent's output. The decomposer produces TWO things from this template:
> 1. **The component plan** at `ai-docs/components/<site>-plan.md` — one entry per section/component, in build order (sections below).
> 2. **`DEPENDENCIES.md`** at the project root — the feature packages this PRD requires, with a single install command (section F below).
>
> This template is a guide. Adapt to the PRD, but the sections marked **required** are non-negotiable. The plan is the contract the `component-writer` turns into build stories, so every component must trace to the PRD and align with the design system the `designer` established.

---

## Document Metadata (required)
- PRD path: `<path>`
- Conventions path: `ai-docs/conventions/CONVENTIONS.md`
- Date: `<YYYY-MM-DD>`
- Business / site name: `<name>`
- Business-type profile (if from prd-builder): `<local-service | contractor | general-local | n/a>`

---

## A. Site Overview (required)

2–3 sentences: what the site is, its primary conversion goal (from the PRD / business-type profile), and the overall page structure (single-page scroll vs multi-page).

---

## B. PRD Traceability (required)

A table mapping every PRD section/requirement to the component(s) that will implement it. Every PRD section must appear. This is the bridge between "what the PRD specifies" and "what gets built."

| PRD Section | Component(s) | Notes |
|---|---|---|
| Hero | Hero | |
| Events | Events + EventCard + events data file | |
| ... | ... | ... |

If a PRD section needs multiple components, list them all. If two PRD sections collapse into one component, document the merge in Notes. Nothing in the PRD's per-section requirements may be left unmapped.

---

## C. Component Inventory (required)

The full list of components to build. For EACH component, an entry with:

- **Name** — PascalCase, matching the conventions
- **PRD source** — the section it traces to (anchor link into the PRD if possible)
- **Responsibilities** — what it renders and does, in specifics (not "shows the hero" but "full-bleed hero with headline, tagline, two CTAs, scroll indicator")
- **Data needs** — what content it displays, and whether that content belongs in an editable **data file** (content that varies — events, services, sponsors, hours, nav items — must be a data file, not hardcoded). Name the data file and its shape.
- **Design tokens** — which token groups it consumes (so the builder knows the palette/scale it draws from)
- **Acceptance criteria** — drawn from the PRD's requirements for that section, specific and testable
- **Interactions / behavior** — any state, scroll, form, or animation behavior
- **Dependencies** — on other components (e.g. needs the shared Button) or on a feature package (e.g. the contact form needs the email library)

---

## D. Editable Data Files (required — may be "None")

A consolidated list of the data files the build will create, separating content from markup so the site owner can update it without touching layout. For each:

- File path (e.g. `src/data/events.ts`)
- What it holds
- Its exported type

If the site has no varying content, write "None — all content is static within components."

---

## E. Build Order (required)

The ordered sequence of components to build, structured to minimize rework. Structural/shared pieces first (design-system-consuming primitives, layout, header/footer), then sections that depend on them, then composition. Each entry:

- Position number
- Component name
- One-line scope
- Why it's in this position (what it depends on)

A component is sized so a single `component-builder` invocation can complete it. If a "component" would sprawl across many concerns, split it (e.g. Events section → Events container + EventCard).

---

## F. Feature Dependencies → `DEPENDENCIES.md` (required)

The feature packages this PRD requires, written to `DEPENDENCIES.md` at the project root. For each:

- Package name
- One-line justification tied to a specific PRD requirement
- (Group them into a single install command)

**Do not list infrastructure already installed by the scaffold**: Vite, React, TypeScript, Tailwind, Prettier. Only list *feature* packages the PRD's requirements call for (e.g. an email/form library, an icon set, an animation library).

`DEPENDENCIES.md` ends with one ready-to-run command, e.g.:

```
npm install @emailjs/browser lucide-react react-hook-form
```

If the PRD requires no feature packages beyond infrastructure, `DEPENDENCIES.md` says so explicitly and the install command is omitted.

---

## G. Gaps & Open Questions (required — may be empty)

Decisions the decomposer could not make from PRD + conventions alone. Format each:

```
- [ ] **<Question>** — **Severity: blocking | non-blocking**
      Context: <why this matters>
      Options: <a>, <b>, <c>
      Recommendation: <default and why>
```

**Blocking** questions must be resolved before stories are written (the orchestrator halts or loops back). **Non-blocking** questions carry into stories as notes.

---

## H. Verification (required)

Confirm before the decomposer declares done:

- [ ] Every PRD section appears in the PRD Traceability table
- [ ] Every component entry has responsibilities, data needs, design tokens, acceptance criteria, and dependencies
- [ ] Varying content is identified as data files, not hardcoded
- [ ] Build order lists structural/shared components before dependents
- [ ] `DEPENDENCIES.md` exists with justified feature packages and a single install command (or states none needed)
- [ ] No infrastructure packages relisted as feature dependencies
- [ ] Gaps & Open Questions section present (may be empty)
- [ ] Sources cited (PRD + conventions)
