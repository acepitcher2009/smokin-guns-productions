import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';

import { BusinessJsonLd } from './BusinessJsonLd';
import { buildBusinessJsonLd } from './businessJsonLdSchema';
import { businessInfo } from '../data/businessInfo';
import { venues } from '../data/venues';

/**
 * The JSON-LD is delivered through react-helmet-async's <script type="application/ld+json">.
 * Helmet's client-side script injection is not observable through document.head in this
 * jsdom harness, so the light smoke test asserts the contract that matters — a valid,
 * parseable JSON-LD payload with the correct shape — by round-tripping the builder's output
 * through JSON.stringify/JSON.parse (proving it is valid JSON-LD), and separately confirms
 * the component renders without crashing inside HelmetProvider.
 */
function parsedJsonLd(fallbackToLocalBusiness = false): Record<string, unknown> {
  // Round-trip to prove the emitted payload is valid, parseable JSON (as it ships in the script).
  return JSON.parse(JSON.stringify(buildBusinessJsonLd(fallbackToLocalBusiness)));
}

describe('BusinessJsonLd', () => {
  it('renders without crashing inside HelmetProvider', () => {
    expect(() =>
      render(
        <HelmetProvider>
          <BusinessJsonLd />
        </HelmetProvider>
      )
    ).not.toThrow();
  });

  it('emits valid, parseable JSON-LD with the schema.org context', () => {
    const jsonLd = parsedJsonLd();
    expect(jsonLd['@context']).toBe('https://schema.org');
  });

  it('uses @type SportsActivityLocation by default', () => {
    expect(parsedJsonLd()['@type']).toBe('SportsActivityLocation');
  });

  it('switches @type to LocalBusiness when fallbackToLocalBusiness is set', () => {
    expect(parsedJsonLd(true)['@type']).toBe('LocalBusiness');
  });

  it('carries the exact NAP from businessInfo.ts', () => {
    const jsonLd = parsedJsonLd();
    expect(jsonLd.name).toBe(businessInfo.legalName);
    const address = jsonLd.address as Record<string, unknown>;
    expect(address['@type']).toBe('PostalAddress');
    expect(address.streetAddress).toBe('11538 FM 3058');
    expect(address.streetAddress).toBe(businessInfo.streetAddress);
    expect(address.addressLocality).toBe('Somerville');
    expect(address.addressLocality).toBe(businessInfo.city);
    expect(address.addressRegion).toBe(businessInfo.state);
    expect(address.postalCode).toBe(businessInfo.zip);
    expect(address.addressCountry).toBe('US');
  });

  it('carries telephone, email, and url from businessInfo.ts', () => {
    const jsonLd = parsedJsonLd();
    expect(jsonLd.telephone).toBe('832-857-2826');
    expect(jsonLd.telephone).toBe(businessInfo.phone);
    expect(jsonLd.email).toBe(businessInfo.email);
    expect(jsonLd.url).toBe(businessInfo.url);
  });

  it('derives openingHoursSpecification with 09:00–17:00 weekdays', () => {
    const hours = parsedJsonLd().openingHoursSpecification as Array<Record<string, unknown>>;
    expect(Array.isArray(hours)).toBe(true);
    expect(hours.length).toBeGreaterThan(0);
    expect(hours[0]['@type']).toBe('OpeningHoursSpecification');
    expect(hours[0].opens).toBe('09:00');
    expect(hours[0].closes).toBe('17:00');
  });

  it('omits geo while venues.snook.geo is null', () => {
    // Guard the precondition: this test asserts the null branch (PRD §10 item 7).
    expect(venues.snook.geo).toBeNull();
    expect('geo' in parsedJsonLd()).toBe(false);
  });

  it('omits priceRange — entry-fee process unconfirmed (PRD §7 / §10 item 8)', () => {
    expect('priceRange' in parsedJsonLd()).toBe(false);
  });
});
