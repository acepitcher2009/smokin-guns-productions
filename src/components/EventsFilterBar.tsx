import type { EventKind } from '../data/events';
import { venues } from '../data/venues';
import type { VenueId } from '../data/venues';

import { kindLabels } from './eventsFilter';
import type { KindFilter, VenueFilter } from './eventsFilter';

interface EventsFilterBarProps {
  venue: VenueFilter;
  kind: KindFilter;
  /** The kinds actually present in the season (derived by the page from `season`). */
  availableKinds: EventKind[];
  onVenueChange: (value: VenueFilter) => void;
  onKindChange: (value: KindFilter) => void;
}

const controlClasses =
  'rounded-md bg-cream-deep px-4 py-3 font-sans text-base text-ink ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark';

export function EventsFilterBar({
  venue,
  kind,
  availableKinds,
  onVenueChange,
  onKindChange,
}: EventsFilterBarProps) {
  const venueIds = Object.keys(venues) as VenueId[];

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="venue-filter" className="font-sans text-sm text-ink">
          Filter by venue
        </label>
        <select
          id="venue-filter"
          className={controlClasses}
          value={venue}
          onChange={(e) => onVenueChange(e.target.value as VenueFilter)}
        >
          <option value="all">All venues</option>
          {venueIds.map((id) => (
            <option key={id} value={id}>
              {venues[id].name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="kind-filter" className="font-sans text-sm text-ink">
          Filter by type
        </label>
        <select
          id="kind-filter"
          className={controlClasses}
          value={kind}
          onChange={(e) => onKindChange(e.target.value as KindFilter)}
        >
          <option value="all">All types</option>
          {availableKinds.map((k) => (
            <option key={k} value={k}>
              {kindLabels[k]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
