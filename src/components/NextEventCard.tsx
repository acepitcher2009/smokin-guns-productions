import { Link } from 'react-router-dom';

import { EventCard } from './EventCard';
import { season } from '../data/events';
import type { SeasonEvent } from '../data/events';

/** Midnight (local) of the given date, as epoch ms — so an event dated today still counts as upcoming. */
function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Soonest event whose start date is today or later; null when the season has ended. */
function getNextEvent(now: Date): SeasonEvent | null {
  const today = startOfDay(now);
  const upcoming = season
    .filter((event) => new Date(event.startDate).getTime() >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return upcoming[0] ?? null;
}

export function NextEventCard() {
  const next = getNextEvent(new Date());

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Next Event</h2>

      {next ? (
        <>
          <EventCard event={next} tone="white" />
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/events" className="font-sans text-base text-brand-red underline">
              View all events
            </Link>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-sans text-base text-ink">
            The 2026 season has wrapped &mdash; check back soon for next year&rsquo;s schedule.
          </p>
          <Link to="/events" className="font-sans text-base text-brand-red underline">
            View all events
          </Link>
        </div>
      )}
    </div>
  );
}
