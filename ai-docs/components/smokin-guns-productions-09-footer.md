# Component Build Story — Footer (NAP, hours, nav repeat, dynamic year, owned policy)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #8; §E Build Order #9)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `Footer`
- Build-order position: `9`
- Test tier: `light`

---

## A. Story Summary (required)

As a visitor, I need a footer that gives me the exact business name/address/phone/email/hours, repeats the navigation, and shows an owned privacy link and the current copyright year, so that I can find and contact the business from any page — with no leftover GoDaddy branding or stale "© 2025."

---

## B. Background / Context (required)

This is build-order step 9 and the first **real** implementation of the shell `Footer` placeholder from story 2. Per PRD §3 / §9 and plan §C #8, the footer renders the primary NAP inside a semantic `<address>` (sourced from `businessInfo.ts`, story 1), the hours, `tel:`/`mailto:` links, the repeated nav from `nav.ts` (story 1, the single nav source), a dynamic copyright year (`new Date().getFullYear()` — fixes the stale "© 2025", discard item 4), and an owned privacy/consent link. It carries **zero GoDaddy strings** (discard items 1, 8). It reuses `nav.ts` and `businessInfo.ts` rather than hardcoding any address, phone, or link list, keeping NAP character-for-character consistent with the Header, Contact page, and schema.

---

## C. Acceptance Criteria (required)

1. **NAP in `<address>`:** the business name, venue + street address, city/state/zip render inside a single semantic `<address>` element, sourced from `businessInfo.ts` — locality is **Somerville** (authoritative; PRD §7 gate). No hardcoded address string in JSX.
2. **Phone is a `tel:` link:** renders `businessInfo.phone` ("832-857-2826") as an `<a href={businessInfo.phoneHref}>` (`tel:8328572826`).
3. **Email is a `mailto:` link:** renders `businessInfo.email` ("smokingunsproductions@gmail.com") as `<a href={\`mailto:${businessInfo.email}\`}>`.
4. **Hours:** renders all three hours lines from `businessInfo.hours` (`weekdays` "Mon–Fri 9:00am–5:00pm", `weekend` "Sat–Sun closed", `holidays`) — from data, not hardcoded.
5. **Nav repeat:** the six nav links render from `nav.ts` as router `Link`s, in order, matching the Header.
6. **Dynamic copyright year:** a line like `© {new Date().getFullYear()} Smokin' Guns Productions LLC` — the year is computed, never a literal (e.g. for 2026 it reads "© 2026"); the business legal name comes from `businessInfo.legalName`.
7. **Owned privacy/consent link:** a link labelled "Privacy" (or "Privacy & Consent") that surfaces the business's own policy / re-opens the consent notice — **not** a Google/GoDaddy boilerplate link. (Until the `ConsentNotice` re-open hook exists — story 10 — link to a `/privacy` route placeholder or an `#` anchor with a clear `TODO(owner-confirm)`; do not link to a third-party policy.)
8. **Zero GoDaddy strings:** no "Powered by GoDaddy", no `wsimg.com`, no GoDaddy boilerplate anywhere in the footer.
9. **Token-cleanliness:** only design-system tokens — band ground (`bg-brand-red text-white` per plan §C #8, or `bg-ink text-white`; choose `brand-red` to echo the hero/footer band per PRD §2), the approved type scale, spacing keys, and `font-display`/`font-sans`; **no hardcoded color/spacing/font-size**. Phone/email/nav links must keep AA contrast on the chosen ground.
10. `npm run typecheck` + `npm run lint` pass; the story-2 placeholder `Footer` is fully replaced.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — footer is a `brand-red` (or `ink`) band per PRD §2; `text-white` on it must meet AA; no teal/pink used as the band CTA. (The footer has no `brand-red` button; its links are inline text links.)
- **§C Component Structure** — functional component, **named export** `export function Footer`, no `any`, nav/business types imported from `src/data/`.
- **§D File Organization** — component at `src/components/Footer.tsx`; NAP/hours from `src/data/businessInfo.ts`; nav from `src/data/nav.ts`; no hardcoded NAP/nav in JSX (content/markup separation rule).
- **§E Token Consumption** — approved color/type/spacing/family classes only.
- **§B Code Style** — single quotes, semicolons, import groups (external `react-router-dom` → internal `../data/businessInfo`, `../data/nav`).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/Footer.tsx` | modify (replace story-2 placeholder) | Footer band: NAP `<address>`, hours, `tel:`/`mailto:`, nav repeat from `nav.ts`, dynamic year, owned privacy link |

> Composition: `Footer` is already rendered by the shell in `src/App.tsx` (story 2) — **no `App.tsx` edit needed**; replacing the placeholder wires the real footer onto every page.

### E.2 Component example

`src/components/Footer.tsx` (named export, tokens only; reuses `businessInfo` + `nav`):

```tsx
import { Link } from 'react-router-dom';

import { businessInfo } from '../data/businessInfo';
import { nav } from '../data/nav';

const linkClass =
  'font-sans text-base text-white underline-offset-2 hover:underline ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-red text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        {/* NAP + hours */}
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-white">
            {businessInfo.legalName}
          </h2>
          <address className="mt-4 font-sans text-base not-italic text-white">
            {businessInfo.venueName}
            <br />
            {businessInfo.streetAddress}
            <br />
            {businessInfo.city}, {businessInfo.state} {businessInfo.zip}
            <br />
            <a href={businessInfo.phoneHref} className={linkClass}>
              {businessInfo.phone}
            </a>
            <br />
            <a href={`mailto:${businessInfo.email}`} className={linkClass}>
              {businessInfo.email}
            </a>
          </address>
          <p className="mt-4 font-sans text-sm text-white">
            {businessInfo.hours.weekdays}
            <br />
            {businessInfo.hours.weekend}
            <br />
            {businessInfo.hours.holidays}
          </p>
        </div>

        {/* Nav repeat */}
        <nav aria-label="Footer" className="flex flex-col gap-2">
          {nav.map((item) => (
            <Link key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Policy + copyright */}
        <div className="flex flex-col gap-2">
          {/* TODO(owner-confirm): point to the owned privacy statement / re-open ConsentNotice
              (PRD §10 item 14). Never a Google/GoDaddy boilerplate link (discard items 1, 3). */}
          <Link to="/privacy" className={linkClass}>
            Privacy &amp; Consent
          </Link>
          <p className="mt-4 font-sans text-sm text-white">
            © {year} {businessInfo.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

> **`<address>` styling:** `<address>` renders italic by default; `not-italic` (a token-free utility) keeps the NAP upright in `font-sans`. **Dynamic year:** `new Date().getFullYear()` is computed at render — never a literal (fixes discard item 4). **Privacy link:** linking `/privacy` is a placeholder; if story 10 exposes a consent re-open API, the builder may wire a button that re-opens `ConsentNotice` instead — flag the choice. Do not link to any third-party (Google/GoDaddy) policy.

### E.4 Design tokens used

- **Color:** `bg-brand-red`, `text-white` (footer band — AA verified), `focus-visible:ring-white`
- **Font family:** `font-display` (the name lockup, `uppercase tracking-wide`), `font-sans` (NAP, hours, links)
- **Type size:** `text-3xl` (name), `text-base` (NAP/links), `text-sm` (hours, copyright)
- **Spacing:** `px-4` (16px), `py-12` (48px), `gap-2`/`gap-8` (8/32px), `mt-4` (16px) — approved scale
- Layout: `w-full`, `mx-auto`, `max-w-6xl`, `grid`, `md:grid-cols-3`

### E.5 Interactions / behavior

- None beyond links: `tel:`/`mailto:` anchors, router `Link`s for nav + privacy.
- The copyright year is recomputed on each render via `new Date().getFullYear()`.

### E.6 Responsive behavior

- **Mobile (≤640px):** single column — NAP/hours, then nav, then policy/copyright stack vertically.
- **Tablet/desktop (`md` and up):** three-column grid (`md:grid-cols-3`) — NAP/hours · nav · policy/copyright.
- Full-bleed band at every breakpoint; inner content capped at `max-w-6xl`.

### E.7 Accessibility

- Semantic `<footer>` landmark; the NAP lives in a single `<address>` element (PRD §7 semantic NAP).
- The footer's heading is the business name as an `<h2>` (not `<h1>` — the page owns the single `<h1>`); no skipped levels introduced.
- `<nav aria-label="Footer">` distinguishes it from the primary header nav.
- `tel:`/`mailto:` are real links; visible `focus-visible` ring (`ring-white`) on every link for AA focus on the red ground.
- White-on-`brand-red` text contrast meets WCAG AA (verify; the design system notes deepening to `brand-red-dark` if a specific size/weight fails).

---

## F. Testing Strategy (required — Tier: light)

Smoke test that the footer renders the exact NAP, the data-driven nav, and a dynamic (not literal) year. Create `src/components/Footer.test.tsx`; render inside a `MemoryRouter`. Concrete tests:

- Renders an `<address>` (query by role/element) containing "11538 FM 3058", "Somerville, TX 77874", and the legal name "Smokin' Guns Productions LLC".
- The phone renders as a link with `href="tel:8328572826"`; the email as a link with `href="mailto:smokingunsproductions@gmail.com"`.
- All six `nav.ts` labels render as links (e.g. "Events" → `/events`).
- **Dynamic year:** the copyright text contains `String(new Date().getFullYear())` — assert against the computed value, not a literal, so it stays correct after 2026 (and confirm it does **not** contain "2025").
- A "Privacy" / "Privacy & Consent" link is present and is **not** a GoDaddy/Google URL; assert the footer text contains no "GoDaddy" / "wsimg" substring.

**Manual check (all tiers):**
1. `npm run dev`; scroll to the footer on any page — confirm NAP, hours, nav, privacy link, and "© {current year}".
2. Click the phone/email links → dialer / mail client opens with the correct values.
3. Tab through footer links → visible focus ring on the red ground.
4. Grep the rendered DOM / source for "GoDaddy" and "wsimg" → no matches.

---

## G. Definition of Done (required)

- [ ] NAP rendered in a semantic `<address>` from `businessInfo.ts` (Somerville locality); no hardcoded NAP.
- [ ] Phone `tel:` and email `mailto:` links correct; all three hours lines present from data.
- [ ] Nav repeated from `nav.ts` (six links, matching the Header).
- [ ] Copyright year is `new Date().getFullYear()` (dynamic; no "© 2025").
- [ ] Owned privacy/consent link present; no Google/GoDaddy boilerplate; zero GoDaddy/`wsimg` strings.
- [ ] Only design-system tokens (no hardcoded color/spacing/font-size); white-on-red AA verified.
- [ ] Story-2 placeholder `Footer` fully replaced; reuses `businessInfo.ts` + `nav.ts`.
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `businessInfo.ts` + `nav.ts` (story 1), the router shell (story 2). `react-router-dom` already installed.
- **Blockers:** None identified. The owned privacy statement copy and the exact consent re-open behavior are owner-pending (PRD §10 item 14) and tie to `ConsentNotice` (story 10) — shipped as a `/privacy` placeholder link with a `TODO(owner-confirm)`, never a third-party policy link.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #8, §E #9)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §B, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§3, §9; discard items 1, 4, 8; §10 item 14)
- Related components this depends on: `businessInfo.ts` + `nav.ts` (1), App shell (2); relates to `ConsentNotice` (10) for the privacy re-open.
