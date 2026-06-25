import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ContactInfo } from './ContactInfo';
import { businessInfo } from '../data/businessInfo';

describe('ContactInfo', () => {
  it('renders the exact NAP inside a semantic <address>', () => {
    const { container } = render(<ContactInfo />);
    const address = container.querySelector('address');
    expect(address).not.toBeNull();
    const text = address?.textContent ?? '';
    expect(text).toContain('Snook Rodeo Arena');
    expect(text).toContain('11538 FM 3058');
    expect(text).toContain('Somerville, TX 77874');
  });

  it('renders the phone as a tel: link with the visible human-readable number', () => {
    render(<ContactInfo />);
    expect(screen.getByRole('link', { name: '832-857-2826' })).toHaveAttribute(
      'href',
      'tel:8328572826'
    );
  });

  it('renders the email as a mailto: link', () => {
    render(<ContactInfo />);
    expect(
      screen.getByRole('link', { name: 'smokingunsproductions@gmail.com' })
    ).toHaveAttribute('href', 'mailto:smokingunsproductions@gmail.com');
  });

  it('renders all three hours lines verbatim from businessInfo', () => {
    const { container } = render(<ContactInfo />);
    const text = container.textContent ?? '';
    expect(text).toContain('Mon–Fri 9:00am–5:00pm');
    expect(text).toContain(businessInfo.hours.weekend);
    expect(text).toContain(businessInfo.hours.holidays);
  });

  it('renders the contact intro copy verbatim, including the sponsorship line', () => {
    const { container } = render(<ContactInfo />);
    const text = container.textContent ?? '';
    expect(text).toContain(businessInfo.contactIntro);
    expect(text).toContain('Ask about our 2026 Sponsorship Opportunity.');
  });

  it('uses an <h2> for the section heading (page owns the h1)', () => {
    render(<ContactInfo />);
    expect(screen.getByRole('heading', { level: 2, name: 'Contact Us' })).toBeInTheDocument();
  });
});
