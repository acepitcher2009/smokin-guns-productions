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
    streetAddress: '23245 Glenmont Estates Blvd', // owner-confirmed
    city: 'Magnolia',
    state: 'TX',
    zip: '77355',
    geo: null, // TODO(owner-confirm): latitude/longitude (PRD §10 item 7)
  },
  waller: {
    name: 'Waller Co. Fairgrounds',
    streetAddress: '21988 FM 359', // owner-confirmed
    city: 'Hempstead',
    state: 'TX',
    zip: '77445',
    geo: null, // TODO(owner-confirm): latitude/longitude (PRD §10 item 7)
  },
};
