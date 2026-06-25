import { describe, expect, it } from 'vitest';

import { businessInfo } from './businessInfo';
import { nav } from './nav';
import { results } from './results';
import { season } from './events';
import { seo } from './seo';
import { sponsorTiers } from './sponsorTiers';
import { sponsors } from './sponsors';
import { venues } from './venues';

describe('nav', () => {
  it('has six items, starts at / and includes /contact', () => {
    expect(nav).toHaveLength(6);
    expect(nav[0].path).toBe('/');
    expect(nav.map((item) => item.path)).toContain('/contact');
  });
});

describe('businessInfo', () => {
  it('carries the authoritative NAP and verbatim mission', () => {
    expect(businessInfo.phone).toBe('832-857-2826');
    expect(businessInfo.city).toBe('Somerville');
    expect(businessInfo.missionApproved).toBe(false);
    expect(businessInfo.missionVerbatim).toContain('a upbeat');
  });
});

describe('venues', () => {
  it('has exact Snook street and null Waller geo', () => {
    expect(venues.snook.streetAddress).toBe('11538 FM 3058');
    expect(venues.waller.geo).toBeNull();
  });
});

describe('season', () => {
  it('carries the Snook Jackpot with exact AM/PM race times', () => {
    const jackpot = season.find((event) => event.id === 'snook-jackpot-2026-06-20');
    expect(jackpot).toBeDefined();
    expect(jackpot?.title).toBe('SNOOK JACKPOT');
    expect(jackpot?.kind).toBe('jackpot');
    expect(jackpot?.amRace).toBe('10:15am');
    expect(jackpot?.pmRace).toBe('6:00pm');
  });

  it('carries the May 30 series event with an 11:00am race', () => {
    const may30 = season.find((event) => event.id === 'snook-series-2026-05-30');
    expect(may30?.amRace).toBe('11:00am');
  });
});

describe('results', () => {
  it('uses the friendly label and never exposes a tinyurl', () => {
    expect(results.label).toBe('View Series Points & Standings');
    expect(results.destinationUrl).not.toContain('tinyurl');
  });
});

describe('sponsorTiers & sponsors', () => {
  it('has three tiers with exact prices and eight sponsors', () => {
    expect(sponsorTiers).toHaveLength(3);
    expect(sponsorTiers.map((tier) => tier.price)).toEqual(['$5,000', '$1,500', '$1,000']);
    expect(sponsors).toHaveLength(8);
  });
});

describe('seo', () => {
  it('home description is single-encoded (no entity escapes)', () => {
    expect(seo.home.description).not.toContain('&#39;');
    expect(seo.home.description).not.toContain('&amp;');
  });
});
