import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SponsorCard } from './SponsorCard';
import { sponsors } from '../data/sponsors';

function sponsor(name: string) {
  const found = sponsors.find((s) => s.name === name);
  if (!found) throw new Error(`fixture sponsor not found: ${name}`);
  return found;
}

describe('SponsorCard', () => {
  it('renders Teal Services LLC tagline, a tel: link, and a site link with domain text', () => {
    render(<SponsorCard sponsor={sponsor('Teal Services LLC')} />);

    expect(
      screen.getByText('Water and Wastewater Construction / General Contractor')
    ).toBeInTheDocument();

    const telLink = screen.getByText('281-467-4407').closest('a');
    expect(telLink).toHaveAttribute('href', 'tel:2814674407');

    // Visible site link text is the bare domain, not a protocol or shortener.
    const siteLink = screen.getByText('Tealtexas.com');
    expect(siteLink).toBeInTheDocument();
    expect(siteLink.closest('a')).toHaveAttribute('href', 'https://Tealtexas.com');
  });

  it('renders a sponsor with no url as a name with no external link', () => {
    const { container } = render(<SponsorCard sponsor={sponsor('Lavished Photography')} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Lavished Photography' })
    ).toBeInTheDocument();
    // No url -> no external link rendered.
    expect(container.querySelector('a[target="_blank"]')).toBeNull();
  });
});
