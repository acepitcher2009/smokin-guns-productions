import { AddToCalendarButton } from './AddToCalendarButton';
import { Button } from './Button';
import type { EventClass, EventKind, SeasonEvent } from '../data/events';
import { venues } from '../data/venues';

interface EventCardProps {
  event: SeasonEvent;
  tone?: 'cream' | 'white';
}

const toneClasses: Record<NonNullable<EventCardProps['tone']>, string> = {
  cream: 'bg-cream-deep',
  white: 'bg-white',
};

const kindLabel: Record<EventKind, string> = {
  series: 'Series',
  jackpot: 'Jackpot',
  dayShow: 'Day Show',
  shootout: 'Shootout',
  playday: 'Playday',
};

// Jackpot uses the pink accent (accent only — never a button); others a neutral badge.
const badgeClasses: Record<EventKind, string> = {
  series: 'bg-cream text-ink',
  jackpot: 'bg-cream text-pink',
  dayShow: 'bg-cream text-ink',
  shootout: 'bg-cream text-ink',
  playday: 'bg-cream text-ink',
};

function ClassList({ classes }: { classes: EventClass[] }) {
  return (
    <dl className="mt-2 grid gap-2 font-sans text-base text-ink md:grid-cols-2">
      {classes.map((c) => (
        <div key={c.name} className="flex justify-between gap-4">
          <dt>{c.name}</dt>
          <dd>{c.price}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EventCard({ event, tone = 'cream' }: EventCardProps) {
  const venue = venues[event.venueId];
  const dateLabel = new Date(event.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago',
  });

  return (
    <article
      className={`rounded-md p-6 shadow-card motion-safe:transition-transform ${toneClasses[tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-3xl uppercase tracking-wide text-ink">{event.title}</h3>
        <span
          className={`shrink-0 rounded-sm px-3 py-1 font-sans text-sm uppercase tracking-wide ${badgeClasses[event.kind]}`}
        >
          {kindLabel[event.kind]}
        </span>
      </div>

      <p className="mt-2 font-sans text-base text-ink">
        {dateLabel} · {venue.name}
      </p>

      {/* Venue street address — shown when known (omitted while 'TBC'). */}
      {venue.streetAddress !== 'TBC' && (
        <address className="mt-1 font-sans text-base not-italic text-ink">
          {venue.streetAddress}
          <br />
          {`${venue.city}, ${venue.state}${venue.zip !== 'TBC' ? ` ${venue.zip}` : ''}`}
        </address>
      )}

      {/* AM / PM time blocks — only rendered when present, all values from events.ts */}
      {(event.amRace || event.pmRace) && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {event.amRace && (
            <div className="font-sans text-base text-ink">
              <h4 className="font-display text-xl uppercase tracking-wide text-ink">A.M. Section</h4>
              {event.amExhibitions && <p>Exhibitions {event.amExhibitions}</p>}
              <p>
                Race {event.amRace} {event.amRange}
              </p>
            </div>
          )}
          {event.pmRace && (
            <div className="font-sans text-base text-ink">
              <h4 className="font-display text-xl uppercase tracking-wide text-ink">P.M. Section</h4>
              {event.pmExhibitions && <p>Exhibitions {event.pmExhibitions}</p>}
              <p>
                Race {event.pmRace} {event.pmRange}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Buckle-series detail as real selectable text */}
      {event.seriesDetail && (
        <div className="mt-4">
          <h4 className="font-display text-xl uppercase tracking-wide text-ink">Classes</h4>
          <ClassList classes={event.seriesDetail.classes} />
          <p className="mt-2 font-sans text-base text-ink">{event.seriesDetail.nominations}</p>
          <ul className="mt-2 font-sans text-base text-ink">
            <li>{event.seriesDetail.preEntries.window}</li>
            <li>{event.seriesDetail.preEntries.contact}</li>
            <li>{event.seriesDetail.preEntries.officeFee}</li>
            <li>{event.seriesDetail.preEntries.walkUps}</li>
            {event.seriesDetail.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Playday detail as real selectable text (age groups, order of events, awards, payout) */}
      {event.playdayDetail && (
        <div className="mt-4">
          <h4 className="font-display text-xl uppercase tracking-wide text-ink">Classes</h4>
          <ClassList classes={event.playdayDetail.classes} />
          <p className="mt-2 font-sans text-base text-ink">{event.playdayDetail.processingFee}</p>
          <h4 className="mt-4 font-display text-xl uppercase tracking-wide text-ink">Age Groups</h4>
          <ul className="mt-2 grid gap-2 font-sans text-base text-ink md:grid-cols-2">
            {event.playdayDetail.ageGroups.map((group) => (
              <li key={group}>{group}</li>
            ))}
          </ul>
          <h4 className="mt-4 font-display text-xl uppercase tracking-wide text-ink">
            Order of Events
          </h4>
          <ul className="mt-2 font-sans text-base text-ink">
            {event.playdayDetail.orderOfEvents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="mt-2 font-sans text-base text-ink">
            <li>{event.playdayDetail.preEntries}</li>
            <li>{event.playdayDetail.awards}</li>
            <li>{event.playdayDetail.payout}</li>
          </ul>
        </div>
      )}

      {/* Standalone classes (e.g. ad-hoc class list with neither series nor playday detail) */}
      {event.classes && !event.seriesDetail && !event.playdayDetail && (
        <ClassList classes={event.classes} />
      )}

      {event.notes && <p className="mt-4 font-sans text-sm text-ink">{event.notes}</p>}

      {/* Actions: single brand-red Register CTA + tertiary add-to-calendar */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button as="link" to={`/register?event=${event.id}`}>
          Register
        </Button>
        <AddToCalendarButton event={event} />
      </div>
    </article>
  );
}
