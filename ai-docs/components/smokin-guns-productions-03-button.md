# Component Build Story — Button (single brand-red CTA primitive)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #5; §E Build Order #3)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `Button`
- Build-order position: `3`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need every call-to-action to look and behave the same — a single solid brand-red button — so that the primary action (Register / Enter a Race) is always obvious, consistent, and accessible, replacing the weak ghost/outline CTAs of the old site.

---

## B. Background / Context (required)

Build-order step 3. Per PRD §2/§5/§9 and CONVENTIONS.md §A/§E, `brand-red` is the **single** CTA color site-wide — solid, never ghost/outline, and `teal`/`pink` are **never** buttons. This `Button` is the only actionable button/link primitive in the system; every later component (Header Register CTA, EventCard, RegistrationForm submit, Sponsors CTA) uses it rather than inventing its own. It must render either as a native `<button>` or as a router `Link` for internal navigation. No prior story builds a button — this is the canonical one.

---

## C. Acceptance Criteria (required)

1. Renders solid `bg-brand-red text-white`; hover/focus background is `bg-brand-red-dark` (the AA-contrast derived token). No outline/ghost variant exists.
2. There is **exactly one** CTA color — the component exposes **no** `variant`/`color`/`tone` prop for teal/pink/ghost. (A single fixed appearance.)
3. Polymorphic via an `as` prop: `as="button"` (default) renders `<button type="...">`; `as="link"` with a `to` renders a router `<Link>`; `as="a"` with an `href` renders an `<a>` (for `tel:`/`mailto:`/external).
4. Tap target ≥ 44px: padding `px-6 py-3` plus `text-base` yields ≥44px height; add `min-h-[...]`? — no: use the spacing scale only; `py-3` (12px) + line-height + `text-base` clears 44px. Builder must verify rendered height ≥44px and, if short, increase to `py-4`-equivalent using an on-scale key (`py-4` is 16px → on scale). Do **not** use arbitrary px.
5. Visible focus state: `focus-visible:` ring using a palette token (e.g. `focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2`), keyboard-reachable.
6. `rounded-md` corners (8px card radius token).
7. As a `<button>`, accepts `type` (`'button' | 'submit'`), `onClick`, and `disabled`; disabled state is visually distinct and non-interactive.
8. **Token-cleanliness:** only `bg-brand-red`, `bg-brand-red-dark`, `text-white`, `text-base`, `px-6`, `py-3`, `rounded-md`, and focus-ring palette tokens — no hardcoded hex, no arbitrary spacing, no arbitrary size.
9. Motion (if any hover transition) gated behind `motion-safe:` (CONVENTIONS.md §E).
10. `npm run typecheck` + `npm run lint` pass.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — `brand-red` is the single CTA color; solid not ghost; `teal`/`pink` never a button.
- **§C Component Structure** — functional component, `interface ButtonProps` inline above it, **named export** `export function Button`, no `any`, variants as typed props.
- **§E Token Consumption** — single CTA color rule, no ghost/outline primary, motion behind `motion-safe:`; only `@theme` token classes.
- **§B Code Style** — single quotes, semicolons, import groups.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/Button.tsx` | create | The single brand-red CTA primitive (button / Link / anchor) |

No composition edit in this story — `Button` is consumed by later components (Header story 8, EventCard, RegistrationForm, etc.). It is not wired into a page directly here.

### E.2 Component example

`src/components/Button.tsx` (mirrors the CONVENTIONS.md §C skeleton — inline props interface, named export, tokens only):

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

const baseClasses =
  'inline-flex items-center justify-center rounded-md bg-brand-red px-6 py-3 text-base ' +
  'font-sans text-white transition-colors hover:bg-brand-red-dark ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark ' +
  'focus-visible:ring-offset-2 motion-reduce:transition-none ' +
  'disabled:opacity-60 disabled:pointer-events-none';

interface ButtonAsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button';
  children: ReactNode;
}

interface ButtonAsLinkProps {
  as: 'link';
  to: string;
  children: ReactNode;
}

interface ButtonAsAnchorProps {
  as: 'a';
  href: string;
  children: ReactNode;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps | ButtonAsAnchorProps;

export function Button(props: ButtonProps) {
  if (props.as === 'link') {
    const { to, children } = props;
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    );
  }

  if (props.as === 'a') {
    const { href, children } = props;
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  const { as: _as, children, type = 'button', ...rest } = props;
  return (
    <button type={type} className={baseClasses} {...rest}>
      {children}
    </button>
  );
}
```

> Note: `transition-colors` paired with `motion-reduce:transition-none` satisfies the reduced-motion rule. Builder must confirm the rendered height is ≥44px; if `py-3` falls short with the chosen line-height, bump to `py-4` (on-scale) — never an arbitrary px value.

### E.4 Design tokens used

- **Color:** `bg-brand-red`, `bg-brand-red-dark` (hover/focus ring), `text-white`
- **Type size:** `text-base`; **font family:** `font-sans`
- **Spacing:** `px-6` (24px), `py-3` (12px) — both on the approved scale
- **Radius:** `rounded-md` (8px)
- **Motion:** `transition-colors` + `motion-reduce:transition-none`

### E.5 Interactions / behavior

- Hover → `bg-brand-red-dark`; keyboard focus → visible focus-visible ring; `disabled` → dimmed, non-interactive.
- As a `Link`, internal client-side navigation; as `<a>`, used for `tel:`/`mailto:`/external.

### E.6 Responsive behavior

Inline-flex, intrinsic width by default. Callers control full-width via a wrapper (`w-full` at a breakpoint) — the primitive stays size-stable. Tap target ≥44px at every breakpoint.

### E.7 Accessibility

- Native `<button>` / `<a>` / router `<Link>` — correct semantics and keyboard behavior for free.
- Visible `focus-visible` ring (PRD §9 focus states).
- ≥44px tap target (PRD §5 mobile).
- Label comes from `children`; for icon-only usages the caller must pass an `aria-label` (allowed via the spread `...rest` on the button variant).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/Button.test.tsx`:

- Renders as a `<button>` by default with its children text and `bg-brand-red` in `className`.
- `onClick` fires on click (use `@testing-library/user-event`).
- `as="link"` with `to="/contact"` renders an anchor with `href="/contact"` (render inside a `MemoryRouter`).
- `as="a"` with `href="tel:8328572826"` renders an anchor with that href.
- `disabled` button does not fire `onClick`.

**Manual check (all tiers):**
1. Drop a `<Button>Register</Button>` on a page; confirm solid red, white text, hover darkens.
2. Tab to it — visible focus ring; Enter activates.
3. Measure rendered height (dev tools) ≥44px.

---

## G. Definition of Done (required)

- [ ] Solid `brand-red`, hover `brand-red-dark`; no ghost/outline/teal/pink variant.
- [ ] Polymorphic `as` (button / link / a) with correct semantics.
- [ ] ≥44px tap target; visible focus-visible ring.
- [ ] Only design-system tokens (no hardcoded color/spacing/size); motion behind `motion-reduce`.
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `react-router-dom` (already installed) for the `Link` variant. No data files.
- **Blockers:** None identified.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #5, §E #3)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§2, §5, §9)
- Related components that depend on this: Header (8), EventCard, RegistrationForm, Sponsors CTA, ResultsPanel, ConsentNotice.
