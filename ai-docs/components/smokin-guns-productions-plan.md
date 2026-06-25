# Component Plan — Smokin' Guns Productions LLC

## Document Metadata (required)
- PRD path: `ai-docs/prd/smokin-guns-productions.md`
- Conventions path: `ai-docs/conventions/CONVENTIONS.md`
- Date: 2026-06-25
- Business / site name: Smokin' Guns Productions LLC
- Business-type profile: `general-local` (fallback), layered with event-producer / equestrian-sports needs

---

## A. Site Overview (required)

Smokin' Guns Productions LLC is a barrel-racing and pole-bending event-production business running a full 2026 season across three Texas venues (Snook Rodeo Arena in Somerville, Magnolia Cowboy Church, Waller Co. Fairgrounds). This is a **multi-page Vite static site** with clean per-page URLs — `/` (Home), `/events`, `/results`, `/about`, `/sponsors`, `/contact` — replacing a single-page GoDaddy build. The **primary conversion goal is contact / event registration** (Home next-event highlight → Events race details → Contact registration flow); the headline SEO win is machine-readable `schema.org/Event` markup for **every** dated event in the season. The design system (Tailwind v4 `@theme` tokens in `src/index.css`) and `CONVENTIONS.md` already exist; this plan builds the app shell, shared primitives, and page sections on top of them.

---

## B. PRD Traceability (required)

Every PRD section/requirement maps to at least one component. Cross-referenced against the PRD's 28 preserved-content items (§8) and 9 acceptance-criteria groups (§9).

| PRD Section | Component(s) | Notes |
|---|---|---|
| §3 IA — multi-page, clean URLs | `App` (router shell), `pages/*` | Router maps `/`, `/events`, `/results`, `/about`, `/sponsors`, `/contact` |
| §3 / §5 — persistent header, nav, persistent Register CTA, mobile drawer, active state | `Header`, `nav.ts`, `Button` | Persistent `brand-red` Register CTA; hamburger drawer; active-page state |
| §3 / §9 — footer (NAP, hours, nav repeat, dynamic year, owned policy, no GoDaddy) | `Footer`, `businessInfo.ts`, `nav.ts` | Dynamic `new Date().getFullYear()` |
| §5 — owned dismissible cookie/consent notice | `ConsentNotice` | Replaces GoDaddy banner; localStorage-dismissed |
| §5 / §2 — single brand-red CTA discipline | `Button` (shared primitive) | Only `brand-red` actionable button in the system |
| §2 / §4 — red/teal/cream section banding | `SectionBand` (shared primitive) | `tone: 'red' \| 'teal' \| 'cream'` |
| §4.2 / §7 — per-event card with times, classes, register, .ics | `EventCard`, `events.ts`, `venues.ts` | Reused on Home + Events |
| §7 — per-page meta/title/canonical/OG/Twitter | `Seo` (head manager), `seo.ts` | Per-route meta, canonical, OG/Twitter |
| §7 — `SportsActivityLocation`/`LocalBusiness` JSON-LD | `BusinessJsonLd`, `businessInfo.ts`, `venues.ts` | Business + primary venue |
| §7 — `schema.org/Event` JSON-LD for every dated event (correct venue, AM+PM) | `EventJsonLd`, `events.ts`, `venues.ts` | Emitted for the full season |
| §4.1 — Home hero, tagline, mission snippet, next-event card, results teaser | `Home` page, `Hero`, `NextEventCard`, `ResultsTeaser`, `MissionSnippet` | Next-event card is data-driven |
| §4.2 — Events: full season, filter/group, banner, AM note | `Events` page, `EventsFilterBar`, `SeasonBuckleBanner`, `AmSectionNote` | PRIMARY content |
| §4.2 (B) — buckle-series flyer detail (schedule/pre-entries/classes/pricing/rules as text) | `BuckleSeriesDetail`, `events.ts` | Re-authored as semantic text |
| §4.2 (D) — Magnolia playday detail | rendered by `EventCard` expanded / `PlaydayDetail`, `events.ts` | Re-authored as text |
| §4.2 — add-to-calendar .ics per event | `AddToCalendarButton` | Uses ics generator |
| §4.3 — Results & Standings (branded link/embed, pink accent) | `Results` page, `ResultsPanel`, `results.ts` | No tinyurl visible |
| §4.4 — About (mission verbatim) | `About` page, `MissionStatement`, `businessInfo.ts` | "a upbeat" verbatim |
| §4.5 — Sponsors: three-tier program + sponsor wall + CTA | `Sponsors` page, `SponsorTierCard`, `SponsorWall`, `SponsorCard`, `sponsorTiers.ts`, `sponsors.ts` | Teal ground for tiers |
| §4.6 — Contact: NAP/hours, registration form, map, EmailJS, honeypot | `Contact` page, `ContactInfo`, `RegistrationForm`, `VenueMap`, `businessInfo.ts`, `events.ts` | Event/race selector |
| §6 — content in editable typed data files | all `src/data/*.ts` | No hardcoded varying content |
| §6 — static multi-page Vite build, EmailJS, VITE_* env | `App`, `RegistrationForm` | Keys in `import.meta.env.VITE_*` |
| §7 — sitemap.xml + robots.txt | build asset task (see Gaps) | Not a React component |
| §8 — 28 preserved items re-authored as text | distributed across pages + data files | No core content as flyer image only |

---

## C. Component Inventory (required)

### Structural / shared (built first)

#### 1. `App` (router shell)
- **PRD source:** §3 IA; §6 Technical (clean URLs)
- **Responsibilities:** Owns the route table mapping clean URLs → page components (`/` Home, `/events` Events, `/results` Results, `/about` About, `/sponsors` Sponsors, `/contact` Contact); renders the persistent `Header` + `Footer` + `ConsentNotice` shell around the routed page outlet; wraps the tree in the head-manager provider (`HelmetProvider`) so each page can set meta. Replaces the scaffold's default `App`.
- **Data needs:** none directly (pages pull their own data). Route paths align with `nav.ts`.
- **Design tokens:** none beyond layout; sets `bg-cream text-ink font-sans` base on the shell.
- **Acceptance criteria:** All six routes resolve at their clean URLs; unknown route renders a minimal 404 routed back to Home; Header/Footer persist across navigation; build emits per-page output.
- **Interactions / behavior:** client-side routing; scroll-to-top on route change.
- **Dependencies:** router package (`react-router-dom`), head manager (`react-helmet-async`); renders `Header`, `Footer`, `ConsentNotice`.

#### 2. `Seo` (per-page head manager)
- **PRD source:** §7 (unique meta titles/descriptions, canonical, OG/Twitter, single-encoded entities)
- **Responsibilities:** Given a page key (or explicit props), renders `<title>`, `<meta name="description">`, canonical `<link>`, and Open Graph + Twitter (`summary_large_image`) tags for the current page. Pulls per-page copy from `seo.ts`. Ensures apostrophes are single-encoded (fixes the `&amp;#39;` bug).
- **Data needs:** `seo.ts` — per-page `{ title; description; ogTitle?; ogDescription?; ogImage; canonicalPath }`. Export `type PageSeo`, `const seo: Record<PageKey, PageSeo>`.
- **Design tokens:** none (head only).
- **Acceptance criteria:** Each page has a unique, clean (single-encoded) title + description matching the PRD §7 strings; canonical URL per page; OG/Twitter present with a non-`wsimg.com` og:image; reuses tagline where apt.
- **Interactions / behavior:** none.
- **Dependencies:** `react-helmet-async`; `seo.ts`.

#### 3. `BusinessJsonLd`
- **PRD source:** §7 local-SEO block (`SportsActivityLocation`/`LocalBusiness`)
- **Responsibilities:** Emits one JSON-LD `<script>` for the business + primary venue: name, exact NAP address, geo (lat/lng), telephone, email, url, `openingHoursSpecification` from hours. Type `SportsActivityLocation` with `LocalBusiness` fallback flag.
- **Data needs:** `businessInfo.ts` (NAP, phone, email, hours, url) + `venues.ts` (primary venue geo).
- **Design tokens:** none.
- **Acceptance criteria:** Validates in Rich Results Test; carries exact NAP, geo, `openingHoursSpecification`, telephone, email, url; no `priceRange` unless fees confirmed (omitted by default — see Gaps).
- **Interactions / behavior:** none.
- **Dependencies:** `businessInfo.ts`, `venues.ts`. Rendered on Home (and Contact).

#### 4. `EventJsonLd`
- **PRD source:** §7 (mandatory `schema.org/Event` for EVERY dated event)
- **Responsibilities:** Given a `SeasonEvent`, emits valid `Event` JSON-LD: `name`, `startDate` (ISO 8601 w/ time), `location` (correct venue address + geo), `eventStatus: EventScheduled`, `organizer` (Smokin' Guns Productions LLC), `eventAttendanceMode: OfflineEventAttendanceMode`. For Snook series/jackpot dates that have AM and PM races, emits both times (model PM as a second `Event`/`subEvent`) preserving the two morning schedules (11:00am vs 10:15am) and the 6:00pm PM race.
- **Data needs:** `events.ts` (per-event date/times/kind/venueId), `venues.ts` (resolve venueId → address + geo).
- **Design tokens:** none.
- **Acceptance criteria:** Every dated event across the season (Snook series incl. May 23, Snook Jackpot, Day Shows, Waller Shootout Qualifier & Finals, Pick Your Poison Playday, three Magnolia playdays) emits an `Event` block pointing to its correct venue; AM+PM both expressed for the four Snook cards; validates in Rich Results Test.
- **Interactions / behavior:** none.
- **Dependencies:** `events.ts`, `venues.ts`. Rendered on Events (and Home for the next event).

#### 5. `Button` (shared primitive)
- **PRD source:** §2 / §5 / §9 (single brand-red CTA discipline; no ghost/outline primaries)
- **Responsibilities:** The single actionable button/link in the system. Renders as `<button>` or as a routed link/anchor (`as` prop). Solid `bg-brand-red text-white`, hover `bg-brand-red-dark`, `rounded-md`, type-scale text, ≥44px tap target. No teal/pink/ghost variants exist.
- **Data needs:** none (label/href via props).
- **Design tokens:** color `brand-red` / `brand-red-dark` / `white`; `text-base`; spacing `px-6 py-3`; `rounded-md`; focus-visible ring.
- **Acceptance criteria:** Only one CTA color (`brand-red`); solid not outline; ≥44px target; visible focus state; usable as link or button.
- **Interactions / behavior:** hover/active/focus states.
- **Dependencies:** router `Link` (for internal hrefs).

#### 6. `SectionBand` (shared primitive)
- **PRD source:** §2 (section banding: red / teal / cream, no per-section drift)
- **Responsibilities:** Full-bleed section wrapper with a typed `tone: 'red' | 'teal' | 'cream'` prop setting background (`bg-brand-red` / `bg-teal` / `bg-cream`) and the correct on-tone text color; constrains inner content to a max-width container with consistent vertical rhythm.
- **Data needs:** none (children).
- **Design tokens:** colors `brand-red` / `teal` / `cream` + on-tone `text-white` / `text-ink`; spacing scale for padding.
- **Acceptance criteria:** Tone is a typed prop (not free-form class); only the three brand grounds are selectable; text contrast meets AA on each ground.
- **Interactions / behavior:** none.
- **Dependencies:** none.

#### 7. `Header`
- **PRD source:** §3 / §5 / §9 (persistent header, multi-page nav, persistent Register CTA, mobile drawer, active-page state)
- **Responsibilities:** Sticky top header with logo (links Home), horizontal nav from `nav.ts` with active-page state, and a persistent `brand-red` "Register" CTA routing to `/contact`. Mobile: hamburger toggling a drawer with the same nav + CTA. No dead "More" menu.
- **Data needs:** `nav.ts` (nav items + paths); logo asset.
- **Design tokens:** `bg-ink` or `bg-white`/`bg-cream` per design; `font-display uppercase tracking-wide` nav; `brand-red` CTA; spacing scale.
- **Acceptance criteria:** All six nav links work; current page shows active state; Register CTA persists on every page and on mobile; hamburger drawer opens/closes; tap targets ≥44px; keyboard-navigable.
- **Interactions / behavior:** drawer open/close state; active-link detection (router `NavLink`); closes drawer on navigation; `prefers-reduced-motion`-safe transitions.
- **Dependencies:** `Button`, `nav.ts`, router.

#### 8. `Footer`
- **PRD source:** §3 / §9 (NAP, hours, phone/email, nav repeat, dynamic year, owned policy, no GoDaddy)
- **Responsibilities:** Footer with primary NAP in `<address>`, hours, `tel:`/`mailto:` links, repeated nav from `nav.ts`, dynamic copyright year, and an owned privacy/consent link (opens the consent/policy). No GoDaddy branding.
- **Data needs:** `businessInfo.ts` (NAP, phone, email, hours), `nav.ts`.
- **Design tokens:** `bg-brand-red` or `bg-ink` band; `text-white`; type scale; spacing.
- **Acceptance criteria:** Exact NAP/phone/email/hours; year = current year dynamically; nav repeat works; policy link present; zero GoDaddy strings.
- **Interactions / behavior:** none beyond links.
- **Dependencies:** `businessInfo.ts`, `nav.ts`, router.

#### 9. `ConsentNotice`
- **PRD source:** §5 (owned, minimal, dismissible consent notice replacing GoDaddy banner)
- **Responsibilities:** Minimal, dismissible bottom notice with the business's own privacy statement and an accept/dismiss action; persists dismissal in `localStorage` so it does not reappear. Optionally gates the third-party map embed behind consent.
- **Data needs:** static policy copy (small, may inline or live in `seo.ts`/a small `consent.ts`). No varying business data.
- **Design tokens:** `bg-ink`/`bg-cream-deep`; `text-white`/`text-ink`; `Button` for dismiss; shadow/spacing.
- **Acceptance criteria:** Dismissible; stays dismissed across reloads; no GoDaddy/Google boilerplate; does not permanently obscure content; keyboard-dismissible.
- **Interactions / behavior:** localStorage read/write; mount only if not dismissed; reduced-motion-safe.
- **Dependencies:** `Button`.

#### 10. `EventCard` (shared)
- **PRD source:** §4.2 (per-event card), §4.1 (next-event reuse)
- **Responsibilities:** Renders one `SeasonEvent`: title (incl. "SNOOK JACKPOT" where applicable), date, venue name, AM exhibitions + AM section race (with number range), PM exhibitions + PM section race, event-kind badge, and — where applicable — its classes/pricing and rules as real text. Includes a per-event "Register / Enter this event" `Button` (→ `/contact?event=<id>`) and an `AddToCalendarButton`. Jackpot vs series vs playday distinguished by a typed badge.
- **Data needs:** `events.ts` (`SeasonEvent`), `venues.ts` (venue label). Tone prop `'cream' | 'white'`.
- **Design tokens:** `bg-cream-deep`/`bg-white`; `rounded-md`; `shadow-card`; `font-display` heading; `font-sans` body; spacing; `text-pink` reserved (not used as CTA).
- **Acceptance criteria:** Shows exact times and number ranges (cards 1–2: 9:30–10:45am / 11:00am #1–200; cards 3–4: 9:00–10:00am / 10:15am #1–200; all PM 6:00pm #201–end); card #4 titled SNOOK JACKPOT; classes/pricing/rules rendered as selectable text where present; Register CTA and add-to-calendar present; no times/prices hardcoded in JSX (all from `events.ts`); reflows to stacked layout on mobile.
- **Interactions / behavior:** scroll fade/slide gated behind `motion-safe:`; expand/collapse for long class lists optional.
- **Dependencies:** `Button`, `AddToCalendarButton`, `events.ts`, `venues.ts`.

#### 11. `AddToCalendarButton` (shared)
- **PRD source:** §4.2 (add-to-calendar .ics per event)
- **Responsibilities:** Generates and downloads an `.ics` file for a given event date/time/venue (uses the AM start; offers PM as a second VEVENT or a separate action). Renders as a non-primary control (text/secondary affordance — not a `brand-red` CTA, to preserve single-CTA discipline; treat as a tertiary link/icon button).
- **Data needs:** `SeasonEvent` (date, times, title, venue address from `venues.ts`).
- **Design tokens:** neutral/`text-ink` link style; icon from icon set; spacing.
- **Acceptance criteria:** Produces a valid `.ics` that imports into Google/Apple calendars with correct title, start/end, and venue location; available per event.
- **Interactions / behavior:** click → blob download.
- **Dependencies:** ics generator (`ics` package), icon library, `events.ts`, `venues.ts`.

### Home page sections

#### 12. `Hero`
- **PRD source:** §4.1
- **Responsibilities:** Full-bleed hero with the barrel-racing action photo + dark (`ink`) overlay, headline **"RUN WHERE THE MONEY IS AT"**, sub-headline **"WELCOME TO THE HOUSE OF SMOKIN' RUNS!"**, the "Experience Thrilling Speed Events" framing, and a single `brand-red` Register CTA routing to `/contact`.
- **Data needs:** copy is fixed brand content (may inline as Home-page constants; tagline also referenced by `seo.ts` for OG). Hero image asset (responsive `srcset`, explicit width/height).
- **Design tokens:** `bg-ink` overlay; `font-display text-6xl uppercase tracking-wide text-white`; `brand-red` CTA; `rounded-lg` hero media; spacing.
- **Acceptance criteria:** Exact preserved headline + tagline; CTA routes to registration (not `mailto:`); one CTA color; image has width/height (no CLS) and responsive `srcset`.
- **Interactions / behavior:** reduced-motion-safe entrance only.
- **Dependencies:** `Button`, `SectionBand`(red optional), hero asset.

#### 13. `NextEventCard`
- **PRD source:** §4.1 (data-driven next-event highlight)
- **Responsibilities:** Computes the soonest future event from `events.ts` (relative to current date) and renders it via `EventCard`, plus "View all events" (→ `/events`) and "Register" CTAs.
- **Data needs:** `events.ts` (full season; selects soonest `startDate >= today`).
- **Design tokens:** inherits `EventCard`; `SectionBand` cream.
- **Acceptance criteria:** Always shows the soonest future event from the data file (not hardcoded); both CTAs route correctly; gracefully handles "no upcoming events" (show season-ended message).
- **Interactions / behavior:** date comparison at render.
- **Dependencies:** `EventCard`, `Button`, `events.ts`.

#### 14. `MissionSnippet`
- **PRD source:** §4.1 (mission excerpt + Read more)
- **Responsibilities:** Renders a short excerpt of the mission with a "Read more" link to `/about`.
- **Data needs:** `businessInfo.ts` (mission text, single source; About renders it in full).
- **Design tokens:** `SectionBand` cream; `font-sans`; type scale.
- **Acceptance criteria:** Excerpt present; "Read more" routes to About; pulls from the same mission source as About (no divergence).
- **Interactions / behavior:** none.
- **Dependencies:** `businessInfo.ts`, router.

#### 15. `ResultsTeaser`
- **PRD source:** §4.1 (results teaser block)
- **Responsibilities:** Short block teasing Series Points / standings with a branded link to `/results` (never the tinyurl).
- **Data needs:** `results.ts` (label/destination); rendered as branded link.
- **Design tokens:** `SectionBand` cream; `text-pink` accent permitted for emphasis; `font-sans`.
- **Acceptance criteria:** Links to `/results`; no `tinyurl.com` shown as visible text.
- **Interactions / behavior:** none.
- **Dependencies:** `results.ts`, router.

### Events page sections

#### 16. `SeasonBuckleBanner`
- **PRD source:** §4.2 / preserve item 28 ("22 Champion Buckles")
- **Responsibilities:** Banner line "22 Champion Buckles" with the buckle categories (Open, Youth, Rookie, PeeWee, Senior, Adult) for the buckle series.
- **Data needs:** small static banner content (may live in `events.ts` as series metadata or a `seriesInfo` constant).
- **Design tokens:** `SectionBand` red (Series Points band tone); `font-display uppercase tracking-wide text-white`.
- **Acceptance criteria:** "22 Champion Buckles" line present with the category list as text.
- **Interactions / behavior:** none.
- **Dependencies:** `SectionBand`.

#### 17. `AmSectionNote`
- **PRD source:** §4.2 / preserve items 11, 28
- **Responsibilities:** Renders the "Upcoming Events" overview heading and the note "A.M. Section Added, Please See Dates And Times Listed Under Flyer." as real text in the Events overview.
- **Data needs:** static overview copy (Events-page constant or `seriesInfo`).
- **Design tokens:** `font-display` heading; `font-sans` note; cream ground.
- **Acceptance criteria:** AM Section note + "Upcoming Events" heading present as text.
- **Interactions / behavior:** none.
- **Dependencies:** none.

#### 18. `EventsFilterBar`
- **PRD source:** §4.2 (filter/group by venue & event type)
- **Responsibilities:** Filter/group controls for venue (Snook / Magnolia / Waller) and event kind (Series · Jackpot · Day Shows · Shootout Qualifier/Finals · Playdays); filters the rendered event list.
- **Data needs:** derives venue + kind options from `events.ts` / `venues.ts` (no hardcoded option lists).
- **Design tokens:** `font-sans`; `bg-cream-deep` controls; `text-ink`; tokens only (no teal/pink buttons).
- **Acceptance criteria:** Filtering by venue and by event kind narrows the list correctly; "all" default shows the full season; options derive from data; keyboard-accessible controls with labels.
- **Interactions / behavior:** local filter state lifted to the Events page.
- **Dependencies:** `events.ts`, `venues.ts`.

#### 19. `BuckleSeriesDetail`
- **PRD source:** §4.2 (B) / preserve item 24
- **Responsibilities:** Re-authors the buckle-series flyer as semantic text: schedule (books 3:30pm, exhibitions 3:30–5:45pm, race 6pm), pre-entries (Wed 10am → Fri 6pm, TEXT 832-857-2826, $10 non-refundable Venmo office fee, walk-ups welcome), nominations ($20/combo, not mandatory), classes + pricing (5D Open $50 · 3D Youth $30 · 2D PeeWee $20 · 3D Rookie $25 · 3D Senior $25 · 3D Novice Horse $25 · High Stakes $75 · Leadline TBC · office fee TBC), and rules (Negative Coggins Required · Cash Only). Obscured values rendered as "TBC / confirm with owner," never guessed. Notes May 23 series date + June 20 rain date.
- **Data needs:** `events.ts` — series detail block (classes[], pricing, schedule, pre-entry rules) as typed structured data, not prose hardcoded in JSX.
- **Design tokens:** `SectionBand` cream; `font-sans`; type scale for lists/tables; `font-display` sub-headings.
- **Acceptance criteria:** All listed classes/pricing, pre-entry rules, nominations, and "Negative Coggins Required · Cash Only" present as selectable text; obscured values flagged TBC not invented; no part presented only as a flyer image.
- **Interactions / behavior:** none.
- **Dependencies:** `events.ts`, `SectionBand`.

#### 20. `Events` page (composition)
- **PRD source:** §4.2
- **Responsibilities:** Composes the Events page: `Seo`, `SeasonBuckleBanner`, `AmSectionNote`, `EventsFilterBar`, the filtered list of `EventCard`s for the **full 2026 season** (Snook series incl. May 23, Snook Jackpot, Day Shows, Waller Shootout Qualifier & Finals, Pick Your Poison Playday, three Magnolia playdays), `BuckleSeriesDetail`, and `EventJsonLd` for every event.
- **Data needs:** `events.ts`, `venues.ts`.
- **Design tokens:** layout via `SectionBand`; cream ground.
- **Acceptance criteria:** Full season present (not just four dates); every event has an `EventCard` and an `Event` JSON-LD pointing to its correct venue; filtering works; one `<h1>`.
- **Interactions / behavior:** filter state.
- **Dependencies:** all Events-section components + `EventCard`, `EventJsonLd`, `Seo`.

### Results page

#### 21. `ResultsPanel`
- **PRD source:** §4.3
- **Responsibilities:** Branded Series Points / standings panel — an embed if Rodeo Results App supports one, otherwise a clearly branded outbound button with descriptive link text ("Series Points — Rodeo Results App"). Never exposes `tinyurl.com` as visible link text. `pink` accent permitted for award emphasis (not as a CTA).
- **Data needs:** `results.ts` — `{ label; destinationUrl; embedUrl?; mode: 'embed' | 'link' }`.
- **Design tokens:** `SectionBand` cream; standings on `cream`/`white`; `text-pink` accent; `Button` (brand-red) for the outbound action.
- **Acceptance criteria:** No `tinyurl.com` shown as visible link text; descriptive link/embed; reachable from primary nav; pink used as accent only.
- **Interactions / behavior:** conditional embed vs link by `results.ts` mode.
- **Dependencies:** `results.ts`, `Button`, `SectionBand`, `Seo`.

### About page

#### 22. `MissionStatement`
- **PRD source:** §4.4 / preserve items 1, 4, 5
- **Responsibilities:** Renders the mission statement **verbatim** ("...good ground, great payout and a upbeat professional attitude...") — "a upbeat" stays verbatim unless owner approves the fix — plus the business-name lockup and the "Experience Thrilling Speed Events" framing/imagery. No fabricated history.
- **Data needs:** `businessInfo.ts` (mission text — single source; a `missionVerbatim` field plus an optional `missionCorrected` flag set only on owner approval).
- **Design tokens:** `SectionBand` cream; `font-display` heading; `font-sans` body.
- **Acceptance criteria:** Mission rendered verbatim; "a upbeat → an upbeat" applied only when an owner-approval flag is set; no invented claims; single `<h1>`.
- **Interactions / behavior:** none.
- **Dependencies:** `businessInfo.ts`, `SectionBand`, `Seo`.

### Sponsors page

#### 23. `SponsorTierCard`
- **PRD source:** §4.5 / preserve item 21
- **Responsibilities:** Renders one sponsorship tier (Platinum $5,000 / Gold $1,500 / Silver $1,000) with exact price and re-authored benefit bullets as real text on the `teal` brand ground. Obscured Silver benefits rendered as "additional benefits — confirm with owner," not invented.
- **Data needs:** `sponsorTiers.ts` (`SponsorTier[]`: name, price, benefits[]).
- **Design tokens:** `SectionBand` teal; cards on `bg-teal-deep`/`bg-white`; `font-display` tier name; `font-sans` benefits; `Button` for the CTA (brand-red, not teal).
- **Acceptance criteria:** All three tiers with exact prices and benefits as text (not a flyer image); obscured Silver benefits flagged; teal used as section ground (no teal CTA).
- **Interactions / behavior:** none.
- **Dependencies:** `sponsorTiers.ts`, `SectionBand`.

#### 24. `SponsorCard` + `SponsorWall`
- **PRD source:** §4.5 / preserve item 22
- **Responsibilities:** `SponsorWall` renders a coherent grid of `SponsorCard`s; each `SponsorCard` shows a sponsor's name + contact info (phone/site/tagline) as real text beside its logo. Unified card treatment on the brand palette. Logo links out when a URL is present (see Gaps).
- **Data needs:** `sponsors.ts` (`Sponsor[]`: name, phone?, url?, location?, tagline?, logo? — ≥8 sponsors).
- **Design tokens:** `bg-cream-deep`/`bg-white` cards; `rounded-md`; `shadow-card`; `font-sans`; spacing grid.
- **Acceptance criteria:** All ≥8 named sponsors present with captured contact info as real text; unified treatment; no core sponsor content as raster-only; ≥8 cards render from the data file.
- **Interactions / behavior:** optional logo link when `url` present.
- **Dependencies:** `sponsors.ts`.

#### 25. `Sponsors` page (composition)
- **PRD source:** §4.5
- **Responsibilities:** Composes "Join in" lead-in, the three `SponsorTierCard`s on teal, the `SponsorWall`, and a "Become a 2026 Sponsor" `Button` routing to `/contact`. Plus `Seo`.
- **Data needs:** `sponsorTiers.ts`, `sponsors.ts`.
- **Design tokens:** teal + cream bands; `brand-red` CTA.
- **Acceptance criteria:** "Join in" heading, three tiers, sponsor wall, and Become-a-Sponsor CTA → Contact all present; single `<h1>`.
- **Interactions / behavior:** none.
- **Dependencies:** `SponsorTierCard`, `SponsorWall`, `Button`, `Seo`.

### Contact page

#### 26. `ContactInfo`
- **PRD source:** §4.6 / preserve items 14–17, 27
- **Responsibilities:** Renders exact NAP in `<address>`, `tel:8328572826`, `mailto:`, hours, and the contact intro copy ("Better yet, see us in person!...Ask about our 2026 Sponsorship Opportunity.").
- **Data needs:** `businessInfo.ts` (NAP, phone, email, hours, intro copy).
- **Design tokens:** `SectionBand` cream; `font-sans`; `text-brand-red` phone.
- **Acceptance criteria:** NAP/phone/email/hours exact and consistent with schema; intro copy present; semantic `<address>`.
- **Interactions / behavior:** `tel:`/`mailto:` links.
- **Dependencies:** `businessInfo.ts`.

#### 27. `RegistrationForm`
- **PRD source:** §4.6 / preserve item 13; §6 (EmailJS, VITE_* env); §5 (validation, honeypot)
- **Responsibilities:** "Enter a Race / Register" form: event/race selector (populated from `events.ts`), Name, Email (required), Message, File attachment (accepted-type hint + size guard). Inline validation; success/error states. Submits via EmailJS using `VITE_*` keys; honeypot hidden field + provider-side spam protection. Pre-selects the event from `?event=<id>` query param when arriving from an EventCard CTA.
- **Data needs:** `events.ts` (event/race options); EmailJS keys from `import.meta.env.VITE_EMAILJS_*`.
- **Design tokens:** `bg-white` fields; `font-sans`; `Button` (brand-red) submit; focus/error states; spacing.
- **Acceptance criteria:** Fields = Name, Email (required), Message, File attachment + event/race selector; Email validated; submission delivers to the business email; honeypot present; no hardcoded keys; event pre-selected from query param; not a raw `mailto:` as the sole path.
- **Interactions / behavior:** controlled inputs, validation, async submit, honeypot, file-type/size guard.
- **Dependencies:** `@emailjs/browser`, `Button`, `events.ts`.

#### 28. `VenueMap`
- **PRD source:** §4.6 / §7 (embedded venue map)
- **Responsibilities:** Embeds a privacy-respecting map of Snook Rodeo Arena (lazy-loaded). If it sets third-party cookies, gated behind `ConsentNotice` consent.
- **Data needs:** `venues.ts` (primary venue geo/address).
- **Design tokens:** `rounded-md`; full-width on mobile; spacing.
- **Acceptance criteria:** Venue map embedded; lazy-loaded (LCP/CLS safe); consent-gated if it sets cookies.
- **Interactions / behavior:** lazy load on scroll/consent.
- **Dependencies:** `venues.ts`, optionally `ConsentNotice`.

#### 29. `Contact` page (composition)
- **PRD source:** §4.6
- **Responsibilities:** Composes `Seo`, `ContactInfo`, `RegistrationForm`, `VenueMap`, and a `BusinessJsonLd` reuse.
- **Data needs:** `businessInfo.ts`, `events.ts`, `venues.ts`.
- **Design tokens:** cream ground.
- **Acceptance criteria:** NAP/form/map all present; single `<h1>`.
- **Interactions / behavior:** form state.
- **Dependencies:** `ContactInfo`, `RegistrationForm`, `VenueMap`, `Seo`.

#### 30. `Home` page (composition)
- **PRD source:** §4.1
- **Responsibilities:** Composes `Seo`, `BusinessJsonLd`, `Hero`, `MissionSnippet`, `NextEventCard`, `ResultsTeaser`.
- **Data needs:** `events.ts`, `businessInfo.ts`, `results.ts`.
- **Design tokens:** banding via `SectionBand`.
- **Acceptance criteria:** Hero + tagline + mission snippet + data-driven next-event card + results teaser; one CTA color; single `<h1>`.
- **Interactions / behavior:** none beyond children.
- **Dependencies:** `Hero`, `MissionSnippet`, `NextEventCard`, `ResultsTeaser`, `Seo`, `BusinessJsonLd`.

---

## D. Editable Data Files (required)

All in `src/data/`, lowerCamelCase filename, PascalCase singular exported type, lowerCamelCase exported constant (per CONVENTIONS.md §D). No varying content (times, prices, class names, NAP, sponsors, nav) appears in JSX.

| File | Holds | Exported type(s) + constant |
|---|---|---|
| `src/data/events.ts` | Full 2026 multi-venue season: Snook series (incl. May 23 + Jun 20 rain date), Snook Jackpot, Day Shows (Magnolia & Snook), Waller Shootout Qualifier & Finals (Mar 6–8, Sep 4–6), Pick Your Poison Playday (Oct 24, rain Oct 31), three Magnolia playdays (Jun 27, Jul 18, Aug 29). Each event: `id`, `kind`, `title`, ISO date(s), AM/PM exhibitions + race times, number ranges, `venueId`, and (where applicable) `classes[]` (name + price), schedule, pre-entry rules, rain date. Plus series metadata (22 Champion Buckles, buckle categories, AM Section note, "Upcoming Events"). | `type EventKind = 'series' \| 'jackpot' \| 'dayShow' \| 'shootout' \| 'playday'`; `type SeasonEvent`; `type EventClass`; `const season: SeasonEvent[]`; `const seriesInfo` |
| `src/data/venues.ts` | Per-venue NAP + geo for Snook Rodeo Arena (11538 FM 3058, Somerville TX 77874), Magnolia Cowboy Church (2360 Dobbin Hufsmith Rd, Magnolia TX 77354), Waller Co. Fairgrounds (Waller TX — street TBC). Lat/lng TBC. | `type VenueId = 'snook' \| 'magnolia' \| 'waller'`; `type Venue`; `const venues: Record<VenueId, Venue>` |
| `src/data/businessInfo.ts` | Primary NAP, phone (832-857-2826), email (smokingunsproductions@gmail.com), hours, site url, mission text (verbatim + corrected + approval flag), contact intro copy. | `type BusinessInfo`; `const businessInfo: BusinessInfo` |
| `src/data/results.ts` | Results destination config (Rodeo Results App): label, resolved destination URL (TBC), optional embed URL, `mode`. | `type ResultsSource`; `const results: ResultsSource` |
| `src/data/sponsorTiers.ts` | Three tiers: Platinum $5,000, Gold $1,500, Silver $1,000, each with benefit list (Silver lower benefits TBC). | `type SponsorTier`; `const sponsorTiers: SponsorTier[]` |
| `src/data/sponsors.ts` | ≥8 named sponsors with name + contact (phone/url/location/tagline/logo). | `type Sponsor`; `const sponsors: Sponsor[]` |
| `src/data/nav.ts` | Primary nav items with clean-URL paths (Home, Events, Results & Standings, About, Sponsors, Contact). | `type NavItem`; `const nav: NavItem[]` |
| `src/data/seo.ts` | Per-page meta: title, description (single-encoded), og fields, canonical path. | `type PageSeo`; `type PageKey`; `const seo: Record<PageKey, PageSeo>` |

---

## E. Build Order (required)

Structural/shared first (design system already exists), then page sections, then page compositions. Each entry is sized for a single `component-builder` invocation.

| # | Component | Scope | Depends on |
|---|---|---|---|
| 1 | Data files (`nav.ts`, `businessInfo.ts`, `venues.ts`, `events.ts`, `results.ts`, `sponsorTiers.ts`, `sponsors.ts`, `seo.ts`) | Author all typed editable content from the PRD; foundation for everything | PRD content only |
| 2 | `App` (router shell) | Router table + Header/Footer/ConsentNotice shell + HelmetProvider; replace scaffold | router, head manager, nav.ts |
| 3 | `Button` | Single brand-red CTA primitive | tokens, router Link |
| 4 | `SectionBand` | Red/teal/cream banding primitive | tokens |
| 5 | `Seo` | Per-page head manager | head manager, seo.ts |
| 6 | `BusinessJsonLd` | Business/venue JSON-LD | businessInfo.ts, venues.ts |
| 7 | `EventJsonLd` | Per-event JSON-LD (AM+PM, correct venue) | events.ts, venues.ts |
| 8 | `Header` | Nav, logo, persistent Register CTA, mobile drawer, active state | Button, nav.ts, router |
| 9 | `Footer` | NAP/hours/nav repeat/dynamic year/policy | businessInfo.ts, nav.ts |
| 10 | `ConsentNotice` | Owned dismissible consent notice | Button |
| 11 | `AddToCalendarButton` | Per-event .ics download | ics lib, events.ts, venues.ts |
| 12 | `EventCard` | Per-event card (times/classes/register/.ics) | Button, AddToCalendarButton, events.ts, venues.ts |
| 13 | `Hero` | Home hero (headline/tagline/CTA/image) | Button, hero asset |
| 14 | `NextEventCard` | Data-driven soonest event | EventCard, events.ts |
| 15 | `MissionSnippet` | Home mission excerpt + Read more | businessInfo.ts |
| 16 | `ResultsTeaser` | Home results teaser → /results | results.ts |
| 17 | `Home` page | Compose Home | 5,6,13,14,15,16 |
| 18 | `SeasonBuckleBanner` | 22 Champion Buckles banner | SectionBand, events.ts |
| 19 | `AmSectionNote` | Upcoming Events heading + AM note | events.ts |
| 20 | `EventsFilterBar` | Filter/group by venue & kind | events.ts, venues.ts |
| 21 | `BuckleSeriesDetail` | Re-authored buckle-series flyer text | events.ts, SectionBand |
| 22 | `Events` page | Compose full-season Events + EventJsonLd | 5,7,12,18,19,20,21 |
| 23 | `ResultsPanel` + `Results` page | Branded standings link/embed | results.ts, Button, Seo |
| 24 | `MissionStatement` + `About` page | Verbatim mission | businessInfo.ts, Seo |
| 25 | `SponsorTierCard` | One tier on teal | sponsorTiers.ts, SectionBand |
| 26 | `SponsorCard` + `SponsorWall` | Sponsor grid | sponsors.ts |
| 27 | `Sponsors` page | Compose Join in + tiers + wall + CTA | 25,26, Button, Seo |
| 28 | `ContactInfo` | Exact NAP/hours/intro | businessInfo.ts |
| 29 | `RegistrationForm` | EmailJS form + event selector + honeypot | @emailjs/browser, Button, events.ts |
| 30 | `VenueMap` | Embedded venue map | venues.ts, ConsentNotice |
| 31 | `Contact` page | Compose Contact | 28,29,30, Seo, BusinessJsonLd |
| 32 | Build assets: `sitemap.xml` + `robots.txt` in `public/` | Static SEO files (not React) | route list |

---

## F. Feature Dependencies → `DEPENDENCIES.md` (required)

Written to `DEPENDENCIES.md` at the project root. Summary (full file + install command there):

- `react-router-dom` — multi-page clean URLs per §3/§6.
- `react-helmet-async` — per-page meta titles/descriptions + canonical + OG/Twitter + JSON-LD injection per §7. (React 19 has native `<title>`/`<meta>` hoisting; Helmet chosen for reliable canonical/OG/per-route management and JSON-LD — noted as a swap option in DEPENDENCIES.md.)
- `@emailjs/browser` — Contact/registration form backend per §6.
- `lucide-react` — icon set for nav/CTAs/add-to-calendar per brand voice (§5 UX affordances).
- `ics` — `.ics` add-to-calendar generation per §4.2.
- Light test tier: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom` (dev).

Infrastructure already scaffolded (NOT relisted): Vite, React, React-DOM, TypeScript, Tailwind, `@tailwindcss/vite`, oxlint, prettier. Self-hosted fonts are an asset task (drop `.woff2` into `src/assets/fonts/`), not an npm dependency.

---

## G. Gaps & Open Questions (required)

- [ ] **Test tier** — **Severity: blocking (sets the verification gate)**
      Context: The build pipeline asks for test tier (none / light / full) up front, which determines whether test deps install and which test gate `component-builder`/`verifier` enforce. The user's instructions specify the LIGHT tier.
      Options: none / light / full.
      Recommendation: **light** (as specified) — `vitest` + Testing Library + `jsdom` in `DEPENDENCIES.md`.

- [ ] **Head manager: react-helmet-async vs React 19 native** — **Severity: non-blocking**
      Context: React 19 natively hoists `<title>`/`<meta>`/`<link>` rendered in components, which could cover per-page meta without a dependency. But JSON-LD `<script type="application/ld+json">`, canonical management across SPA route changes, and OG tags are more robustly handled by a head manager.
      Options: (a) `react-helmet-async`; (b) React 19 native head tags + manual JSON-LD scripts.
      Recommendation: **(a) react-helmet-async** for reliable per-route canonical/OG/JSON-LD; revisit if bundle size matters. The `Seo`/`*JsonLd` components encapsulate the choice so a later swap is local.

- [ ] **Map embed provider (privacy/consent)** — **Severity: non-blocking**
      Context: §5/§7 require an embedded venue map but also a privacy-respecting, consent-gated embed and no render-blocking third-party scripts (CWV §6).
      Options: (a) Google Maps iframe (sets cookies → gate behind consent); (b) OpenStreetMap/Leaflet static or privacy embed; (c) static map image linking to directions.
      Recommendation: **(b/c)** — a privacy-respecting embed or static map linking out; if Google iframe is required, gate it behind `ConsentNotice`. No new npm dep unless Leaflet is chosen (flag before adding).

- [ ] **Obscured flyer values (owner-confirm, do not guess)** — **Severity: non-blocking**
      Context: PRD §10 routes several partly-legible values to owner confirmation: full Silver-tier benefits, Leadline class price, buckle-series office-fee amount, Venmo handle, Magnolia playday formats/age-splits/prices/payout wording, full Day Shows date list, Waller exact street address.
      Options: (a) render as "TBC — confirm with owner" placeholders in the data files; (b) omit until confirmed.
      Recommendation: **(a)** — include the fields in the typed data files with explicit `TBC` placeholder values and a comment, so structure is complete and the owner fills the blanks without code changes. Never invent values.

- [ ] **Venue geo coordinates + Waller address** — **Severity: non-blocking (blocks schema completeness, not the build)**
      Context: §7 requires lat/lng for all three venues and the exact Waller Co. Fairgrounds street address for NAP/schema/maps; PRD §10 routes these to the owner/geocoding.
      Options: (a) populate `venues.ts` geo with `null`/TBC and have JSON-LD omit `geo` when absent; (b) geocode the known addresses now as best-effort.
      Recommendation: **(a)** — type geo as optional; emit `geo` in JSON-LD only when present; flag in the client checklist. Snook + Magnolia addresses are known; Waller street address stays TBC.

- [ ] **Results destination URL** — **Severity: non-blocking**
      Context: §4.3/§10 — the real Rodeo Results App URL behind `tinyurl.com/SnookSummerSeriesPoints` is unconfirmed, and whether an embed is available.
      Options: (a) `results.ts` mode `'link'` with a branded outbound button to the resolved URL once confirmed; (b) `'embed'` if the app supports it.
      Recommendation: **(a) link mode** with a placeholder destination + descriptive text until the owner confirms the canonical URL/embed; never show the tinyurl as visible text regardless.

- [ ] **Snook vs Somerville canonical city** — **Severity: blocking for launch (PRE-LAUNCH GATE), non-blocking for build**
      Context: §7 hard pre-launch gate — brand uses "Snook," postal city is Somerville, TX 77874. Must resolve before schema/GBP/citations finalize.
      Options: (a) interim rule — Somerville, TX 77874 authoritative NAP locality, "Snook" = brand/venue name only; (b) owner confirms otherwise.
      Recommendation: **(a)** — encode Somerville as the authoritative locality in `businessInfo.ts`/`venues.ts`; flag the gate in the client checklist; do not launch schema/GBP until owner confirms.

- [ ] **Sponsor logo links + display permission** — **Severity: non-blocking**
      Context: §10 item 2 — sponsor logo assets at high fidelity and permission to display each sponsor's name/logo/contact are owner-pending; PRD doesn't specify whether logos link out.
      Options: (a) support an optional `url` per sponsor, render the logo/name as a link when present; (b) text-only until logos/permission supplied.
      Recommendation: **(a)** — `Sponsor.url` optional, link when present; render name + contact as text now (always allowed), swap in high-fidelity logos when supplied. Permission flagged in the client checklist.

- [ ] **Entry fees → schema `priceRange`** — **Severity: non-blocking**
      Context: §7/§10 item 8 — class prices are flyer-transcribed; whether to add `priceRange` to business schema depends on confirmed entry-fee/payout process.
      Options: (a) omit `priceRange` until confirmed; (b) include from transcribed class prices.
      Recommendation: **(a) omit** until owner confirms the entry/fee process (PRD §1 non-goal: no payment processing v1).

- [ ] **"a upbeat" mission correction** — **Severity: non-blocking**
      Context: §4.4 — render mission verbatim ("a upbeat") unless owner approves "an upbeat."
      Options: (a) verbatim now, owner-approval flag in `businessInfo.ts` flips to corrected text; (b) correct silently (disallowed).
      Recommendation: **(a)** — `businessInfo.missionApproved: false` → render verbatim; flag for owner approval in the checklist.

---

## H. Verification (required)

- [x] Every PRD section appears in the PRD Traceability table (§B)
- [x] Every component entry has responsibilities, data needs, design tokens, acceptance criteria, and dependencies (§C)
- [x] Varying content is identified as typed data files, not hardcoded (§D — events/venues/businessInfo/results/sponsorTiers/sponsors/nav/seo)
- [x] Build order lists structural/shared components before dependents; each single-invocation-sized (§E)
- [x] `DEPENDENCIES.md` written at project root with justified feature packages + single npm install command
- [x] No infrastructure packages relisted as feature dependencies (Vite/React/TS/Tailwind/oxlint/prettier excluded)
- [x] Gaps & Open Questions present, severities marked (§G)
- [x] Sources cited: PRD `ai-docs/prd/smokin-guns-productions.md`; conventions `ai-docs/conventions/CONVENTIONS.md`; tokens `src/index.css`
