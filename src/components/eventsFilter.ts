import type { EventKind } from '../data/events';
import type { VenueId } from '../data/venues';

/** Filter values for the EventsFilterBar — venue id / event kind, or the 'all' sentinel. */
export type VenueFilter = VenueId | 'all';
export type KindFilter = EventKind | 'all';

/** Human-readable labels for each event kind (the only place kinds map to copy). */
export const kindLabels: Record<EventKind, string> = {
  series: 'Series',
  jackpot: 'Jackpot',
  dayShow: 'Day Shows',
  shootout: 'Shootout Qualifier / Finals',
  playday: 'Playdays',
};
