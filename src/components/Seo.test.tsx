import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';

import { Seo } from './Seo';
import { seo } from '../data/seo';

describe('Seo', () => {
  it('sets document.title to the seo.ts title for the page key', async () => {
    render(
      <HelmetProvider>
        <Seo pageKey="home" />
      </HelmetProvider>
    );
    await waitFor(() => expect(document.title).toBe(seo.home.title));
  });

  it('emits a single-encoded title — a literal apostrophe, never &#39; or &amp;', async () => {
    render(
      <HelmetProvider>
        <Seo pageKey="home" />
      </HelmetProvider>
    );
    await waitFor(() => expect(document.title).toBe(seo.home.title));
    expect(document.title).toContain("'");
    expect(document.title).not.toContain('&#39;');
    expect(document.title).not.toContain('&amp;');
  });

  it('renders a description meta with the seo.ts description', async () => {
    render(
      <HelmetProvider>
        <Seo pageKey="home" />
      </HelmetProvider>
    );
    await waitFor(() => {
      const description = document.head.querySelector('meta[name="description"]');
      expect(description).not.toBeNull();
      expect(description?.getAttribute('content')).toBe(seo.home.description);
    });
  });

  it('adds a canonical link ending in "/" for home', async () => {
    render(
      <HelmetProvider>
        <Seo pageKey="home" />
      </HelmetProvider>
    );
    await waitFor(() => {
      const canonical = document.head.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toMatch(/\/$/);
    });
  });

  it('adds a canonical link ending in "/events" for events', async () => {
    render(
      <HelmetProvider>
        <Seo pageKey="events" />
      </HelmetProvider>
    );
    await waitFor(() => {
      const canonical = document.head.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toMatch(/\/events$/);
    });
  });

  it('emits an og:image meta tag', async () => {
    render(
      <HelmetProvider>
        <Seo pageKey="home" />
      </HelmetProvider>
    );
    await waitFor(() => {
      const ogImage = document.head.querySelector('meta[property="og:image"]');
      expect(ogImage).not.toBeNull();
    });
  });

  it('emits a twitter:card of summary_large_image', async () => {
    render(
      <HelmetProvider>
        <Seo pageKey="home" />
      </HelmetProvider>
    );
    await waitFor(() => {
      const twitterCard = document.head.querySelector('meta[name="twitter:card"]');
      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
    });
  });
});
