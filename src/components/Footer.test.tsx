import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Footer } from './Footer';
import { businessInfo } from '../data/businessInfo';
import { nav } from '../data/nav';

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe('Footer', () => {
  it('renders the contentinfo landmark with the legal name as a heading', () => {
    renderFooter();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: "Smokin' Guns Productions LLC" })
    ).toBeInTheDocument();
  });

  it('renders the exact NAP (Somerville locality) inside a single <address>', () => {
    const { container } = renderFooter();
    const addresses = container.querySelectorAll('address');
    expect(addresses).toHaveLength(1);
    const address = addresses[0];
    expect(address.textContent).toContain('Snook Rodeo Arena');
    expect(address.textContent).toContain('11538 FM 3058');
    expect(address.textContent).toContain('Somerville, TX 77874');
  });

  it('renders the phone as a tel: link and the email as a mailto: link', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: '832-857-2826' })).toHaveAttribute(
      'href',
      'tel:8328572826'
    );
    expect(
      screen.getByRole('link', { name: 'smokingunsproductions@gmail.com' })
    ).toHaveAttribute('href', 'mailto:smokingunsproductions@gmail.com');
  });

  it('renders all three hours lines from businessInfo', () => {
    const { container } = renderFooter();
    // Hours render as text nodes split by <br />; assert on the container text.
    const text = container.textContent ?? '';
    expect(text).toContain(businessInfo.hours.weekdays);
    expect(text).toContain(businessInfo.hours.weekend);
    expect(text).toContain(businessInfo.hours.holidays);
  });

  it('repeats all six nav links from nav.ts in the footer nav', () => {
    renderFooter();
    const footerNav = screen.getByRole('navigation', { name: 'Footer' });
    expect(nav).toHaveLength(6);
    for (const item of nav) {
      expect(within(footerNav).getByRole('link', { name: item.label })).toHaveAttribute(
        'href',
        item.path
      );
    }
  });

  it('shows a dynamic copyright year (current year, never a stale literal)', () => {
    const { container } = renderFooter();
    const currentYear = String(new Date().getFullYear());
    const text = container.textContent ?? '';
    expect(text).toContain('©');
    expect(text).toContain(`© ${currentYear}`);
    // Guards against a hardcoded "© 2025" regression (discard item 4).
    expect(text).not.toContain('2025');
  });

  it('renders an owned Privacy link and no GoDaddy/wsimg branding', () => {
    const { container } = renderFooter();
    const privacy = screen.getByRole('link', { name: 'Privacy & Consent' });
    expect(privacy).toHaveAttribute('href', '/privacy');
    // Owned link, never a third-party policy URL.
    expect(privacy.getAttribute('href')).not.toMatch(/godaddy|wsimg|google/i);

    const html = container.innerHTML;
    expect(html).not.toMatch(/godaddy/i);
    expect(html).not.toMatch(/wsimg/i);
  });
});
