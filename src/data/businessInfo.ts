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
