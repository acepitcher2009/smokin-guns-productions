import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createEvents } from 'ics';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AddToCalendarButton } from './AddToCalendarButton';
import { buildIcsAttributes } from './addToCalendarIcs';
import { season, type SeasonEvent } from '../data/events';
import { venues } from '../data/venues';

/**
 * Light smoke test. jsdom has no real Blob download, so we stub the two browser
 * primitives the download path touches — URL.createObjectURL / revokeObjectURL
 * and HTMLAnchorElement.prototype.click — and assert the click initiates a
 * download. The AM/PM and venue-location contract is asserted against the
 * generated .ics text via the pure buildIcsAttributes helper + ics.createEvents.
 */
function findEvent(id: string): SeasonEvent {
  const event = season.find((e) => e.id === id);
  if (!event) throw new Error(`Test fixture missing event: ${id}`);
  return event;
}

function generatedIcs(event: SeasonEvent): string {
  const { error, value } = createEvents(buildIcsAttributes(event));
  expect(error).toBeFalsy();
  if (!value) throw new Error('createEvents returned no value');
  return value;
}

describe('AddToCalendarButton', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a labelled tertiary control with the "Add to calendar" text', () => {
    render(<AddToCalendarButton event={findEvent('snook-series-2026-05-30')} />);
    const button = screen.getByRole('button', {
      name: 'Add Snook Summer Buckle Series to calendar',
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Add to calendar');
  });

  it('clicking initiates a download (createObjectURL invoked, anchor clicked, URL revoked)', async () => {
    const user = userEvent.setup();
    render(<AddToCalendarButton event={findEvent('snook-jackpot-2026-06-20')} />);

    await user.click(screen.getByRole('button'));

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('generates an AM+PM event with two VEVENTs at the correct times (Snook Jackpot)', () => {
    const ics = generatedIcs(findEvent('snook-jackpot-2026-06-20'));
    const veventCount = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
    expect(veventCount).toBe(2);
    // A.M. race 10:15 and P.M. race 18:00 both preserved (DTSTART:YYYYMMDDTHHMMSS).
    expect(ics).toContain('20260620T101500');
    expect(ics).toContain('20260620T180000');
  });

  it('preserves the 11:00am AM start for a May 30 series date (plus the 6:00pm PM)', () => {
    const ics = generatedIcs(findEvent('snook-series-2026-05-30'));
    expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe(2);
    expect(ics).toContain('20260530T110000');
    expect(ics).toContain('20260530T180000');
  });

  it('produces a single VEVENT for a single-race Magnolia playday', () => {
    const ics = generatedIcs(findEvent('magnolia-playday-2026-06-27'));
    expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe(1);
  });

  it('resolves the venue location from venues.ts, not a hardcode (Snook address)', () => {
    const ics = generatedIcs(findEvent('snook-jackpot-2026-06-20'));
    // The Snook street address comes from venues.ts.
    expect(ics).toContain(venues.snook.streetAddress); // '11538 FM 3058'
    expect(ics).toContain('11538 FM 3058');
    expect(ics).toContain(venues.snook.name); // 'Snook Rodeo Arena'
  });
});
