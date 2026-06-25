import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { VenueMap } from './VenueMap';
import { CONSENT_KEY } from './consent';

describe('VenueMap', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the privacy placeholder and no iframe until consent is given', () => {
    render(<VenueMap />);

    expect(screen.getByText(/loads after you accept/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show map' })).toBeInTheDocument();
    expect(screen.queryByTitle(/Map to Snook Rodeo Arena/i)).not.toBeInTheDocument();
  });

  it('reveals the lazy, titled map iframe after clicking "Show map"', async () => {
    const user = userEvent.setup();
    render(<VenueMap />);

    await user.click(screen.getByRole('button', { name: 'Show map' }));

    const frame = screen.getByTitle(/Map to Snook Rodeo Arena/i);
    expect(frame).toBeInTheDocument();
    expect(frame).toHaveAttribute('loading', 'lazy');
    // Records the shared consent signal ConsentNotice persists.
    expect(localStorage.getItem(CONSENT_KEY)).toBe('dismissed');
  });

  it('renders the map immediately when consent is already stored', () => {
    localStorage.setItem(CONSENT_KEY, 'dismissed');
    render(<VenueMap />);

    expect(screen.getByTitle(/Map to Snook Rodeo Arena/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show map' })).not.toBeInTheDocument();
  });

  it('always shows the venue address from venues.ts and a descriptive directions link', () => {
    render(<VenueMap />);

    expect(screen.getByText(/11538 FM 3058/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Get directions to Snook Rodeo Arena/i })
    ).toBeInTheDocument();
  });

  it('reserves map height with an aspect-ratio utility, not a hardcoded pixel height', () => {
    localStorage.setItem(CONSENT_KEY, 'dismissed');
    const { container } = render(<VenueMap />);

    const wrapper = container.querySelector('.aspect-\\[4\\/3\\]');
    expect(wrapper).not.toBeNull();
    expect(container.innerHTML).not.toMatch(/h-\[\d+px\]/);
  });
});
