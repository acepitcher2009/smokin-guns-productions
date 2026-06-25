# Component Build Story — Template

> Template for the `component-writer` subagent's output. One story per component, each a complete blueprint a `component-builder` can implement without referring back to the plan or PRD for clarification.
>
> This template is a guide — include the sections that apply to the component. Sections marked **required** are non-negotiable. The single biggest reason a story fails downstream is **examples that don't match the established conventions or use values outside the design system**. Prevent that by reading `CONVENTIONS.md` and the `@theme` tokens before writing any example.

---

## Front Matter (required)
- Source plan: `ai-docs/components/<site>-plan.md`
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/<site>.md`
- Component: `<Name>`
- Build-order position: `<N>`
- Test tier: `<none | light | full>`  ← set by the orchestrator's up-front prompt

---

## A. Story Summary (required)

"As a [visitor/owner], I need [this component], so that [benefit]." Match the value to the PRD's framing of that section.

---

## B. Background / Context (required)

2–3 sentences linking this component to the plan entry and the PRD section, plus any prior components it depends on (e.g. "uses the shared Button built in story 1").

---

## C. Acceptance Criteria (required)

**Expanded** beyond the plan — more detail, more testable. The plan says "event cards show a badge"; the story says:

- Each card renders name, date, venue, address, and the AM/PM time breakdown
- Jackpot events render a `--color-gold` badge labelled "Jackpot"; series events render the default badge
- On mobile (<640px) cards stack single-column; at ≥1024px they sit in a 2-col grid
- Card uses only design-system tokens (no hardcoded color/spacing/size)

---

## D. Conventions Reference (required)

Explicit pointers to the established conventions the builder must follow. This is what makes the build phase reliable. Example:

> Follow `ai-docs/conventions/CONVENTIONS.md`:
> - **Component structure** § — functional component, typed props, default export, the canonical skeleton
> - **File organization** § — component at `src/components/Events.tsx`; data at `src/data/events.ts`
> - **Token consumption** § — only `@theme` tokens; no hardcoded values

---

## E. Technical Implementation Details (required)

**E.1 Files to create / modify** — table: every file, action (create/modify), one-sentence purpose. Includes the component file, any data file, and the composition edit (wiring into `src/App.tsx` in the right position).

**E.2 Component example** — a TypeScript-typed example that mirrors the canonical skeleton in `CONVENTIONS.md` and uses real `@theme` tokens via Tailwind classes. Not a generic tutorial component — it must look like it belongs in this project, and it must not contain hardcoded style values.

**E.3 Data file** — only if applicable. The exported data and its TypeScript type, with the real seed content from the PRD (e.g. the actual events, the actual hours).

**E.4 Design tokens used** — the named tokens this component consumes (color/spacing/type/radius/shadow), so the builder draws only from the system.

**E.5 Interactions / behavior** — only if applicable. State, scroll behavior, form handling, animation. If animation, note `prefers-reduced-motion` handling.

**E.6 Responsive behavior** — how the layout adapts at mobile / tablet / desktop, drawn from the PRD's responsive requirements.

**E.7 Accessibility** — semantic element choice, heading level (so the page keeps one h1 and no skipped levels), alt text, labelled inputs, focus states — drawn from the PRD's stated a11y standard.

---

## F. Testing Strategy (required — scales with test tier)

Match the tier set in the front matter:

- **none** — no test files. Verification is build + typecheck + renders + a11y lint + the acceptance criteria above. State: "Tier: none — no automated tests; verified by build/render/a11y and AC checklist."
- **light** — a smoke test: the component renders without crashing, and any key interaction works (e.g. the form validates, the nav scrolls). Concrete descriptions, not "test the component."
- **full** — unit/integration tests covering the acceptance criteria and the component's logic, targeting the 80% coverage gate. Concrete test descriptions, matching whatever test setup the build uses.

Manual check (all tiers): numbered steps a human follows to verify the component in the running app.

---

## G. Definition of Done (required)

Checklist. At minimum:

- All acceptance criteria met
- Component uses only design-system tokens (no hardcoded values)
- Wired into the page in the correct position
- TypeScript: zero new errors
- Passes accessibility lint
- Tests present and passing per tier (none → none; light → smoke; full → unit/integration ≥ 80%)
- Renders correctly at mobile / tablet / desktop

> Build of the whole site and whole-site verification happen later (the `verifier` pass). Per-component DoD ends at the component being correct, token-clean, wired in, and tier-appropriate tests passing.

---

## H. Dependencies & Blockers (required — may be "None")

- **Depends on**: prior components (e.g. shared Button) or a feature package (e.g. `@emailjs/browser`, which must already be installed)
- **Blockers**: anything preventing autonomous completion (e.g. "needs a design decision the plan left open", "needs the logo asset the client hasn't supplied — use a marked placeholder"). If none, "None identified."

---

## I. References (required)

- Source plan: `<path>`
- Conventions: `<path>`
- PRD: `<path>`
- Related components this depends on: `<list>`
