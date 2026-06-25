import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import { AppServer } from './App';
import type { HelmetSsgContext } from './App';

export interface PrerenderResult {
  /** Rendered #root markup for the route, with head tags hoisted out. */
  html: string;
  /** Serialized <head> tags (title + meta + canonical/OG/Twitter + JSON-LD). */
  head: string;
}

// React 19 (via react-helmet-async's React 19 dispatcher) renders the document
// metadata — <title>, <meta>, <link rel="canonical">, and the
// application/ld+json <script> blocks — INLINE in the rendered markup rather
// than into a separate helmet server-state object. For a static prerender we
// must lift those tags into the real <head> so non-JS crawlers and OG scrapers
// read them where they belong. These patterns match exactly the tags Seo.tsx,
// BusinessJsonLd.tsx and EventJsonLd.tsx emit. Resource hints React injects for
// runtime (e.g. <link rel="preload">) are intentionally left in the body.
const HOISTABLE_PATTERNS: RegExp[] = [
  /<title>[\s\S]*?<\/title>/g,
  /<meta\s+name="description"[^>]*\/?>/g,
  /<meta\s+property="og:[^"]*"[^>]*\/?>/g,
  /<meta\s+name="twitter:[^"]*"[^>]*\/?>/g,
  /<link\s+rel="canonical"[^>]*\/?>/g,
  /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/g,
];

function extractHead(markup: string): { html: string; head: string } {
  const collected: string[] = [];
  let html = markup;

  for (const pattern of HOISTABLE_PATTERNS) {
    const matches = html.match(pattern);
    if (matches) {
      collected.push(...matches);
      html = html.replace(pattern, '');
    }
  }

  return { html, head: collected.join('\n    ') };
}

/**
 * Build-time only entry. Renders one clean URL to static markup, then hoists the
 * per-page document metadata + JSON-LD out of the body and into a head string so
 * the prerender script can place them in the route's static <head>. Mirrors
 * src/main.tsx's client entry (same AppShell, same StrictMode) so the body that
 * remains hydrates cleanly — React 19 re-hoists the metadata at runtime and
 * dedupes against the tags we placed in <head>.
 */
export function render(url: string): PrerenderResult {
  const helmetContext: HelmetSsgContext = {};

  const markup = renderToString(
    <StrictMode>
      <AppServer location={url} helmetContext={helmetContext} />
    </StrictMode>,
  );

  return extractHead(markup);
}
