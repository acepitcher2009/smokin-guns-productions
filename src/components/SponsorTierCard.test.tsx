import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SponsorTierCard } from './SponsorTierCard';
import { sponsorTiers } from '../data/sponsorTiers';

function tier(name: string) {
  const found = sponsorTiers.find((t) => t.name === name);
  if (!found) throw new Error(`fixture tier not found: ${name}`);
  return found;
}

describe('SponsorTierCard', () => {
  it('renders the Platinum tier name, EXACT price, and a benefit as real text from data', () => {
    render(<SponsorTierCard tier={tier('Platinum')} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Platinum' })).toBeInTheDocument();
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText(/banners displayed at each event/)).toBeInTheDocument();
  });

  it('renders the Gold tier EXACT price ($1,500) from data', () => {
    render(<SponsorTierCard tier={tier('Gold')} />);
    expect(screen.getByText('$1,500')).toBeInTheDocument();
  });

  it('renders the Silver tier EXACT price and the obscured-benefits placeholder VERBATIM', () => {
    render(<SponsorTierCard tier={tier('Silver')} />);

    expect(screen.getByText('$1,000')).toBeInTheDocument();
    // TBC discipline: the stored placeholder renders as-is, never invented (PRD §10 item 3).
    expect(screen.getByText('Additional benefits — confirm with owner')).toBeInTheDocument();
  });

  it('renders benefits as a semantic list of real text (not an image)', () => {
    render(<SponsorTierCard tier={tier('Platinum')} />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(tier('Platinum').benefits.length);
  });

  it('has no teal CTA button and no white text on the teal ground (CONVENTIONS §A/§E)', () => {
    const { container } = render(<SponsorTierCard tier={tier('Platinum')} />);

    // Teal is a section ground, never a CTA — the card has no button at all.
    expect(container.querySelector('button')).toBeNull();
    // AA on the teal ground: no element may use text-white (white-on-teal fails AA).
    expect(container.querySelector('.text-white')).toBeNull();
    expect(container.querySelector('[class*="bg-teal"].text-white')).toBeNull();
    // The card ground is teal-deep and its text is ink.
    const card = container.querySelector('article');
    expect(card?.className).toContain('bg-teal-deep');
    expect(card?.className).toContain('text-ink');
  });
});
