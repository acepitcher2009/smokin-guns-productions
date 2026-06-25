import type { EventAttributes } from 'ics';

import type { SeasonEvent } from '../data/events';
import { venues } from '../data/venues';

/**
 * Pure builder for the ics attribute list of one SeasonEvent.
 * Kept in its own module (not the component file) so the component file only
 * exports a component (react/only-export-components) and so the contract —
 * a correct AM/PM-aware attribute list with the right times and venue — is
 * unit-testable independent of how the browser triggers the download.
 *
 * Snook series / jackpot dates run both an A.M. and a P.M. race; those emit
 * TWO EventAttributes (so importing the single .ics adds both VEVENTs) — the
 * A.M. race at the morning time encoded in event.startDate (11:00am or
 * 10:15am), the P.M. race rewritten to 6:00pm. This mirrors EventJsonLd's
 * 18:00 P.M. mapping exactly (story 7) so the two components stay consistent.
 * All values (title, times, venue location) come from src/data/.
 */

/** Build an ics `start` tuple [year, month, day, hour, minute] from an ISO date + an HH:MM. */
function startTuple(isoStartDate: string, hour: number, minute: number): EventAttributes['start'] {
  const [datePart] = isoStartDate.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  return [y, m, d, hour, minute];
}

/** Full venue address line resolved from venues.ts — never a hardcoded address. */
function locationString(event: SeasonEvent): string {
  const v = venues[event.venueId];
  return `${v.name}, ${v.streetAddress}, ${v.city}, ${v.state} ${v.zip}`;
}

/**
 * Returns one or more ics EventAttributes for the given event:
 * - Snook series / jackpot (both amRace and pmRace) → two attrs (A.M. + 6:00pm P.M.).
 * - Everything else → a single attr from startDate.
 */
export function buildIcsAttributes(event: SeasonEvent): EventAttributes[] {
  const location = locationString(event);

  // Emit the wall-clock race time as-is (floating/local) so an 11:00am race
  // shows as 11:00am in every importer — never shifted by the viewer's tz.
  const startOutputType = 'local' as const;

  if (event.amRace && event.pmRace) {
    // A.M. race — startDate already carries the morning time (11:00am or 10:15am).
    const [, time] = event.startDate.split('T');
    const [amH, amM] = (time ?? '00:00').split(':').map(Number);
    return [
      {
        title: `${event.title} (A.M. Section)`,
        start: startTuple(event.startDate, amH, amM),
        startOutputType,
        duration: { hours: 2 },
        location,
      },
      {
        // P.M. race at 6:00pm (mirrors EventJsonLd's 18:00 P.M. mapping).
        title: `${event.title} (P.M. Section)`,
        start: startTuple(event.startDate, 18, 0),
        startOutputType,
        duration: { hours: 2 },
        location,
      },
    ];
  }

  // Single race — read any time encoded in startDate, defaulting to 9:00am for date-only entries.
  const [, time] = event.startDate.split('T');
  const [h, m] = (time ?? '09:00').split(':').map(Number);
  return [
    {
      title: event.title,
      start: startTuple(event.startDate, h || 9, m || 0),
      startOutputType,
      duration: { hours: 2 },
      location,
    },
  ];
}
