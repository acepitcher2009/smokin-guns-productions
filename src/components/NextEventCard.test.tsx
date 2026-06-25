import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NextEventCard } from './NextEventCard';

function renderNext() {
  return render(
    <MemoryRouter>
      <NextEventCard />
    </MemoryRouter>
  );
}

describe('NextEventCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('picks the soonest FUTURE event from the data (May 23) when now is before it', () => {
    vi.setSystemTime(new Date('2026-05-01T12:00:00-05:00'));
    renderNext();

    // The soonest event with startDate >= today is the May 23 Snook series date,
    // rendered by EventCard (date label resolved in America/Chicago).
    expect(screen.getByText(/May 23, 2026/)).toBeInTheDocument();
    // Proves selection is data-driven, not hardcoded: exactly one EventCard renders.
    expect(screen.getAllByRole('heading', { name: 'Snook Summer Buckle Series' })).toHaveLength(1);
  });

  it('skips past events: when now is June 7, the next event is the June 13 series date', () => {
    vi.setSystemTime(new Date('2026-06-07T12:00:00-05:00'));
    renderNext();

    // May 23/30 and June 6 are in the past; June 13 is the soonest future date.
    expect(screen.getByText(/June 13, 2026/)).toBeInTheDocument();
    // June 13 has the distinctive 10:15am AM race time from events.ts.
    expect(screen.getByText(/10:15am/)).toBeInTheDocument();
  });

  it('renders the season-ended fallback (and no EventCard) when all events are past', () => {
    vi.setSystemTime(new Date('2027-01-01T12:00:00-05:00'));
    renderNext();

    expect(screen.getByText(/season has wrapped/i)).toBeInTheDocument();
    // No event card means no per-event Register CTA (EventCard renders a "Register" link).
    expect(screen.queryByRole('link', { name: 'Register' })).not.toBeInTheDocument();
  });

  it('always offers a "View all events" link to /events', () => {
    vi.setSystemTime(new Date('2026-05-01T12:00:00-05:00'));
    const { unmount } = renderNext();
    expect(screen.getByRole('link', { name: 'View all events' })).toHaveAttribute('href', '/events');
    unmount();

    // Also present in the season-ended state.
    vi.setSystemTime(new Date('2027-01-01T12:00:00-05:00'));
    renderNext();
    expect(screen.getByRole('link', { name: 'View all events' })).toHaveAttribute('href', '/events');
  });
});
