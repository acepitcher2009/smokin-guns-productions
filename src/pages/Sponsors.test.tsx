import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Sponsors } from './Sponsors';

import { sponsors } from '../data/sponsors';

// Light-tier smoke test: the Sponsors composition renders the "Join In" lead-in,
// the three priced tiers, the ≥8-sponsor wall, and the single brand-red CTA to
// /contact — with exactly one <h1> and no white text on the teal band (AA rule).
function renderSponsors() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Sponsors />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Sponsors page', () => {
  it('renders exactly one <h1> ("2026 Sponsors")', () => {
    renderSponsors();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('2026 Sponsors');
  });

  it('renders the "Join In" lead-in heading', () => {
    renderSponsors();
    expect(screen.getByRole('heading', { name: 'Join In' })).toBeInTheDocument();
  });

  it('renders the three tiers with their exact prices', () => {
    renderSponsors();
    expect(screen.getByRole('heading', { level: 3, name: 'Platinum' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Gold' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Silver' })).toBeInTheDocument();
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('$1,500')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('renders the full sponsor wall (≥8 sponsors)', () => {
    renderSponsors();
    expect(sponsors.length).toBeGreaterThanOrEqual(8);
    for (const sponsor of sponsors) {
      expect(
        screen.getByRole('heading', { level: 3, name: sponsor.name })
      ).toBeInTheDocument();
    }
  });

  it('renders the single brand-red CTA linking to /contact', () => {
    renderSponsors();
    const cta = screen.getByRole('link', { name: 'Become a 2026 Sponsor' });
    expect(cta).toHaveAttribute('href', '/contact');
  });

  it('uses no white text on the teal program ground (AA rule)', () => {
    const { container } = renderSponsors();
    const tealBand = container.querySelector('.bg-teal');
    expect(tealBand).not.toBeNull();
    // text-white is AA-valid only on the brand-red CTA ground; any text-white
    // inside the teal band must therefore also carry bg-brand-red (the single CTA).
    // No bare text-white may sit directly on the teal ground (white-on-teal fails AA).
    const whiteTextNodes = tealBand?.querySelectorAll('.text-white') ?? [];
    for (const node of whiteTextNodes) {
      expect(node.classList.contains('bg-brand-red')).toBe(true);
    }
  });
});
