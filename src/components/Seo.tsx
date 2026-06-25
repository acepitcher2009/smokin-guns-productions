import { Helmet } from 'react-helmet-async';

import { seo } from '../data/seo';
import type { PageKey } from '../data/seo';

const SITE_ORIGIN = 'https://smokingunsproductions.com';

interface SeoProps {
  pageKey: PageKey;
}

export function Seo({ pageKey }: SeoProps) {
  const page = seo[pageKey];
  const canonicalUrl = `${SITE_ORIGIN}${page.canonicalPath}`;
  const ogTitle = page.ogTitle ?? page.title;
  const ogDescription = page.ogDescription ?? page.description;
  const ogImageUrl = `${SITE_ORIGIN}${page.ogImage}`;

  return (
    <Helmet>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  );
}
