import { Helmet } from 'react-helmet-async';

import { buildBusinessJsonLd } from './businessJsonLdSchema';

interface BusinessJsonLdProps {
  /** Use the safe LocalBusiness type instead of SportsActivityLocation (PRD §7). */
  fallbackToLocalBusiness?: boolean;
}

export function BusinessJsonLd({ fallbackToLocalBusiness = false }: BusinessJsonLdProps) {
  const jsonLd = buildBusinessJsonLd(fallbackToLocalBusiness);

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
