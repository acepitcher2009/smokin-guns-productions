# Component Build Story — Data Files (all eight `src/data/*.ts`)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§D Editable Data Files; §E Build Order #1)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: Data files — `nav.ts`, `businessInfo.ts`, `venues.ts`, `events.ts`, `results.ts`, `sponsorTiers.ts`, `sponsors.ts`, `seo.ts`
- Build-order position: `1`
- Test tier: `light`

---

## A. Story Summary (required)

As the site owner, I need every piece of varying content (event times/classes/prices, venue NAP, business NAP/hours/mission, results link, sponsorship tiers, sponsor list, nav items, and per-page SEO copy) authored as typed, editable data files in `src/data/`, so that I can update dates, prices, sponsors, and meta copy without touching component markup, and so every downstream component imports a single source of truth.

---

## B. Background / Context (required)

This is build-order step 1 — the foundation every other component reads from. Per PRD §6 ("content in data files") and CONVENTIONS.md §D ("Content / markup separation rule: no hardcoded times, prices, class names, NAP, or sponsor data inside JSX"), all preserved content (the PRD's 28 items) lives here, transcribed **exactly** from the PRD. No component built later may hardcode any of these values. There are **no prior stories** — this story has no component dependencies and depends only on PRD content.

Critical rule for this story: **obscured / unconfirmed values are explicit `TBC` placeholders, never guessed** (PRD §10; plan §G). Where the PRD marks a value owner-confirm, the field exists in the typed shape with a clearly-marked TBC string and a `// TODO(owner-confirm):` comment so the owner can fill the blank without a code change.

---

## C. Acceptance Criteria (required)

Eight files exist under `src/data/`, each with a PascalCase singular exported **type** and a lowerCamelCase exported **constant** (CONVENTIONS.md §D naming rule), `no any`, precise unions over `string` (CONVENTIONS.md §C).

1. **`nav.ts`** — exports `type NavItem` and `const nav: NavItem[]` with exactly six items in left-to-right order: Home `/`, Events `/events`, Results & Standings `/results`, About `/about`, Sponsors `/sponsors`, Contact / Location `/contact` (PRD §3 nav).
2. **`businessInfo.ts`** — exports `type BusinessInfo` and `const businessInfo`. NAP locality is **Somerville** (authoritative; "Snook" is brand/venue name only — PRD §7 pre-launch gate). Carries name, NAP (Snook Rodeo Arena, 11538 FM 3058, Somerville, TX 77874), phone `832-857-2826`, email `smokingunsproductions@gmail.com`, hours, url, `missionVerbatim` (exact, including "a upbeat"), `missionApproved: false`, and contact intro copy — all verbatim from the PRD.
3. **`venues.ts`** — exports `type VenueId = 'snook' | 'magnolia' | 'waller'`, `type Venue`, `const venues: Record<VenueId, Venue>`. Snook + Magnolia addresses exact; Waller street `TBC`; geo `null` for all three (PRD §10 items 5, 7).
4. **`events.ts`** — exports `type EventKind`, `type EventClass`, `type SeasonEvent`, `const season: SeasonEvent[]`, `const seriesInfo`. Contains the **full 2026 season** with exact AM/PM times and number ranges (the two distinct morning schedules), the May 23 series date, the June 20 Snook Jackpot (also series rain date), the Day Shows list, the Waller Shootout Qualifier & Finals, the Pick Your Poison Playday, and the three Magnolia playdays. Buckle-series detail block (schedule / pre-entries / nominations / classes+pricing / rules) and `seriesInfo` (22 Champion Buckles, categories, AM Section note, "Upcoming Events") present. Obscured prices (Leadline, office fee, Venmo handle, full Silver list, playday details) are `TBC`.
5. **`results.ts`** — exports `type ResultsSource` and `const results` with `label: 'Series Points — Rodeo Results App'`, `destinationUrl` as a TBC placeholder (the tinyurl is **never** the visible label), optional `embedUrl`, `mode: 'link'` (PRD §4.3, §10 item 10).
6. **`sponsorTiers.ts`** — exports `type SponsorTier` and `const sponsorTiers: SponsorTier[]` with Platinum $5,000 / Gold $1,500 / Silver $1,000 and benefit lists per PRD §4.5; the obscured lower Silver benefits flagged TBC.
7. **`sponsors.ts`** — exports `type Sponsor` and `const sponsors: Sponsor[]` with the 8 named sponsors and their captured contact info (PRD §4.5 / item 22), optional `url` / `logo`.
8. **`seo.ts`** — exports `type PageKey`, `type PageSeo`, `const seo: Record<PageKey, PageSeo>` with the exact PRD §7 title/description strings, **single-encoded** clean apostrophes (fixes the `&amp;#39;` bug), plus og fields + `canonicalPath`.
9. **Token-cleanliness:** these are data files (no JSX), so there are **no** color/spacing/font-size values at all — purely typed content. (The anti-drift rule applies to the consuming components, not here.)
10. `npm run typecheck` passes with zero errors; `npm run format` leaves the files unchanged (Prettier-clean per CONVENTIONS.md §B).

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§C Component Structure** — `No any`; prefer precise unions (`type EventKind = 'series' | 'jackpot' | 'dayShow' | 'shootout' | 'playday'`) over `string`; shared/domain types live with their data file in `src/data/` and are imported by components.
- **§D File Organization** — files in `src/data/`; **lowerCamelCase filename**, **PascalCase singular exported type**, **lowerCamelCase exported data constant**. Content / markup separation: exact preserved values (times, prices, class names, NAP) live **only** here.
- **§B Code Style** — semicolons; single quotes in TS; `es5` trailing commas; 2-space indent; 100-char width; import groups (external → internal → assets). Run `npm run format`.

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/data/nav.ts` | create | Six primary nav items with clean-URL paths |
| `src/data/businessInfo.ts` | create | Business NAP, phone, email, hours, url, mission (verbatim + approval flag), contact intro |
| `src/data/venues.ts` | create | Per-venue NAP + geo for snook / magnolia / waller |
| `src/data/events.ts` | create | Full 2026 season + series detail + `seriesInfo` metadata |
| `src/data/results.ts` | create | Rodeo Results App destination config (link mode) |
| `src/data/sponsorTiers.ts` | create | Three sponsorship tiers + benefit lists |
| `src/data/sponsors.ts` | create | Eight named sponsors + contact info |
| `src/data/seo.ts` | create | Per-page meta (title/description/og/canonical) |

No composition edit: data files are imported by later components; nothing wires into `src/App.tsx` here. (The router shell that consumes `nav.ts`/`seo.ts` is story 2.)

### E.2 / E.3 Data file content (the deliverable)

> Transcribe **exactly** from the PRD. Any value the PRD marks owner-confirm / obscured is a TBC string with a `// TODO(owner-confirm):` comment — never a guess.

**`src/data/nav.ts`**

```ts
export interface NavItem {
  label: string;
  path: string;
}

export const nav: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'Results & Standings', path: '/results' },
  { label: 'About', path: '/about' },
  { label: 'Sponsors', path: '/sponsors' },
  { label: 'Contact / Location', path: '/contact' },
];
```

**`src/data/businessInfo.ts`** (PRD §4.4, §4.6, §7 local-SEO block, §8 items 1/4/27)

```ts
export interface BusinessHours {
  weekdays: string; // Mon–Fri
  weekend: string; // Sat–Sun
  holidays: string;
}

export interface BusinessInfo {
  legalName: string;
  /** Authoritative postal locality is Somerville; "Snook" is brand/venue name only (PRD §7 gate). */
  venueName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  phone: string; // human-readable
  phoneHref: string; // tel: digits
  email: string;
  url: string;
  hours: BusinessHours;
  /** Rendered verbatim ("a upbeat") until owner approves the correction (PRD §4.4). */
  missionVerbatim: string;
  /** When true, a corrected mission ("an upbeat") may be shown. Default false. */
  missionApproved: boolean;
  contactIntro: string;
}

export const businessInfo: BusinessInfo = {
  legalName: "Smokin' Guns Productions LLC",
  venueName: 'Snook Rodeo Arena',
  streetAddress: '11538 FM 3058',
  city: 'Somerville',
  state: 'TX',
  zip: '77874',
  phone: '832-857-2826',
  phoneHref: 'tel:8328572826',
  email: 'smokingunsproductions@gmail.com',
  url: 'https://smokingunsproductions.com/',
  hours: {
    weekdays: 'Mon–Fri 9:00am–5:00pm',
    weekend: 'Sat–Sun closed',
    holidays: 'Closed major holidays unless events are scheduled',
  },
  missionVerbatim:
    "At Smokin' Guns Productions, we are dedicated to promoting barrel racing and pole bending events with good ground, great payout and a upbeat professional attitude. Our goal is to provide a fun and competitive environment for all levels of equine enthusiasts.",
  missionApproved: false,
  contactIntro:
    "Better yet, see us in person! We love our competitors, spectators & sponsors. We definitely couldn't do it without your support! Ask about our 2026 Sponsorship Opportunity.",
};
```

**`src/data/venues.ts`** (PRD §7 venue block; geo + Waller street TBC per §10 items 5/7)

```ts
export type VenueId = 'snook' | 'magnolia' | 'waller';

export interface VenueGeo {
  lat: number;
  lng: number;
}

export interface Venue {
  name: string;
  streetAddress: string; // 'TBC' where unconfirmed
  city: string;
  state: string;
  zip: string;
  /** null until geocoded/owner-confirmed; JSON-LD omits geo when null (PRD §10 item 7). */
  geo: VenueGeo | null;
}

export const venues: Record<VenueId, Venue> = {
  snook: {
    name: 'Snook Rodeo Arena',
    streetAddress: '11538 FM 3058',
    city: 'Somerville',
    state: 'TX',
    zip: '77874',
    geo: null, // TODO(owner-confirm): latitude/longitude (PRD §10 item 7)
  },
  magnolia: {
    name: 'Magnolia Cowboy Church',
    streetAddress: '2360 Dobbin Hufsmith Rd',
    city: 'Magnolia',
    state: 'TX',
    zip: '77354',
    geo: null, // TODO(owner-confirm): latitude/longitude (PRD §10 item 7)
  },
  waller: {
    name: 'Waller Co. Fairgrounds',
    streetAddress: 'TBC', // TODO(owner-confirm): exact street address (PRD §10 item 5)
    city: 'Waller',
    state: 'TX',
    zip: 'TBC', // TODO(owner-confirm): zip (PRD §10 item 5)
    geo: null, // TODO(owner-confirm): latitude/longitude (PRD §10 item 7)
  },
};
```

**`src/data/events.ts`** (PRD §4.2 A/B/C/D, §7 Event block, §8 items 6–11/23–26/28)

The shape supports: AM/PM exhibition windows, AM/PM race start times, rider-number ranges, optional per-event classes, an optional series-detail block (re-authored buckle-series flyer), playday-detail block, rain date, and notes. Times/ranges are **strings transcribed exactly** (do not normalize "9:30–10:45am").

```ts
import type { VenueId } from './venues';

export type EventKind = 'series' | 'jackpot' | 'dayShow' | 'shootout' | 'playday';

export interface EventClass {
  name: string;
  /** Exact price string, or 'TBC' where the flyer value is obscured (PRD §10 item 3). */
  price: string;
}

export interface SeriesSchedule {
  books: string;
  exhibitions: string;
  race: string;
}

export interface PreEntryRules {
  window: string;
  contact: string;
  officeFee: string; // 'TBC' Venmo amount/handle obscured (PRD §10 item 3)
  walkUps: string;
}

export interface BuckleSeriesDetail {
  schedule: SeriesSchedule;
  preEntries: PreEntryRules;
  nominations: string;
  classes: EventClass[];
  rules: string[];
}

export interface PlaydayDetail {
  ageGroups: string[];
  classes: EventClass[]; // best-effort; owner-confirm (PRD §10 item 3)
  processingFee: string;
  orderOfEvents: string[];
  preEntries: string;
  awards: string;
  payout: string;
}

export interface SeasonEvent {
  id: string;
  kind: EventKind;
  title: string;
  /** ISO 8601 start (with AM race time where applicable), e.g. '2026-05-30T11:00:00-05:00'. */
  startDate: string;
  venueId: VenueId;
  amExhibitions?: string;
  amRace?: string;
  amRange?: string;
  pmExhibitions?: string;
  pmRace?: string;
  pmRange?: string;
  classes?: EventClass[];
  seriesDetail?: BuckleSeriesDetail;
  playdayDetail?: PlaydayDetail;
  rainDate?: string;
  notes?: string;
}

// Shared buckle-series detail (PRD §4.2 B / item 24). TBC values are owner-confirm, never guessed.
const buckleSeriesDetail: BuckleSeriesDetail = {
  schedule: {
    books: 'Books open 3:30pm',
    exhibitions: 'Exhibitions 3:30pm–5:45pm',
    race: 'Race starts 6:00pm',
  },
  preEntries: {
    window: 'Open each Wednesday before the race @ 10am, close Friday at 6pm',
    contact: 'TEXT 832-857-2826',
    // $10 non-refundable office fee via Venmo; handle obscured on the flyer.
    officeFee: '$10 non-refundable office fee via Venmo (handle TBC)', // TODO(owner-confirm): Venmo handle (PRD §10 item 3)
    walkUps: 'Walk-up entries welcome',
  },
  nominations: '$20 per horse/rider combo per class — not mandatory; the more that nominate, the larger the payout',
  classes: [
    { name: '5D Open', price: '$50' },
    { name: '3D Youth', price: '$30' },
    { name: '2D PeeWee', price: '$20' },
    { name: '3D Rookie', price: '$25' },
    { name: '3D Senior', price: '$25' },
    { name: '3D Novice Horse', price: '$25' },
    { name: 'High Stakes', price: '$75' },
    { name: 'Leadline', price: 'TBC' }, // TODO(owner-confirm): Leadline price (PRD §10 item 3)
    { name: 'Office fee', price: 'TBC' }, // TODO(owner-confirm): office-fee amount (PRD §10 item 3)
  ],
  rules: ['Negative Coggins Required', 'Cash Only'],
};

// Shared Magnolia playday detail (PRD §4.2 D / item 25). Best-effort; owner-confirm.
const magnoliaPlaydayDetail: PlaydayDetail = {
  ageGroups: [
    'Pee Wee 0–6',
    '7–9',
    '10–12',
    '13–15',
    '16–18',
    '19 & over – Senior',
  ],
  classes: [
    { name: 'Poles', price: '$10' },
    { name: 'Speed', price: '$10' },
    { name: 'Barrels', price: '$10' },
    { name: 'Exhibitions', price: '$5' },
  ],
  processingFee: '$10 processing fee per rider',
  orderOfEvents: [
    'Books open 4:30pm',
    'Exhibition Poles 4:30–4:45',
    'Poles',
    'Speed',
    'Exhibition Barrels',
    'Barrels',
  ],
  preEntries:
    'Pre-entries open Sunday (text 832-857-2826); walk-ups welcome; fees paid day of show; cash only', // TODO(owner-confirm): exact playday format/age-splits/prices/payout (PRD §10 item 3)
  awards: 'Hi Point & Res. Hi Point awards per age group',
  payout: '50% payout',
};

export const season: SeasonEvent[] = [
  // --- Snook Summer Buckle Series (PRD §4.2 A/B; items 7–10, 23, 24, 26) ---
  {
    id: 'snook-series-2026-05-23',
    kind: 'series',
    title: 'Snook Summer Buckle Series',
    startDate: '2026-05-23T11:00:00-05:00', // flyer-listed fifth series date (PRD §4.2 B)
    venueId: 'snook',
    amExhibitions: '9:30–10:45am', // TODO(owner-confirm): May 23 AM window not on the four cards (PRD §10 item 9)
    amRace: '11:00am',
    amRange: '#1–200',
    pmExhibitions: '3:30–5:45pm',
    pmRace: '6:00pm',
    pmRange: '#201–end',
    seriesDetail: buckleSeriesDetail,
    notes: 'Series date listed on the buckle-series flyer (omitted from the four event cards).',
  },
  {
    id: 'snook-series-2026-05-30',
    kind: 'series',
    title: 'Snook Summer Buckle Series',
    startDate: '2026-05-30T11:00:00-05:00',
    venueId: 'snook',
    amExhibitions: '9:30–10:45am',
    amRace: '11:00am',
    amRange: '#1–200',
    pmExhibitions: '3:30–5:45pm',
    pmRace: '6:00pm',
    pmRange: '#201–end',
    seriesDetail: buckleSeriesDetail,
  },
  {
    id: 'snook-series-2026-06-06',
    kind: 'series',
    title: 'Snook Summer Buckle Series',
    startDate: '2026-06-06T11:00:00-05:00',
    venueId: 'snook',
    amExhibitions: '9:30–10:45am',
    amRace: '11:00am',
    amRange: '#1–200',
    pmExhibitions: '3:30–5:45pm',
    pmRace: '6:00pm',
    pmRange: '#201–end',
    seriesDetail: buckleSeriesDetail,
  },
  {
    id: 'snook-series-2026-06-13',
    kind: 'series',
    title: 'Snook Summer Buckle Series',
    startDate: '2026-06-13T10:15:00-05:00',
    venueId: 'snook',
    amExhibitions: '9:00–10:00am',
    amRace: '10:15am',
    amRange: '#1–200',
    pmExhibitions: '3:30–5:45pm',
    pmRace: '6:00pm',
    pmRange: '#201–end',
    seriesDetail: buckleSeriesDetail,
  },
  // --- Snook Jackpot (PRD §4.2 A card #4; item 10). June 20 is ALSO the series rain date. ---
  {
    id: 'snook-jackpot-2026-06-20',
    kind: 'jackpot',
    title: 'SNOOK JACKPOT',
    startDate: '2026-06-20T10:15:00-05:00',
    venueId: 'snook',
    amExhibitions: '9:00–10:00am',
    amRace: '10:15am',
    amRange: '#1–200',
    pmExhibitions: '3:30–5:45pm',
    pmRace: '6:00pm',
    pmRange: '#201–end',
    notes: 'June 20 is also the Snook Summer Buckle Series rain date.',
  },
  // --- Day Shows (PRD §4.2 C; full list owner-confirm per §10 item 4) ---
  // TODO(owner-confirm): full Day Shows date list + start times (PRD §10 item 4)
  { id: 'dayshow-2026-01-03', kind: 'dayShow', title: 'Day Show', startDate: '2026-01-03', venueId: 'magnolia' },
  { id: 'dayshow-2026-02-21', kind: 'dayShow', title: 'Day Show', startDate: '2026-02-21', venueId: 'magnolia' },
  { id: 'dayshow-2026-04-11', kind: 'dayShow', title: 'Day Show', startDate: '2026-04-11', venueId: 'magnolia' },
  { id: 'dayshow-2026-06-20', kind: 'dayShow', title: 'Day Show', startDate: '2026-06-20', venueId: 'snook' },
  { id: 'dayshow-2026-07-17', kind: 'dayShow', title: 'Day Show', startDate: '2026-07-17', venueId: 'magnolia' },
  { id: 'dayshow-2026-08-21', kind: 'dayShow', title: 'Day Show', startDate: '2026-08-21', venueId: 'snook' },
  { id: 'dayshow-2026-10-17', kind: 'dayShow', title: 'Day Show', startDate: '2026-10-17', venueId: 'snook' },
  { id: 'dayshow-2026-11-07', kind: 'dayShow', title: 'Day Show', startDate: '2026-11-07', venueId: 'magnolia' },
  { id: 'dayshow-2026-11-21', kind: 'dayShow', title: 'Day Show', startDate: '2026-11-21', venueId: 'snook' },
  { id: 'dayshow-2026-12-05', kind: 'dayShow', title: 'Day Show', startDate: '2026-12-05', venueId: 'magnolia' },
  // --- Waller Co. Fairgrounds Shootout Qualifier & Finals (PRD §4.2 C; item 23) ---
  {
    id: 'waller-shootout-qualifier-2026-03',
    kind: 'shootout',
    title: 'Shootout Qualifier',
    startDate: '2026-03-06', // multi-day Mar 6–8
    venueId: 'waller',
    notes: 'Qualifier — March 6–8, 2026.',
  },
  {
    id: 'waller-shootout-finals-2026-09',
    kind: 'shootout',
    title: 'Shootout Finals',
    startDate: '2026-09-04', // multi-day Sep 4–6
    venueId: 'waller',
    notes: 'Finals — September 4–6, 2026.',
  },
  // --- Pick Your Poison Playday (PRD §4.2 C; item 23) ---
  {
    id: 'pick-your-poison-2026-10-24',
    kind: 'playday',
    title: 'Pick Your Poison Playday',
    startDate: '2026-10-24',
    venueId: 'magnolia',
    rainDate: '2026-10-31',
    notes: 'Rain date October 31, 2026.',
  },
  // --- Three Magnolia Cowboy Church Playdays (PRD §4.2 D; item 25) ---
  {
    id: 'magnolia-playday-2026-06-27',
    kind: 'playday',
    title: 'Magnolia Cowboy Church Playday',
    startDate: '2026-06-27T16:30:00-05:00', // Books open 4:30pm
    venueId: 'magnolia',
    playdayDetail: magnoliaPlaydayDetail,
  },
  {
    id: 'magnolia-playday-2026-07-18',
    kind: 'playday',
    title: 'Magnolia Cowboy Church Playday',
    startDate: '2026-07-18T16:30:00-05:00',
    venueId: 'magnolia',
    playdayDetail: magnoliaPlaydayDetail,
  },
  {
    id: 'magnolia-playday-2026-08-29',
    kind: 'playday',
    title: 'Magnolia Cowboy Church Playday',
    startDate: '2026-08-29T16:30:00-05:00',
    venueId: 'magnolia',
    playdayDetail: magnoliaPlaydayDetail,
  },
];

// Series banner / overview metadata (PRD §4.2; items 11, 28)
export interface SeriesInfo {
  championBucklesLine: string;
  buckleCategories: string[];
  amSectionNote: string;
  upcomingHeading: string;
}

export const seriesInfo: SeriesInfo = {
  championBucklesLine: '22 Champion Buckles',
  buckleCategories: ['Open', 'Youth', 'Rookie', 'PeeWee', 'Senior', 'Adult'],
  amSectionNote: 'A.M. Section Added, Please See Dates And Times Listed Under Flyer.',
  upcomingHeading: 'Upcoming Events',
};
```

> **AM/PM in JSON-LD:** the `EventJsonLd` story (7) is responsible for modeling AM and PM as two `Event`s / `subEvent`s. This file simply carries both `amRace` (11:00am or 10:15am) and `pmRace` (6:00pm) so that component can read them. Do not collapse them here.

**`src/data/results.ts`** (PRD §4.3; item 12; §10 item 10)

```ts
export interface ResultsSource {
  label: string;
  /** Resolved Rodeo Results App URL. Never expose tinyurl as visible text (PRD §4.3). */
  destinationUrl: string;
  embedUrl?: string;
  mode: 'link' | 'embed';
}

export const results: ResultsSource = {
  label: 'Series Points — Rodeo Results App',
  destinationUrl: 'TBC', // TODO(owner-confirm): resolved Rodeo Results App URL behind the tinyurl (PRD §10 item 10)
  mode: 'link',
};
```

**`src/data/sponsorTiers.ts`** (PRD §4.5; item 21)

```ts
export interface SponsorTier {
  name: string;
  price: string;
  benefits: string[];
}

export const sponsorTiers: SponsorTier[] = [
  {
    name: 'Platinum',
    price: '$5,000',
    benefits: [
      '2–4 (4×6) banners displayed at each event',
      'Logo / business on banner & wraps',
      'Social-media recognition',
      'Announcer / press recognition at each event',
      'Logo / business name on show flyers',
      '1-year live-stream coverage',
      'No vendor fee',
    ],
  },
  {
    name: 'Gold',
    price: '$1,500',
    benefits: [
      '2–3 (4×6) banners at each event',
      'Logo / business on banner & wraps',
      'Social-media recognition',
      'Announcer recognition at each event',
      'Logo / business name on show flyer',
      '6-month live-stream coverage',
      'No vendor fee',
    ],
  },
  {
    name: 'Silver',
    price: '$1,000',
    benefits: [
      '1× 4×4 banner displayed at each event',
      'Logo / business on banner & wraps',
      'Social-media recognition',
      'Announcer recognition at each event',
      'Additional benefits — confirm with owner', // TODO(owner-confirm): full Silver benefit list (PRD §10 item 3)
    ],
  },
];
```

**`src/data/sponsors.ts`** (PRD §4.5; item 22)

```ts
export interface Sponsor {
  name: string;
  tagline?: string;
  phone?: string;
  location?: string;
  url?: string;
  logo?: string; // TODO(owner-confirm): high-fidelity logo asset + display permission (PRD §10 item 2)
}

export const sponsors: Sponsor[] = [
  {
    name: 'Teal Services LLC',
    tagline: 'Water and Wastewater Construction / General Contractor',
    phone: '281-467-4407',
    url: 'https://Tealtexas.com',
  },
  {
    name: 'Hay Girl Sales & Deliveries',
    tagline: 'Coastal Squares – Rolls – Alfalfa',
    phone: '281-686-8488',
    location: 'Waller, TX',
  },
  { name: 'Rustic Building Systems', phone: '713-906-4070' },
  { name: "Charlotte's Saddlery", tagline: 'Everything for Riding Except the Horse' },
  { name: 'Lavished Photography' },
  { name: '360 Equine' },
  { name: 'MC Mechanical of Texas LLC' },
  { name: 'The Jaeggi Team', tagline: 'Get Listed. Get Sold.' },
];
```

**`src/data/seo.ts`** (PRD §7 — exact title/description strings, single-encoded apostrophes)

```ts
export type PageKey = 'home' | 'events' | 'results' | 'about' | 'sponsors' | 'contact';

export interface PageSeo {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage: string;
  canonicalPath: string;
}

// og:image must be a real brand image (NOT a wsimg.com blob, PRD §7). Placeholder until supplied.
const ogImage = '/og-default.jpg'; // TODO(owner-confirm): high-fidelity brand OG image (PRD §10 item 1)

export const seo: Record<PageKey, PageSeo> = {
  home: {
    title: "Smokin' Guns Productions — Barrel Racing & Pole Bending Events | Somerville, TX",
    description:
      "Join Smokin' Guns Productions for barrel racing and pole bending events at Snook Rodeo Arena in Somerville, TX. See the 2026 Snook Summer Buckle Series schedule and register today.",
    ogTitle: "WELCOME TO THE HOUSE OF SMOKIN' RUNS!",
    ogImage,
    canonicalPath: '/',
  },
  events: {
    title: "2026 Snook Summer Buckle Series — Barrel Racing Events | Somerville TX",
    description:
      "The full 2026 barrel racing and pole bending season — Snook Summer Buckle Series, Snook Jackpot, day shows, playdays and the Waller Co. Shootout. Exact times, classes and pricing.",
    ogImage,
    canonicalPath: '/events',
  },
  results: {
    title: "Series Points & Standings — Snook Summer Buckle Series | Smokin' Guns Productions",
    description:
      "Series points and standings for the Snook Summer Buckle Series, presented through the Rodeo Results App.",
    ogImage,
    canonicalPath: '/results',
  },
  about: {
    title: "About Smokin' Guns Productions — Barrel Racing & Pole Bending in the Brazos Valley",
    description:
      "Smokin' Guns Productions promotes barrel racing and pole bending events with good ground, great payout and a professional attitude across the Brazos Valley, Texas.",
    ogImage,
    canonicalPath: '/about',
  },
  sponsors: {
    title: "2026 Sponsors & Sponsorship — Smokin' Guns Productions | Somerville TX",
    description:
      "Meet the 2026 sponsors of Smokin' Guns Productions and explore our Platinum, Gold and Silver sponsorship opportunities.",
    ogImage,
    canonicalPath: '/sponsors',
  },
  contact: {
    title: "Contact & Register — Snook Rodeo Arena, Somerville TX | Smokin' Guns Productions",
    description:
      "Contact Smokin' Guns Productions and register for an upcoming barrel racing or pole bending event at Snook Rodeo Arena in Somerville, TX.",
    ogImage,
    canonicalPath: '/contact',
  },
};
```

> **Single-encoding rule (PRD §7 / discard item 5):** write apostrophes as the literal character (`'`) inside JS string literals — never `&#39;` or `&amp;#39;`. React escapes for output exactly once, so the rendered `<title>`/`<meta>` are correct and single-encoded.

### E.4 Design tokens used

None. These are content-only `.ts` files with no JSX and therefore no Tailwind classes, colors, spacing, or font sizes. (Token discipline is enforced in the components that consume this data, not here.)

### E.5 Interactions / behavior

None — static typed exports.

### E.6 Responsive behavior

N/A — no rendering.

### E.7 Accessibility

N/A at the data layer. Note for downstream: the `seo.ts` descriptions are written clean/single-encoded so the rendered head is screen-reader- and crawler-correct; the verbatim mission preserves source text for the About page.

---

## F. Testing Strategy (required — Tier: light)

A single smoke test that the data modules import and carry their key invariants — guards the exact values the rest of the build depends on.

Create `src/data/data.test.ts`:

- `nav` has 6 items and the first path is `'/'` and includes `'/contact'`.
- `businessInfo.phone === '832-857-2826'`, `businessInfo.city === 'Somerville'`, and `missionApproved === false`, and `missionVerbatim` contains the verbatim substring `'a upbeat'`.
- `venues.snook.streetAddress === '11538 FM 3058'` and `venues.waller.geo === null`.
- `season` contains an event with `id === 'snook-jackpot-2026-06-20'` whose `title === 'SNOOK JACKPOT'`, `kind === 'jackpot'`, `amRace === '10:15am'`, and `pmRace === '6:00pm'`; and a `May 30` series event whose `amRace === '11:00am'`.
- `results.label === 'Series Points — Rodeo Results App'` and `results.destinationUrl` does **not** contain `'tinyurl'`.
- `sponsorTiers` has 3 tiers with prices `$5,000 / $1,500 / $1,000`; `sponsors` has 8 entries.
- `seo.home.description` does **not** contain `'&#39;'` or `'&amp;'`.

**Manual check (all tiers):**
1. `npm run typecheck` → zero errors.
2. `npm run test` → the data smoke test passes.
3. `npm run format -- --check src/data` → no formatting diffs.
4. Grep `src/data` for `tinyurl` and `wsimg` → no matches.

---

## G. Definition of Done (required)

- [ ] All eight files created with the exact exported type + constant names from CONVENTIONS.md §D / plan §D.
- [ ] Every value transcribed exactly from the PRD; every obscured/unconfirmed value is a `TBC` string with a `// TODO(owner-confirm)` comment — none guessed.
- [ ] `EventKind` union, `VenueId` union, and `PageKey` union are precise unions (no `string`, no `any`).
- [ ] Full 2026 season present: 4 Snook series cards + May 23 series date + Snook Jackpot + 10 Day Shows + 2 Waller shootouts + Pick Your Poison + 3 Magnolia playdays.
- [ ] `seriesInfo` carries 22 Champion Buckles, 6 categories, AM Section note, and "Upcoming Events".
- [ ] `seo.ts` strings match PRD §7 and are single-encoded (no `&#39;`/`&amp;`).
- [ ] No color/spacing/font-size values exist in any file (content-only).
- [ ] TypeScript: zero new errors; Prettier-clean.
- [ ] Light smoke test present and passing.

---

## H. Dependencies & Blockers (required)

- **Depends on:** nothing — first build step; PRD content only. (`events.ts` imports `type VenueId` from `venues.ts`; author `venues.ts` first or alongside.)
- **Blockers:** None identified. Owner-confirm values (Waller street/zip, all geo, Venmo handle, Leadline/office-fee prices, full Silver benefits, full Day Shows list + times, playday details, resolved Results URL, OG image) are intentionally shipped as marked `TBC` placeholders so the structure is complete and the owner fills blanks without code changes.

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§D, §E #1, §G gaps)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§B, §C, §D)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.2, §4.3, §4.4, §4.5, §4.6, §6, §7, §8, §10)
- Related components that depend on this: App router (`nav.ts`/`seo.ts`), Seo (`seo.ts`), BusinessJsonLd (`businessInfo.ts`/`venues.ts`), EventJsonLd (`events.ts`/`venues.ts`), and all page/section components.
