import { describe, expect, it } from 'vitest';

import robots from '../../public/robots.txt?raw';
import sitemap from '../../public/sitemap.xml?raw';

const SITE_ORIGIN = 'https://smokingunsproductions.com';
const paths = ['/', '/events', '/results', '/about', '/sponsors', '/register', '/contact'];

describe('public/robots.txt', () => {
  it('allows crawling', () => {
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
  });

  it('references the sitemap', () => {
    expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`);
  });
});

describe('public/sitemap.xml', () => {
  it.each(paths)('has a <loc> for %s', (path) => {
    expect(sitemap).toContain(`<loc>${SITE_ORIGIN}${path}</loc>`);
  });

  it('does not contain a wildcard SPA fallback route', () => {
    expect(sitemap).not.toContain('*');
  });
});
