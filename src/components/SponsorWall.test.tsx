import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SponsorWall } from './SponsorWall';
import { sponsors } from '../data/sponsors';

describe('SponsorWall', () => {
  it('renders one card per sponsor in the data (data-driven count, >= 8)', () => {
    render(<SponsorWall />);

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.length).toBe(sponsors.length);
    expect(headings.length).toBeGreaterThanOrEqual(8);
  });

  it('renders representative sponsor names as real text', () => {
    render(<SponsorWall />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Teal Services LLC' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Hay Girl Sales & Deliveries' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: "Charlotte's Saddlery" })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'The Jaeggi Team' })).toBeInTheDocument();
  });

  it('renders a tel: link for a sponsor that has a phone number', () => {
    render(<SponsorWall />);

    const phoneSponsor = sponsors.find((s) => s.phone);
    expect(phoneSponsor).toBeDefined();
    const telLinks = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.startsWith('tel:'));
    expect(telLinks.length).toBeGreaterThan(0);
  });

  it('renders no core sponsor content as image-only — every sponsor name is selectable text', () => {
    const { container } = render(<SponsorWall />);

    // Each sponsor name appears as a real text heading, not inside an <img>.
    for (const sponsor of sponsors) {
      expect(
        screen.getByRole('heading', { level: 3, name: sponsor.name })
      ).toBeInTheDocument();
    }
    // Any image present is a decorative/labelled logo, never the sole carrier of the name.
    container.querySelectorAll('img').forEach((img) => {
      expect(img.getAttribute('alt')).toBeTruthy();
    });
  });
});
