import { Helmet } from 'react-helmet-async';

import type { SeasonEvent } from '../data/events';
import { buildEventJsonLd } from './eventJsonLdSchema';

interface EventJsonLdProps {
  event: SeasonEvent;
}

export function EventJsonLd({ event }: EventJsonLdProps) {
  const blocks = buildEventJsonLd(event);

  return (
    <Helmet>
      {blocks.map((block, i) => (
        <script key={`${event.id}-${i}`} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
