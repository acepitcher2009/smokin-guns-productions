# Whole-Site Verification Report — Template

> Template for the `verifier` subagent's output, saved to `ai-docs/verification/<site>-verification.md`. The verifier runs ONCE at the end of the build, across the whole assembled site. Its job is to confirm a collection of correct components is one coherent, professional, accessible site — and to map every PRD acceptance criterion to pass/fail with evidence.
>
> This template is a guide. Sections marked **required** are non-negotiable. The verifier does not silently fix production code beyond what the report documents; issues it finds are routed back (by the orchestrator) to the `component-builder` for the owning component, or to the `designer` for a design-system gap.

---

## Document Metadata (required)
- PRD path: `<path>`
- Conventions path: `ai-docs/conventions/CONVENTIONS.md`
- Date: `<YYYY-MM-DD>`
- Site name: `<name>`
- Test tier: `<none | light | full>`

---

## A. Build & Type Health (required)

- `npm run build`: PASS | FAIL (details)
- `npm run typecheck`: <N> errors (must be 0)
- Lint / a11y lint: <N> errors / <N> warnings (must be 0 new)

If the build or typecheck fails, the site is not verified — report and route back before anything else.

---

## B. Acceptance Criteria Coverage (required — the core)

A table mapping EVERY acceptance criterion from the PRD (across every section) to pass/fail with evidence. Evidence is a concrete observation (what renders, what the markup shows, what a check confirms) — not "looks fine."

| PRD Section | Acceptance Criterion | Pass/Fail | Evidence |
|---|---|---|---|
| Hero | Full-bleed ~85vh with gradient overlay, headline, 2 CTAs | ✓ | Renders full-height; `.text-primary` CTA + outline CTA present in `Hero.tsx` |
| Events | Jackpot events show gold badge | ✓ | `EventCard` renders `--color-gold` badge when `isJackpot` |
| ... | ... | ... | ... |

Every criterion must appear. A failing criterion is routed back to the owning component.

---

## C. Visual Coherence (required — the anti-drift whole-site check)

This is the section that turns correct components into a coherent site. Check:

- **Spacing rhythm** — consistent vertical rhythm between sections (sections use the spacing scale consistently, not ad-hoc gaps)
- **Component-pattern consistency** — repeated elements (buttons, cards, headings) use the same shared patterns, not one-off variants
- **Single primary CTA color** — the PRD's one primary CTA color is used consistently for primary actions; secondary actions are visually distinct and consistent
- **No design-system bypasses** — no component uses hardcoded color/spacing/size that escapes the `@theme` tokens. (Spot-check the built components; flag any arbitrary `[...]` Tailwind values or raw hex.)

Report any inconsistency with the component(s) it appears in, so it can be routed back.

---

## D. Responsive Behavior (required)

Verify the site at mobile / tablet / desktop widths:

- **Mobile (<640px)** — layouts stack correctly, nav collapses to the mobile pattern, no horizontal scroll, tap targets adequate
- **Tablet (640–1024px)** — layouts hold, no overflow
- **Desktop (>1024px)** — intended multi-column layouts render, hero/sections sized per the PRD
- **No horizontal scroll at any width** — explicitly confirmed

Report any breakpoint where a layout breaks, with the component responsible.

---

## E. Accessibility (required — against the PRD's stated standard)

Verify against the standard the PRD specifies (e.g. WCAG 2.1 AA):

- **Heading hierarchy** — exactly one `<h1>`, no skipped levels (h1→h2→h3)
- **Semantic structure** — `header`/`nav`/`main`/`section`/`footer` used appropriately
- **Color contrast** — text/background combinations meet the standard (flag any that don't, especially the primary color on its backgrounds)
- **Keyboard operability** — interactive elements are reachable and operable; visible focus states
- **Forms** — inputs have associated labels; error messaging is accessible
- **Images** — meaningful alt text, or `alt=""` for decorative
- **Reduced motion** — if the site animates, `prefers-reduced-motion` is respected

Report any failure with the owning component.

---

## F. Test Tier Gate (required)

Confirm the gate for the chosen tier:

- **none** — no automated tests expected; this section confirms build + typecheck + a11y + AC checklist are the verification, and they pass.
- **light** — all smoke tests pass (each component renders without crashing; key interactions work). List them.
- **full** — the full test suite passes at 100%, and total line coverage on the built components is ≥ 80%. Report the number; document any exclusions with `file:line` and justification.

---

## G. Findings & Routing (required — may be "None")

A consolidated list of every issue found, each tagged with where it routes:

- **→ component-builder (<Component>)** — a coherence/responsive/a11y issue or failing AC that traces to one component
- **→ designer** — a design-system gap (a token the PRD needs but the system lacks)

For each: the finding, the evidence, and the recommended fix. If everything passed, "None — all checks pass."

---

## H. Verification Summary (required)

```
Acceptance criteria: <N>/<N> pass
Build: <pass/fail> | Typecheck: <N> errors | Lint: <N> errors
Visual coherence: <pass / issues count>
Responsive: mobile/tablet/desktop <pass / issues>
Accessibility (<standard>): <pass / issues>
Test tier (<tier>): <satisfied / detail>
Findings routed back: <N> (to component-builder: <N>, to designer: <N>)
```
