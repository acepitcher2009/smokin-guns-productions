import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Events } from './Events';
import { buildEventJsonLd } from '../components/eventJsonLdSchema';
import { season, upcomingSeason } from '../data/events';
import { venues } from '../data/venues';

// Light-tier smoke test: the upcoming 2026 season renders as EventCards (one per
// upcoming event when the filter is "all"), filtering by venue and by kind
// narrows the visible list, an Event JSON-LD script is emitted per upcoming
// event, and the page keeps exactly one <h1>. A fixed `now` BEFORE the season
// starts is injected so the WHOLE season is "upcoming" and the counts are
// deterministic regardless of the real test-run date.
const PRE_SEASON = new Date('2026-01-01T12:00:00-06:00');

function renderEvents() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Events now={PRE_SEASON} />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Events page', () => {
  it('renders exactly one <h1> (the season title)', () => {
    renderEvents();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('2026 Season');
  });

  it('renders an EventCard for the full season when the filter is "all"', () => {
    renderEvents();
    // One card (an <article>) per season event with no active filter (pre-season now).
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(season.length);
    // Representative titles across venues/kinds are present.
    expect(screen.getByText('SNOOK JACKPOT')).toBeInTheDocument();
    expect(screen.getAllByText('Snook Summer Buckle Series').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Magnolia Cowboy Church Playday').length).toBeGreaterThan(0);
  });

  it('filtering by venue narrows the list (Magnolia hides the Snook Jackpot)', async () => {
    const user = userEvent.setup();
    renderEvents();

    await user.selectOptions(screen.getByLabelText('Filter by venue'), venues.magnolia.name);
    expect(screen.queryByText('SNOOK JACKPOT')).not.toBeInTheDocument();
    expect(screen.getAllByText('Magnolia Cowboy Church Playday').length).toBeGreaterThan(0);

    const magnoliaCards = screen.getAllByRole('article');
    expect(magnoliaCards.length).toBeLessThan(season.length);

    // Resetting to all venues restores the full season (Jackpot reappears).
    await user.selectOptions(screen.getByLabelText('Filter by venue'), 'All venues');
    expect(screen.getByText('SNOOK JACKPOT')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(season.length);
  });

  it('filtering by kind narrows the list (Jackpot keeps the Jackpot, drops playdays)', async () => {
    const user = userEvent.setup();
    renderEvents();

    await user.selectOptions(screen.getByLabelText('Filter by type'), 'Jackpot');
    expect(screen.getByText('SNOOK JACKPOT')).toBeInTheDocument();
    expect(screen.queryByText('Magnolia Cowboy Church Playday')).not.toBeInTheDocument();

    const jackpotCount = season.filter((e) => e.kind === 'jackpot').length;
    expect(screen.getAllByRole('article')).toHaveLength(jackpotCount);
  });

  it('mounts an EventJsonLd per event and the whole-season schema is valid Event JSON-LD', () => {
    // react-helmet-async's <script> injection is not observable via document.head in
    // this jsdom harness (see EventJsonLd.test.tsx), so — matching that established
    // contract — we assert the page renders the whole season's JSON-LD without
    // crashing and that the builder yields a valid @type "Event" block per event
    // (AM/PM Snook cards yield two), proving the schema covers the full season.
    expect(() => renderEvents()).not.toThrow();

    let eventBlockCount = 0;
    for (const event of season) {
      const blocks = JSON.parse(JSON.stringify(buildEventJsonLd(event)));
      expect(blocks.length).toBeGreaterThanOrEqual(1);
      for (const block of blocks) {
        expect(block['@type']).toBe('Event');
        eventBlockCount += 1;
      }
    }
    // At least one Event block per season event (Snook AM/PM cards emit two).
    expect(eventBlockCount).toBeGreaterThanOrEqual(season.length);
  });

  it('renders the SNOOK JACKPOT card with a Register CTA', () => {
    renderEvents();
    const heading = screen.getByText('SNOOK JACKPOT');
    const card = heading.closest('article');
    expect(card).not.toBeNull();
    expect(within(card as HTMLElement).getByRole('link', { name: 'Register' })).toBeInTheDocument();
  });

  it('drops past events partway through the season (the Snook Jackpot is gone after its date)', () => {
    // Snook Jackpot is 2026-06-20; render with a "now" after it.
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Events now={new Date('2026-07-01T12:00:00-05:00')} />
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(screen.queryByText('SNOOK JACKPOT')).not.toBeInTheDocument();
    // A later event (an August playday) is still shown.
    expect(screen.getAllByText('Magnolia Cowboy Church Playday').length).toBeGreaterThan(0);
  });
});

describe('upcomingSeason()', () => {
  it('removes events before "now" and keeps same-day events', () => {
    const now = new Date('2026-06-20T08:00:00-05:00'); // Snook Jackpot day
    const ids = upcomingSeason(now).map((e) => e.id);
    expect(ids).not.toContain('snook-series-2026-06-13'); // before now → dropped
    expect(ids).toContain('snook-jackpot-2026-06-20'); // same day → kept
    expect(ids).toContain('magnolia-playday-2026-08-29'); // later → kept
  });

  it('returns events sorted by start date ascending (soonest first)', () => {
    const ordered = upcomingSeason(new Date('2026-01-01T00:00:00-06:00'));
    const times = ordered.map((e) => new Date(e.startDate).getTime());
    const sorted = [...times].sort((a, b) => a - b);
    expect(times).toEqual(sorted);
  });
});
