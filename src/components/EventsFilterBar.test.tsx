import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EventsFilterBar } from './EventsFilterBar';
import { kindLabels } from './eventsFilter';
import type { EventKind } from '../data/events';
import { venues } from '../data/venues';

/**
 * Light smoke test. Proves the controlled bar derives its options from
 * venues.ts (venue names) and the passed-in availableKinds (mapped through
 * kindLabels), and reports selection changes via the onChange handlers.
 * Page-level proof that filtering narrows the list lives in the Events page
 * test (story 22).
 */
describe('EventsFilterBar', () => {
  const availableKinds: EventKind[] = ['series', 'jackpot', 'playday'];

  function renderBar(overrides: Partial<Parameters<typeof EventsFilterBar>[0]> = {}) {
    const onVenueChange = vi.fn();
    const onKindChange = vi.fn();
    render(
      <EventsFilterBar
        venue="all"
        kind="all"
        availableKinds={availableKinds}
        onVenueChange={onVenueChange}
        onKindChange={onKindChange}
        {...overrides}
      />
    );
    return { onVenueChange, onKindChange };
  }

  it('renders the venue select with options derived from venues.ts plus "All venues"', () => {
    renderBar();
    const venueSelect = screen.getByLabelText('Filter by venue');
    expect(venueSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All venues' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: venues.snook.name })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: venues.magnolia.name })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: venues.waller.name })).toBeInTheDocument();
  });

  it('renders the kind select with options from availableKinds via kindLabels plus "All types"', () => {
    renderBar();
    expect(screen.getByLabelText('Filter by type')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All types' })).toBeInTheDocument();
    for (const k of availableKinds) {
      expect(screen.getByRole('option', { name: kindLabels[k] })).toBeInTheDocument();
    }
    // A kind absent from availableKinds is NOT rendered (data-derived, not hardcoded).
    expect(screen.queryByRole('option', { name: kindLabels.shootout })).not.toBeInTheDocument();
  });

  it('defaults to "all" for both controls', () => {
    renderBar();
    expect(screen.getByLabelText<HTMLSelectElement>('Filter by venue').value).toBe('all');
    expect(screen.getByLabelText<HTMLSelectElement>('Filter by type').value).toBe('all');
  });

  it('selecting a venue option calls onVenueChange with the venue id', async () => {
    const user = userEvent.setup();
    const { onVenueChange } = renderBar();
    await user.selectOptions(screen.getByLabelText('Filter by venue'), venues.magnolia.name);
    expect(onVenueChange).toHaveBeenCalledWith('magnolia');
  });

  it('selecting a kind option calls onKindChange with the kind', async () => {
    const user = userEvent.setup();
    const { onKindChange } = renderBar();
    await user.selectOptions(screen.getByLabelText('Filter by type'), kindLabels.jackpot);
    expect(onKindChange).toHaveBeenCalledWith('jackpot');
  });
});
