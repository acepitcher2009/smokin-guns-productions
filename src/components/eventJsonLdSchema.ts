import { businessInfo } from '../data/businessInfo';
import type { SeasonEvent } from '../data/events';
import { venues } from '../data/venues';

/**
 * Builds the schema.org/Event JSON-LD object(s) for one SeasonEvent.
 * Kept in its own module (not the component file) so the component file only
 * exports a component (react-refresh/only-export-components) and so the
 * contract — valid, correctly shaped Event JSON-LD — is unit-testable
 * independent of how react-helmet-async injects the <script> into the head.
 * All values (name, date, venue, organizer) come from src/data/.
 *
 * Snook series / jackpot dates run both an A.M. and a P.M. race; those emit
 * TWO sibling Event blocks — the A.M. block at the morning time encoded in
 * event.startDate (11:00am or 10:15am), the P.M. block rewritten to 6:00pm —
 * so the two distinct schedules are expressed, never collapsed (PRD §7).
 */

/** Replace the time portion of an ISO startDate, e.g. set the PM race to 18:00. */
function withTime(isoStartDate: string, hhmm: string): string {
  const [datePart, timePart] = isoStartDate.split('T');
  // Preserve the event's timezone offset (e.g. '-05:00') when one is present.
  const offset = timePart && timePart.length > 5 ? timePart.slice(8) : '-05:00';
  return `${datePart}T${hhmm}:00${offset}`;
}

function buildEvent(event: SeasonEvent, name: string, startDate: string): Record<string, unknown> {
  const venue = venues[event.venueId];

  const location: Record<string, unknown> = {
    '@type': 'Place',
    name: venue.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.streetAddress,
      addressLocality: venue.city,
      addressRegion: venue.state,
      postalCode: venue.zip,
      addressCountry: 'US',
    },
  };

  // Emit geo only when coordinates are known (PRD §10 item 7).
  if (venue.geo) {
    location.geo = {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.lat,
      longitude: venue.geo.lng,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: businessInfo.legalName,
      url: businessInfo.url,
    },
    location,
  };
}

/**
 * Returns one or more Event JSON-LD blocks for the given event:
 * - Snook series / jackpot (both amRace and pmRace) → two blocks (A.M. + 6:00pm P.M.).
 * - Everything else → a single block from startDate.
 */
export function buildEventJsonLd(event: SeasonEvent): Record<string, unknown>[] {
  const dateLabel = new Date(event.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago',
  });

  if (event.amRace && event.pmRace) {
    // Snook series / jackpot — two distinct races; preserve both times.
    // The A.M. start time is already encoded in event.startDate (11:00am or 10:15am).
    return [
      buildEvent(event, `${event.title} (A.M. Section) — ${dateLabel}`, event.startDate),
      // P.M. race at 6:00pm.
      buildEvent(event, `${event.title} (P.M. Section) — ${dateLabel}`, withTime(event.startDate, '18:00')),
    ];
  }

  return [buildEvent(event, `${event.title} — ${dateLabel}`, event.startDate)];
}
