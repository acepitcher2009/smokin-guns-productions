import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';

import { EventJsonLd } from './EventJsonLd';
import { buildEventJsonLd } from './eventJsonLdSchema';
import { businessInfo } from '../data/businessInfo';
import { season, type SeasonEvent } from '../data/events';
import { venues } from '../data/venues';

/**
 * The JSON-LD is delivered through react-helmet-async's <script type="application/ld+json">.
 * Helmet's client-side script injection is not observable through document.head in this
 * jsdom harness, so the light smoke test asserts the contract that matters — valid, parseable
 * Event JSON-LD with the correct shape — by round-tripping the builder's output through
 * JSON.stringify/JSON.parse (proving it ships as valid JSON-LD), and separately confirms the
 * component renders without crashing inside HelmetProvider.
 */
function findEvent(id: string): SeasonEvent {
  const event = season.find((e) => e.id === id);
  if (!event) throw new Error(`Test fixture missing event: ${id}`);
  return event;
}

function parsedBlocks(event: SeasonEvent): Record<string, unknown>[] {
  // Round-trip to prove each emitted payload is valid, parseable JSON (as it ships in the script).
  return JSON.parse(JSON.stringify(buildEventJsonLd(event)));
}

describe('EventJsonLd', () => {
  it('renders without crashing inside HelmetProvider', () => {
    expect(() =>
      render(
        <HelmetProvider>
          <EventJsonLd event={findEvent('magnolia-playday-2026-06-27')} />
        </HelmetProvider>
      )
    ).not.toThrow();
  });

  it('emits a single Event block for a Magnolia playday with the correct resolved venue', () => {
    const blocks = parsedBlocks(findEvent('magnolia-playday-2026-06-27'));
    expect(blocks).toHaveLength(1);

    const block = blocks[0];
    expect(block['@context']).toBe('https://schema.org');
    expect(block['@type']).toBe('Event');
    expect(block.eventStatus).toBe('https://schema.org/EventScheduled');
    expect(block.eventAttendanceMode).toBe('https://schema.org/OfflineEventAttendanceMode');

    const organizer = block.organizer as Record<string, unknown>;
    expect(organizer['@type']).toBe('Organization');
    expect(organizer.name).toBe("Smokin' Guns Productions LLC");
    expect(organizer.name).toBe(businessInfo.legalName);
    expect(organizer.url).toBe(businessInfo.url);

    const location = block.location as Record<string, unknown>;
    expect(location['@type']).toBe('Place');
    expect(location.name).toBe('Magnolia Cowboy Church');
    expect(location.name).toBe(venues.magnolia.name);

    const address = location.address as Record<string, unknown>;
    expect(address['@type']).toBe('PostalAddress');
    expect(address.addressLocality).toBe('Magnolia');
    expect(address.addressLocality).toBe(venues.magnolia.city);
    expect(address.streetAddress).toBe(venues.magnolia.streetAddress);
    expect(address.addressRegion).toBe(venues.magnolia.state);
    expect(address.postalCode).toBe(venues.magnolia.zip);
    expect(address.addressCountry).toBe('US');
  });

  it('emits BOTH an A.M. (10:15) and a P.M. (18:00) Event for the Snook Jackpot, at the Snook venue', () => {
    const blocks = parsedBlocks(findEvent('snook-jackpot-2026-06-20'));
    expect(blocks).toHaveLength(2);

    const startDates = blocks.map((b) => b.startDate as string);
    expect(startDates.some((d) => d.includes('T10:15'))).toBe(true);
    expect(startDates.some((d) => d.includes('T18:00'))).toBe(true);

    for (const block of blocks) {
      expect(block['@type']).toBe('Event');
      expect(block.name).toContain('SNOOK JACKPOT');
      const location = block.location as Record<string, unknown>;
      const address = location.address as Record<string, unknown>;
      expect(address.addressLocality).toBe('Somerville');
      expect(address.addressLocality).toBe(venues.snook.city);
    }

    // The A.M./P.M. distinction is expressed in the names, not collapsed.
    expect(blocks.some((b) => (b.name as string).includes('A.M.'))).toBe(true);
    expect(blocks.some((b) => (b.name as string).includes('P.M.'))).toBe(true);
  });

  it('preserves the 11:00am A.M. start for a May 30 series date (plus the 6:00pm P.M.)', () => {
    const blocks = parsedBlocks(findEvent('snook-series-2026-05-30'));
    expect(blocks).toHaveLength(2);
    const startDates = blocks.map((b) => b.startDate as string);
    expect(startDates.some((d) => d.includes('T11:00'))).toBe(true);
    expect(startDates.some((d) => d.includes('T18:00'))).toBe(true);
  });

  it('every emitted block carries EventScheduled, OfflineEventAttendanceMode, and the organizer', () => {
    const samples = [
      'snook-series-2026-06-13', // 10:15 AM series
      'snook-jackpot-2026-06-20',
      'magnolia-playday-2026-07-18',
      'waller-shootout-qualifier-2026-03',
      'dayshow-2026-01-03',
      'pick-your-poison-2026-10-24',
    ];

    for (const id of samples) {
      for (const block of parsedBlocks(findEvent(id))) {
        expect(block['@type']).toBe('Event');
        expect(block.eventStatus).toBe('https://schema.org/EventScheduled');
        expect(block.eventAttendanceMode).toBe('https://schema.org/OfflineEventAttendanceMode');
        const organizer = block.organizer as Record<string, unknown>;
        expect(organizer.name).toBe("Smokin' Guns Productions LLC");
      }
    }
  });

  it('omits geo from location while every venue geo is null (PRD §10 item 7)', () => {
    // Guard the precondition: this test asserts the null branch.
    expect(venues.snook.geo).toBeNull();
    expect(venues.magnolia.geo).toBeNull();
    expect(venues.waller.geo).toBeNull();

    for (const event of season) {
      for (const block of parsedBlocks(event)) {
        const location = block.location as Record<string, unknown>;
        expect('geo' in location).toBe(false);
      }
    }
  });

  it('every dated event in the season produces at least one valid Event block', () => {
    for (const event of season) {
      const blocks = parsedBlocks(event);
      expect(blocks.length).toBeGreaterThanOrEqual(1);
      for (const block of blocks) {
        expect(block['@type']).toBe('Event');
        expect(typeof block.startDate).toBe('string');
        expect(block.name).toContain(event.title);
      }
    }
  });
});
