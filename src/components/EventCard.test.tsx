import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { EventCard } from './EventCard';
import { season } from '../data/events';

function find(id: string) {
  const event = season.find((e) => e.id === id);
  if (!event) throw new Error(`fixture event not found: ${id}`);
  return event;
}

function renderCard(id: string) {
  return render(
    <MemoryRouter>
      <EventCard event={find(id)} />
    </MemoryRouter>
  );
}

describe('EventCard', () => {
  it('renders a Snook series event with its EXACT AM/PM times + number ranges from data', () => {
    renderCard('snook-series-2026-05-30');

    // AM section (events.ts: amRace 11:00am, amRange #1–200)
    expect(screen.getByText(/11:00am/)).toBeInTheDocument();
    expect(screen.getByText(/#1–200/)).toBeInTheDocument();
    // PM section (events.ts: pmRace 6:00pm, pmRange #201–end)
    expect(screen.getByText(/6:00pm/)).toBeInTheDocument();
    expect(screen.getByText(/#201–end/)).toBeInTheDocument();
  });

  it('renders the card-3/4 AM race time from data (10:15am)', () => {
    renderCard('snook-series-2026-06-13');
    expect(screen.getByText(/10:15am/)).toBeInTheDocument();
  });

  it('renders the SNOOK JACKPOT title and a Jackpot badge', () => {
    renderCard('snook-jackpot-2026-06-20');
    expect(screen.getByRole('heading', { name: 'SNOOK JACKPOT' })).toBeInTheDocument();
    expect(screen.getByText('Jackpot')).toBeInTheDocument();
  });

  it('resolves the venue name from venues.ts (Snook)', () => {
    renderCard('snook-series-2026-05-30');
    expect(screen.getByText(/Snook Rodeo Arena/)).toBeInTheDocument();
  });

  it('Register link href is /register?event=<id>', () => {
    renderCard('snook-series-2026-05-30');
    const link = screen.getByRole('link', { name: 'Register' });
    expect(link).toHaveAttribute('href', '/register?event=snook-series-2026-05-30');
  });

  it('renders classes/pricing/rules as selectable text (not an image)', () => {
    renderCard('snook-series-2026-05-30');
    expect(screen.getByText('5D Open')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('Negative Coggins Required')).toBeInTheDocument();
  });

  it('renders an Add to calendar control', () => {
    renderCard('snook-series-2026-05-30');
    expect(screen.getByRole('button', { name: /Add .* to calendar/ })).toBeInTheDocument();
  });

  it('renders a Magnolia playday (venue + playday classes) without crashing', () => {
    renderCard('magnolia-playday-2026-06-27');
    // Venue line (date · venue) resolved from venues.ts, scoped to the <p> so the
    // title heading ("Magnolia Cowboy Church Playday") doesn't ambiguate the match.
    expect(screen.getByText(/· Magnolia Cowboy Church$/, { selector: 'p' })).toBeInTheDocument();
    // "Poles" is a playday class (also appears in the order-of-events list); scope to the class <dt>.
    expect(screen.getByText('Poles', { selector: 'dt' })).toBeInTheDocument();
    expect(screen.getByText('Playday')).toBeInTheDocument();
  });

  it('renders a Day Show (no times/classes) without crashing', () => {
    renderCard('dayshow-2026-01-03');
    expect(screen.getByRole('heading', { name: 'Day Show' })).toBeInTheDocument();
    expect(screen.getByText('Day Show', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
  });
});
