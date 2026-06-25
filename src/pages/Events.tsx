import { useState } from 'react';

import { AmSectionNote } from '../components/AmSectionNote';
import { BuckleSeriesDetail } from '../components/BuckleSeriesDetail';
import { EventCard } from '../components/EventCard';
import { EventJsonLd } from '../components/EventJsonLd';
import { EventsFilterBar } from '../components/EventsFilterBar';
import type { KindFilter, VenueFilter } from '../components/eventsFilter';
import { SeasonBuckleBanner } from '../components/SeasonBuckleBanner';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

import { upcomingSeason } from '../data/events';
import type { EventKind } from '../data/events';

/**
 * Events page — the upcoming 2026 multi-venue season as filterable EventCards
 * plus machine-readable Event JSON-LD (build-order step 22).
 *
 * Past events are dropped and the rest are ordered soonest-first (see
 * upcomingSeason). The page owns the venue/kind filter state that EventsFilterBar
 * controls and applies it to the rendered card list; the Event JSON-LD blocks map
 * every upcoming event (schema is filter-independent), while the visible cards map
 * the filtered subset. Exactly one <h1> ("2026 Season"); all child headings are
 * <h2>/<h3>/<h4>.
 */
export function Events({ now }: { now?: Date } = {}) {
  const [venue, setVenue] = useState<VenueFilter>('all');
  const [kind, setKind] = useState<KindFilter>('all');

  // Upcoming events only, soonest first (past events removed). `now` is
  // injectable so tests pin the date; production uses the real current date.
  const upcoming = upcomingSeason(now);

  const availableKinds = [...new Set(upcoming.map((event) => event.kind))] as EventKind[];

  const visibleEvents = upcoming.filter((event) => {
    const venueMatch = venue === 'all' || event.venueId === venue;
    const kindMatch = kind === 'all' || event.kind === kind;
    return venueMatch && kindMatch;
  });

  return (
    <>
      <Seo pageKey="events" />
      {/* Event JSON-LD for every upcoming event (schema is filter-independent). */}
      {upcoming.map((event) => (
        <EventJsonLd key={event.id} event={event} />
      ))}

      <SectionBand tone="cream">
        <h1 className="font-display text-5xl uppercase tracking-wide text-ink">2026 Season</h1>
      </SectionBand>

      <SeasonBuckleBanner />

      <SectionBand tone="cream">
        <div className="flex flex-col gap-12">
          <AmSectionNote />
          <EventsFilterBar
            venue={venue}
            kind={kind}
            availableKinds={availableKinds}
            onVenueChange={setVenue}
            onKindChange={setKind}
          />
          <div className="grid gap-8 md:grid-cols-2">
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} tone="white" />
            ))}
          </div>
        </div>
      </SectionBand>

      <BuckleSeriesDetail />
    </>
  );
}
