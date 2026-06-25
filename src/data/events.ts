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
  nominations:
    '$20 per horse/rider combo per class — not mandatory; the more that nominate, the larger the payout',
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
  ageGroups: ['Pee Wee 0–6', '7–9', '10–12', '13–15', '16–18', '19 & over – Senior'],
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
  {
    id: 'dayshow-2026-01-03',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-01-03',
    venueId: 'magnolia',
  },
  {
    id: 'dayshow-2026-02-21',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-02-21',
    venueId: 'magnolia',
  },
  {
    id: 'dayshow-2026-04-11',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-04-11',
    venueId: 'magnolia',
  },
  {
    id: 'dayshow-2026-06-20',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-06-20',
    venueId: 'snook',
  },
  {
    id: 'dayshow-2026-07-17',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-07-17',
    venueId: 'magnolia',
  },
  {
    id: 'dayshow-2026-08-21',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-08-21',
    venueId: 'snook',
  },
  {
    id: 'dayshow-2026-10-17',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-10-17',
    venueId: 'snook',
  },
  {
    id: 'dayshow-2026-11-07',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-11-07',
    venueId: 'magnolia',
  },
  {
    id: 'dayshow-2026-11-21',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-11-21',
    venueId: 'snook',
  },
  {
    id: 'dayshow-2026-12-05',
    kind: 'dayShow',
    title: 'Day Show',
    startDate: '2026-12-05',
    venueId: 'magnolia',
  },
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

/** Midnight (local) of the given date as epoch ms — so an event dated today still counts as upcoming. */
function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * The season with past events removed (anything before today is dropped; an
 * event dated today still counts), sorted by start date ascending — soonest
 * first. `now` is injectable for deterministic tests.
 */
export function upcomingSeason(now: Date = new Date()): SeasonEvent[] {
  const today = startOfDay(now);
  return season
    .filter((event) => new Date(event.startDate).getTime() >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

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
